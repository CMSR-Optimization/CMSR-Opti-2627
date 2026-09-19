#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

struct TelemetryPacket {
  uint32_t timestamp;
  float voltage;
  float current;
  float temperature;
  float acceleration;
};

// config constants
const int VOLTAGE_PIN = A1; 
const int CURRENT_PIN = A0;

const float CURRENT_SENSITIVITY = 0.020;
const float CURRENT_OFFSET_V = 0.0;
const float SYSTEM_VREF = 5.0;
const int NUM_SAMPLES = 10;
const unsigned long SAMPLE_DELAY_MS = 50;

// global objects
Adafruit_BNO055 bno = Adafruit_BNO055(55);

// state
int sampleIndex = 0;
float voltageSamples[NUM_SAMPLES] = {0};
float currentSamples[NUM_SAMPLES] = {0};
float tempSamples[NUM_SAMPLES] = {0};
float accelSamples[NUM_SAMPLES] = {0};

void setup() {
  Serial.begin(9600);
  
  if (!bno.begin()) {
    Serial.print("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!");
    while (1);
  }
  
  delay(200);
  bno.setExtCrystalUse(true);
}

void loop() {
  // gather raw readings
  voltageSamples[sampleIndex] = readVoltage();
  currentSamples[sampleIndex] = readCurrent();
  tempSamples[sampleIndex] = readTemperature();
  accelSamples[sampleIndex] = readAcceleration();

  sampleIndex++;

  // process and transmit when the buffer is full (every 10 samples)
  if (sampleIndex >= NUM_SAMPLES) {
    transmitAveragedData();
    sampleIndex = 0;
  }

  delay(SAMPLE_DELAY_MS);
}


// HELPER FUNCTIONS

float readVoltage() {
  int rawVal = analogRead(VOLTAGE_PIN);
  
  // TODO: Consider replacing 4.092 and 10 with calculated constants 
  // based on actual hardware voltage divider resistor values
  float v = rawVal / 4.092;
  return v / 10.0;
}

float readCurrent() {
  long rawVal = analogRead(CURRENT_PIN);
  float voltage = (rawVal / 1024.0) * SYSTEM_VREF;
  float current = (voltage - CURRENT_OFFSET_V) / CURRENT_SENSITIVITY;
 
  // clamp negative noise
  return (current < 0.0) ? 0.0 : current;
}

float readTemperature() {
  // bno.getTemp() returns an int8_t, casting to float for consistent averaging
  return (float)bno.getTemp();
}

float readAcceleration() {
  imu::Vector<3> accel = bno.getVector(Adafruit_BNO055::VECTOR_LINEARACCEL);
  // calculate magnitude of the 3D acceleration vector
  return sqrt(sq(accel.x()) + sq(accel.y()) + sq(accel.z()));
}

// calculate averages and transmit
void transmitAveragedData() {
  float vSum = 0, iSum = 0, tSum = 0, aSum = 0;

  for (int i = 0; i < NUM_SAMPLES; i++) {
    vSum += voltageSamples[i];
    iSum += currentSamples[i];
    tSum += tempSamples[i];
    aSum += accelSamples[i];
  }

  TelemetryPacket packet;

  packet.timestamp = millis();
  packet.voltage = vSum / NUM_SAMPLES;
  packet.current = iSum / NUM_SAMPLES;
  packet.temperature = tSum / NUM_SAMPLES;
  packet.acceleration = aSum / NUM_SAMPLES;

  Serial.write((uint8_t*)&packet, sizeof(packet));
}