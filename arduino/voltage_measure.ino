const int sensorPin = A0;

const float sensitivity = 0.020;
const float offsetVoltage = 0.0;

const float referenceVoltage = 5.0;

const int numSamples = 50;

void setup() {
  Serial.begin(9600);
  Serial.println("MATEKSYS 150A Current Sensor Initialized...");
}

void loop() {
  long totalAnalogValue = 0;
 
  for (int i = 0; i < numSamples; i++) {
    totalAnalogValue += analogRead(sensorPin);
    delay(2);
  }
 
  float averageAnalogValue = (float)totalAnalogValue / numSamples;
 
  float voltage = (averageAnalogValue / 1024.0) * referenceVoltage;

  float current = (voltage - offsetVoltage) / sensitivity;
 
  if (current < 0.0) {
    current = 0.0;
  }
 
  Serial.print("Voltage: ");
  Serial.print(voltage, 3);
  Serial.print(" V  |  Current: ");
  Serial.print(current, 2);
  Serial.println(" A");
  delay(500);
}
