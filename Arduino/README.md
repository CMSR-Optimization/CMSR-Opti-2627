# Arduino

Embedded software for collecting and processing sensor data for the boat.

## Overview

The Arduino interfaces with the vehicle's sensors, collects measurements, averages samples, and transmits telemetry to the Raspberry Pi for logging and real-time visualization.

### Sensors

The current system collects:

* **Voltage**
* **Current**
* **Temperature**
* **Acceleration**

## Data Collection

The Arduino samples each sensor every **50 ms**. After collecting 10 samples, it averages the measurements and transmits one telemetry packet to the Raspberry Pi.

This results in approximately **2 telemetry updates per second**.

```text
Sensors
   ↓
Arduino
   ├── Read sensors
   ├── Collect 10 samples
   ├── Average measurements
   └── Transmit telemetry
          ↓
     Raspberry Pi
```

## Communication

Telemetry is currently transmitted from the Arduino to the Raspberry Pi over **USB serial at 9600 baud**.

The transmitted measurements contain:

```text
timestamp
voltage
current
temperature
acceleration
```

The Raspberry Pi's telemetry bridge receives and processes this data before sending it to the driver dashboard.

## Files

* `packet_transmit.ino` — Main telemetry collection and transmission program
* `voltage_measure.ino` — Voltage sensor testing
* `v_imu_temp` — IMU and temperature testing
* `voltage sensor` — Voltage sensor testing