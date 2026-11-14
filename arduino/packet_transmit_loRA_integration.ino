#include <Wire.h>
#include <SPI.h>
#include <RH_RF95.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

// ---------------- LoRa Configuration ----------------
#define RFM95_CS 53
#define RFM95_RST 9
#define RFM95_INT 2
#define RF95_FREQ 915.0 // Change to 433.0 if using a 433MHz module
RH_RF95 rf95(RFM95_CS, RFM95_INT);

// ---------------- Telemetry Packet ----------------
struct TelemetryPacket {
  uint32_t packetNumber;
  uint32_t timestamp;
  float voltage;
  float current;
  float temperature;
  float acceleration;
};
// ---------------- Sensor Configuration ----------------
const int VOLTAGE_PIN = A1;
const int CURRENT_PIN = A0;

const float CURRENT_SENSITIVITY = 0.020;
const float CURRENT_OFFSET_V = 0.0;
const float SYSTEM_VREF = 5.0;
const int NUM_SAMPLES = 10;
const unsigned long SAMPLE_DELAY_MS = 50;

// ---------------- Sensor Objects ----------------

Adafruit_BNO055 bno = Adafruit_BNO055(55);

// ---------------- Sampling State ----------------

int sampleIndex = 0;

float voltageSamples[NUM_SAMPLES] = {0};
float currentSamples[NUM_SAMPLES] = {0};
float tempSamples[NUM_SAMPLES] = {0};
float accelSamples[NUM_SAMPLES] = {0};

// Persistent packet counter: give every transmitted LoRa packet a unique sequential ID.
uint32_t packetCounter = 0; 
// ---------------- SETUP ----------------

void setup() {
  Serial.begin(9600);

  // Initialize BNO055
  if (!bno.begin()) {
    Serial.println("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!"));
    while (1);
  }

  delay(200);
  bno.setExtCrystalUse(true);

  Serial.println("BNO055 initialized");

  // Initialize LoRa reset pin
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);

  // Manual radio reset
  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);

  // Initialize LoRa radio
  if (!rf95.init()) {
    Serial.println("LoRa radio initialization failed!");
    while (1);
  }

  // Set frequency
  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("Invalid LoRa frequency!");
    while (1);
  }

  rf95.setTxPower(23, false);

  Serial.println("LoRa transmitter initialized");
  Serial.println("Starting telemetry transmission...");
}
// ---------------- MAIN LOOP ----------------

void loop() {
  // Gather sensor readings
  voltageSamples[sampleIndex] = readVoltage();
  currentSamples[sampleIndex] = readCurrent();
  tempSamples[sampleIndex] = readTemperature();
  accelSamples[sampleIndex] = readAcceleration();

  sampleIndex++;

  // Transmit after collecting 10 samples
  if (sampleIndex >= NUM_SAMPLES) {
    TelemetryPacket packet = {};
    transmitAveragedData(packet);
    sampleIndex = 0;
  }

  delay(SAMPLE_DELAY_MS);
}


// ---------------- SENSOR FUNCTIONS ----------------

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
  float current = (voltage - CURRENT_OFFSET_V)/ CURRENT_SENSITIVITY;

  // Clamp negative noise
  return (current < 0.0) ? 0.0 : current;
}


float readTemperature() {
  // bno.getTemp() returns an int8_t, casting to float for consistent averaging
  return (float)bno.getTemp();
}


float readAcceleration() {
  imu::Vector<3> accel = bno.getVector(Adafruit_BNO055::VECTOR_LINEARACCEL);
  // calculate magnitude of the 3D acceleration vector
  return sqrt( sq(accel.x()) + sq(accel.y()) + sq(accel.z()));
}


// ---------------- AVERAGING AND LORA TRANSMISSION ----------------

void transmitAveragedData(TelemetryPacket packet) {

  float vSum = 0;
  float iSum = 0;
  float tSum = 0;
  float aSum = 0;

  // Calculate averages
  for (int i = 0; i < NUM_SAMPLES; i++) {
    vSum += voltageSamples[i];
    iSum += currentSamples[i];
    tSum += tempSamples[i];
    aSum += accelSamples[i];
  }

  // Populate telemetry packet
  packet.packetNumber = packetCounter++;
  packet.timestamp = millis();

  packet.voltage = vSum / NUM_SAMPLES;
  packet.current = iSum / NUM_SAMPLES;
  packet.temperature = tSum / NUM_SAMPLES;
  packet.acceleration = aSum / NUM_SAMPLES;

  // Send telemetry to Raspberry Pi over USB
  Serial.write((uint8_t*)&packet, sizeof(packet));

  // Send the exact same telemetry packet over LoRa
  rf95.send((uint8_t*)&packet, sizeof(packet));
  rf95.waitPacketSent();
}
