const { SerialPort } = require('serialport');
const { Server } = require('socket.io');

const ARDUINO_PORT = "/dev/ttyACM0";

const io = new Server(3001, {
  cors: { origin: '*' }
});

const port = new SerialPort({
  path: ARDUINO_PORT,
  baudRate: 9600
});

const PACKET_SIZE = 20;

console.log("Listening for Arduino on " + ARDUINO_PORT + " ...");

const fs = require('fs');
const path = require('path');

const dataDir = './data';

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const filename = `telemetry_${new Date()
    .toISOString()
    .replace(/[:.]/g, '-')}.csv`;

const logFile = path.join(dataDir, filename);

fs.writeFileSync(
    logFile,
    'timestamp,voltage,current,temperature,acceleration\n'
);

console.log(`Logging telemetry to ${logFile}`);

let buffer = Buffer.alloc(0);

port.on('data', (chunk) => {
  // Add newly received bytes to our buffer
  buffer = Buffer.concat([buffer, chunk]);

  // Process complete packets
  while (buffer.length >= PACKET_SIZE) {
    const packet = buffer.subarray(0, PACKET_SIZE);
    buffer = buffer.subarray(PACKET_SIZE);

    const telemetryData = {
      timestamp: packet.readUInt32LE(0),
      voltage: packet.readFloatLE(4),
      current: packet.readFloatLE(8),
      temperature: packet.readFloatLE(12),
      acceleration: packet.readFloatLE(16),
      velocity: 0
    };

    const line =
      `${telemetryData.timestamp},` +
      `${telemetryData.voltage},` +
      `${telemetryData.current},` +
      `${telemetryData.temperature},` +
      `${telemetryData.acceleration}\n`;

    fs.appendFileSync(logFile, line);

    io.emit('telemetry', telemetryData);
  }
});

port.on('error', (err) => {
  console.error('Serial Port Error: ', err.message);
});

// FAKE TELEMETRY FOR TESTING

// const { Server } = require('socket.io');

// const io = new Server(3001, {
//   cors: { origin: '*' }
// });

// // TODO: add the following section to the actual telemetry code
// console.log("Fake telemetry server running on port 3001");

// const fs = require('fs');
// const path = require('path');

// const dataDir = './data';

// if (!fs.existsSync(dataDir)) {
//     fs.mkdirSync(dataDir);
// }

// const filename = `fake_telemetry_${new Date()
//     .toISOString()
//     .replace(/[:.]/g, '-')}.csv`;

// const logFile = path.join(dataDir, filename);

// fs.writeFileSync(
//     logFile,
//     'timestamp,voltage,current,temperature,acceleration\n'
// );

// console.log(`Logging telemetry to ${logFile}`);

// // Simulate Arduino telemetry
// let timestamp = 0;

// setInterval(() => {
//   timestamp += 500; // Arduino currently sends every ~500ms

//   const telemetryData = {
//     timestamp: timestamp,
//     voltage: 48 + Math.random() * 2,
//     current: 10 + Math.random() * 5,
//     temperature: 25 + Math.random() * 3,
//     acceleration: Math.random() * 2,
//     velocity: 5 + Math.random() * 2
//   };

//   const line =
//     `${telemetryData.timestamp},` +
//     `${telemetryData.voltage},` +
//     `${telemetryData.current},` +
//     `${telemetryData.temperature},` +
//     `${telemetryData.acceleration}\n`;

//   fs.appendFileSync(logFile, line);

//   io.emit('telemetry', telemetryData);
// }, 500);