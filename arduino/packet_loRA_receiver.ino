#include <SPI.h>
#include <RH_RF95.h>

// ---------------- LoRa Configuration ----------------
#define RFM95_CS 10
#define RFM95_RST 9
#define RFM95_INT 2
#define RF95_FREQ 915.0

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

void setup() {
  Serial.begin(9600);

  // Initialize reset pin
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);

  // Reset LoRa module
  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);

  // Initialize radio
  if (!rf95.init()) {
    Serial.println("LoRa receiver initialization failed!");
    while (1);
  }

  // Set frequency
  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("Invalid frequency!");
    while (1);
  }
  rf95.setTxPower(23, false);
  Serial.println("LoRa receiver initialized");
  Serial.println("Waiting for telemetry...");
}

void loop() {
  if (rf95.available()) {

    uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);

    // Receive packet
    if (rf95.recv(buf, &len)) {
      // Verify packet size
      if (len == sizeof(TelemetryPacket)) {
        TelemetryPacket packet;
        memcpy(&packet, buf, sizeof(packet));
        // Print received telemetry
        Serial.println("---------------------------");

        Serial.print("Packet Number: ");
        Serial.println(packet.packetNumber);

        Serial.print("Timestamp: ");
        Serial.print(packet.timestamp);
        Serial.println(" ms");

        Serial.print("Voltage: ");
        Serial.print(packet.voltage);
        Serial.println(" V");

        Serial.print("Current: ");
        Serial.print(packet.current);
        Serial.println(" A");

        Serial.print("Temperature: ");
        Serial.print(packet.temperature);
        Serial.println(" C");

        Serial.print("Acceleration: ");
        Serial.print(packet.acceleration);
        Serial.println(" m/s^2");

        Serial.println("---------------------------");

      } else {
        Serial.print("Incorrect packet size: ");
        Serial.println(len);
      }
    } else {
      Serial.println("Packet reception failed");
    }
  }
}
