"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import Sparkles from "./assets/Sparkles";
import MetricCard from "./assets/MetricCard";
import LiveGraphs, { Telemetry } from "./assets/LiveGraphs";
import logo from "./assets/logo.jpg"

let defaultState: Telemetry = {
    timestamp: 0,
    velocity: 0,
    acceleration: 0,
    temperature: 0,
    current: 0,
    voltage: 0,
  };

type MetricKey = Exclude<keyof Telemetry, "timestamp">;

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: "velocity", label: "VELOCITY", unit: "m/s" },
  { key: "acceleration", label: "ACCELERATION", unit: "m/s²" },
  { key: "temperature", label: "TEMPERATURE", unit: "°C" },
  { key: "current", label: "CURRENT", unit: "amps" },
  { key: "voltage", label: "VOLTAGE", unit: "volts" },
  { key: "placeholder", label: "PLACEHOLER", unit: "units" }
];

export default function Page() {
  const [running, setRunning] = useState(false);
  const [data, setData] = useState(defaultState);
  const [history, setHistory] = useState<Telemetry[]>([]);
  const [selected, setSelected] = useState<MetricKey>("voltage")

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("telemetry", (incomingData: Telemetry) => {
      setRunning(true);
      setData(incomingData);
      setHistory((h) => [...h, incomingData]);
    });

    socket.on("disconnect", () => {
      setRunning(false);
      setData(defaultState);
      setHistory([]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const metrics = [
    {
      key: "velocity",
      title: "VELOCITY",
      value: data.velocity.toFixed(1),
      unit: "m/s",
    },
    {
      key: "acceleration",
      title: "ACCELERATION",
      value: data.acceleration.toFixed(2),
      unit: "m/s²",
    },
    {
      key: "temperature",
      title: "TEMPERATURE",
      value: data.temperature.toFixed(1),
      unit: "°C",
    },
    {
      key: "current",
      title: "CURRENT",
      value: data.current.toFixed(2),
      unit: "Amps",
    },
    {
      key: "voltage",
      title: "VOLTAGE",
      value: data.voltage.toFixed(2),
      unit: "Volts",
    },

    {
      key: "placeholder",
      title: "PLACEHOLDER",
      value: 1,
      unit: "Units",
    },
  ];

  const elapsedSeconds = Math.floor(data.timestamp / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1117] px-10 py-8 text-white">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* <Sparkles /> */}

      {/* HEADER */}
      <header className="relative z-10 mb-10 flex items-center justify-between border-b border-[#2b3945] pb-5">
        <div className="flex items-center gap-5">
          <img
            src={logo.src}
            alt="Carnegie Mellon Solar Racing"
            className="h-16 w-16 rounded-xl object-cover border border-[#34424f]"
          />

          <div>
            <div className="mb-1 font-mono text-xs tracking-[0.25em] text-[#71808d]">
              CARNEGIE MELLON SOLAR RACING
            </div>

            <h1 className="font-mono text-4xl font-bold tracking-[0.08em]">
              CMSR // LIVE TELEMETRY
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`h-2.5 w-2.5 rounded-full ${running ? "bg-green-400" : "bg-red-400"}`} />

          <span className={`font-mono text-sm tracking-wider ${running ? "text-green-400" : "text-red-400"}`} >
            {running ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
          </span>

          <span className="ml-6 font-mono text-sm text-[#71808d]">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* TOP ROW */}
      <div className="relative z-10 mb-6 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {metrics.slice(0, 3).map((metric, index) => (
          <MetricCard key={index} metric={metric} onClick={() => setSelected(metric.key)} selected={selected} />
        ))}
      </div>

      {/* BOTTOM ROW */}
      <div className="relative z-10 mb-6 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {metrics.slice(3).map((metric, index) => (
          <MetricCard key={index} metric={metric} onClick={() => setSelected(metric.key)} selected={selected} />
        ))}
      </div>

      <LiveGraphs history={history} selected = {selected} setSelected={setSelected} />

      {/* FOOTER */}
      <footer className="relative z-10 mt-8 flex justify-between border-t border-[#2b3945] pt-4 font-mono text-xs tracking-wider text-[#536371]">
        <span>TELEMETRY LINK: {running? "ACTIVE" : "INACTIVE"}</span>
        <span>CMSR OPTIMIZATION</span>
      </footer>
    </main>
  );
}