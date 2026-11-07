#include <SPI.h>
#include <LoRa.h>

// Arduino Uno LoRa pins defined
#define LORA_CS   10
#define LORA_RST   9
#define LORA_DIO0  2

uint32_t packetNumber = 0;

void setup() {

  Serial.begin(9600);
  while (!Serial);

  LoRa.setPins(LORA_CS, LORA_RST, LORA_DIO0);

  // Initialize LoRa at 915 MHz
  if (!LoRa.begin(915E6)) {

    Serial.println("Starting LoRa failed!");

    while (1);
  }

  Serial.println("LoRa Transmitter Ready!");
}

void loop() {

  // Start a LoRa packet
  LoRa.beginPacket();

  // Send basic test information
  LoRa.print("PACKET:");
  LoRa.print(packetNumber);

  LoRa.endPacket();

  // Show what was sent
  Serial.print("Sent packet: ");
  Serial.println(packetNumber);

  packetNumber++;

  delay(2000);
}

