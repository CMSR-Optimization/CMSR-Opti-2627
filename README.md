# CMSR Optimization

Software and embedded systems developed by the **Carnegie Mellon Solar Racing Optimization Team** for vehicle telemetry, data collection, and real-time driver visualization.

## Overview

This repository contains the software developed by the Optimization team for collecting sensor data from the solar boat, transmitting telemetry to onboard computing hardware, and displaying vehicle information to the driver in real time.

The system combines **Arduino-based sensor acquisition**, **Raspberry Pi onboard computing**, a **Node.js telemetry backend**, and a **Next.js/React driver interface**.

## System Architecture

```text
┌──────────────────┐
│     Sensors      │
│                  │
│  BNO055 IMU      │
│  Voltage Sensor  │
│  Current Sensor  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│     Arduino      │
│                  │
│ Read & process   │
│ sensor data      │
└────────┬─────────┘
         │
      USB Serial
         │
         ▼
┌──────────────────────────┐
│      Raspberry Pi        │
│                          │
│  ┌────────────────────┐  │
│  │ Telemetry Bridge   │  │
│  │     Node.js        │  │
│  └─────────┬──────────┘  │
│            │             │
│       Socket.io          │
│            │             │
│  ┌─────────▼──────────┐  │
│  │    Display UI      │  │
│  │   Next.js / React   │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

### Data Flow

1. Sensors collect electrical and motion data.
2. The Arduino reads and processes the sensor measurements.
3. Telemetry is transmitted from the Arduino to the Raspberry Pi over USB serial.
4. The Node.js telemetry bridge receives and parses the incoming data.
5. The bridge broadcasts telemetry through Socket.io.
6. The Next.js/React application receives the telemetry and updates the driver's dashboard.

## Repository Structure

```text
CMSR-Opti-2627/
│
├── Arduino/
│   ├── packet_transmit.ino
│   ├── voltage_measure.ino
│   ├── v_imu_temp
│   ├── voltage sensor
│   └── README.md
│
├── Raspberry Pi/
│   ├── telemetry-bridge/
│   │   ├── server.js
│   │   ├── data/
│   │   └── README.md
│   │
│   ├── displayui/
│   │   ├── app/
│   │   ├── public/
│   │   └── README.md
│   │
│   └── README.md
│
└── README.md
```

## Components

### Arduino

The `Arduino/` directory contains the embedded software responsible for interfacing with the boat's sensors.

The Arduino currently handles measurements including:

* Voltage
* Current
* Temperature
* Acceleration

Sensor measurements are processed on the Arduino before being transmitted to the Raspberry Pi.

See [`Arduino/README.md`](Arduino/README.md) for more information.

### Raspberry Pi

The `Raspberry Pi/` directory contains the onboard computing software.

It is divided into two primary components:

#### Telemetry Bridge

`Raspberry Pi/telemetry-bridge/` contains the Node.js backend responsible for communicating with the Arduino and distributing telemetry to connected applications.

The bridge:

* Connects to the Arduino through USB serial
* Receives and parses telemetry
* Converts measurements into structured data
* Records telemetry data
* Broadcasts live telemetry using Socket.io

The bridge runs on **port 3001**.

#### Display UI

`Raspberry Pi/displayui/` contains the Next.js/React application used for the driver's telemetry display.

The dashboard receives live telemetry from the bridge and displays vehicle measurements in real time.

The development server runs on **port 3000**.

See [`Raspberry Pi/README.md`](Raspberry%20Pi/README.md) for the complete onboard system documentation.

## Technology Stack

| Component               | Technology      |
| ----------------------- | --------------- |
| Sensor acquisition      | Arduino / C++   |
| Onboard computer        | Raspberry Pi    |
| Backend                 | Node.js         |
| Serial communication    | `serialport`    |
| Real-time communication | Socket.io       |
| Frontend                | Next.js / React |
| Styling                 | Tailwind CSS    |
| Data logging            | CSV             |

## Getting Started

### Arduino

Upload the appropriate `.ino` program from the `Arduino/` directory to the Arduino using the Arduino IDE.

Connect the required sensors according to the hardware team's wiring configuration.

### Telemetry Bridge

From the Raspberry Pi:

```bash
cd "Raspberry Pi/telemetry-bridge"
npm install
node server.js
```

The bridge will connect to the configured serial port and begin receiving telemetry.

### Display UI

In a second terminal:

```bash
cd "Raspberry Pi/displayui"
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

The dashboard will connect to the telemetry bridge on port `3001`.

## Data Collection

The telemetry bridge records incoming measurements so that individual vehicle runs can be analyzed after testing.

Each run can be stored as a separate telemetry file containing measurements such as:

```text
timestamp
voltage
current
temperature
acceleration
```

This data can later be used for performance analysis, driver comparison, and vehicle optimization.

## Development Goals

The Optimization team's software is being developed toward a complete onboard telemetry and data-analysis system.

Planned improvements include:

* Additional vehicle sensors
* More robust telemetry packet encoding
* Improved telemetry reliability
* Persistent run/session management
* Expanded data logging
* Historical telemetry visualization
* Lap and run comparison
* Additional driver performance metrics
* Automated onboard startup for race-day operation

## Team

**Carnegie Mellon Solar Racing — Optimization Team**

This repository contains ongoing development work for the team's telemetry, data collection, and onboard visualization systems.
