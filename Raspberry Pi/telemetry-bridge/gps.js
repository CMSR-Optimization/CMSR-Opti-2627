
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const gpsData = {
  latitude: null,
  longitude: null,
  altitude: null,
  velocity: 0,
  fix: false
};

const port = new SerialPort({
  path: 'COM7',
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({
  delimiter: '\r\n'
}));

// Convert NMEA coordinates to decimal degrees
const convertCoordinate = (value, direction) => {
  if (!value) return null;

  const degreesLength =
    direction === 'N' || direction === 'S' ? 2 : 3;

  const degrees = Number(value.slice(0, degreesLength));
  const minutes = Number(value.slice(degreesLength));

  let coordinate = degrees + minutes / 60;

  if (direction === 'S' || direction === 'W') {
    coordinate *= -1;
  }

  return coordinate;
};

port.on('open', () => {
  console.log('Connected to GPS on COM7');
});

parser.on('data', (line) => {
  const fields = line.split(',');

  // Parse GGA: Position, altitude, and fix quality
  if (line.startsWith('$GPGGA') || line.startsWith('$GNGGA')) {
    const quality = Number(fields[6]);

    gpsData.fix = quality > 0;

    if (!gpsData.fix) {
      gpsData.latitude = null;
      gpsData.longitude = null;
      gpsData.altitude = null;
      gpsData.velocity = 0;

      console.log('[GPS] No satellite fix');
      return;
    }

    gpsData.latitude = convertCoordinate(fields[2], fields[3]);
    gpsData.longitude = convertCoordinate(fields[4], fields[5]);
    gpsData.altitude = fields[9] ? Number(fields[9]) : null;

    console.log('\n========== GPS DEBUG ==========');
    console.log('Fix:', gpsData.fix);
    console.log('Satellites:', fields[7]);
    console.log('Latitude:', gpsData.latitude);
    console.log('Longitude:', gpsData.longitude);
    console.log('Altitude:', gpsData.altitude, 'meters');
    console.log('Velocity:', gpsData.velocity.toFixed(3), 'mph');
    console.log('================================\n');
  }

  // Parse RMC: Speed over ground
  if (line.startsWith('$GPRMC') || line.startsWith('$GNRMC')) {
    if (fields[2] !== 'A') {
      gpsData.velocity = 0;
      return;
    }

    // RMC speed is in knots. Convert to mph.
    gpsData.velocity = Number(fields[7] || 0) * 1.15078;
  }
});

port.on('error', (err) => {
  console.error('GPS connection error:', err.message);
});

module.exports = { gpsData };
