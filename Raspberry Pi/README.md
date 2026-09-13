# Raspberry Pi

Onboard software for receiving, processing, logging, and displaying telemetry from the boat.

## Overview

The Raspberry Pi acts as the bridge between the Arduino's sensor data and the driver's telemetry dashboard.

The system consists of two main components:

* **`telemetry-bridge/`** — Node.js backend that receives telemetry from the Arduino, logs data, and broadcasts it to the dashboard.
* **`displayui/`** — Next.js/React frontend that displays live vehicle telemetry.

```text
Arduino
   ↓
USB Serial
   ↓
Telemetry Bridge
   ├── Log telemetry
   └── Socket.io
          ↓
     Display UI
          ↓
     Driver Dashboard
```

## Telemetry Bridge

The telemetry bridge connects to the Arduino over **USB serial** and processes incoming telemetry packets.

It:

* Receives sensor measurements
* Converts telemetry into structured data
* Logs telemetry to CSV files
* Broadcasts live data using Socket.io

The backend runs on **port 3001**.

Each server start creates a new timestamped telemetry file in:

```text
telemetry-bridge/data/
```

## Display UI

The `displayui/` directory contains the driver's real-time telemetry dashboard.

The interface receives telemetry from the bridge and displays:

* **Velocity**
* **Acceleration**
* **Temperature**
* **Current**
* **Voltage**
* **Uptime**

The Next.js development server runs on **port 3000**.

## Getting Started

### Telemetry Bridge

```bash
cd "Raspberry Pi/telemetry-bridge"
npm install
node server.js
```

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
