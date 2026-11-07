#include <SPI.h>
#include <LoRa.h>

// Arduino Uno LoRa pins
#define LORA_CS   10
#define LORA_RST   9
#define LORA_DIO0  2

void setup() {

  Serial.begin(9600);
  while (!Serial);

  // Set LoRa pins
  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);

  // Initialize LoRa at 915 MHz
  if (!LoRa.begin(915E6)) {

    Serial.println("Starting LoRa failed!");

    while (1);
  }

  Serial.println("LoRa Receiver Ready!");

  // Start listening for packets
  LoRa.receive();
}

void loop() {

  int packetSize = LoRa.parsePacket();

  if (packetSize) {

    Serial.print("Received: ");

    // Read the incoming packet
    while (LoRa.available()) {
      Serial.print((char)LoRa.read());
    }

    Serial.println();

    // Print signal strength
    Serial.print("RSSI: ");
    Serial.println(LoRa.packetRssi());
  }
}