const net = require('net');

const gpsData = {
  latitude: null,
  longitude: null,
  altitude: null,
  velocity: 0,
  fix: false
};

const client = net.createConnection({
  host: '127.0.0.1',
  port: 2947
}, () => {
  console.log('Connected to gpsd');

  // Request JSON-formatted GPS reports.
  setTimeout(() => {
    client.write('?WATCH={"enable":true,"json":true}\n');
  });
});

let buffer = '';

client.on('data', (chunk) => {
  buffer += chunk.toString();

  const lines = buffer.split('\n');
  buffer = lines.pop();

  for (const line of lines) {
    if (!line.trim()) continue;

    let report;

    try {
      report = JSON.parse(line);
    } catch {
      continue;
    }

    if (report.class !== 'TPV') continue;

    gpsData.fix = report.mode >= 2;

    if (!gpsData.fix) continue;

    gpsData.latitude = report.lat ?? null;
    gpsData.longitude = report.lon ?? null;
    gpsData.altitude = report.alt ?? null;
    console.log("hello");

    // gpsd reports speed in meters per second.
    // Convert to mph to match your cgps display.
    gpsData.velocity = (report.speed ?? 0) * 2.23694;

    console.log(gpsData);
  }
});

client.on('error', (err) => {
  console.error('GPS connection error:', err.message);
});

module.exports = { gpsData };