"use client";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export type Telemetry = {
  timestamp: number;
  velocity: number;
  acceleration: number;
  temperature: number;
  current: number;
  voltage: number;
};

type MetricKey = Exclude<keyof Telemetry, "timestamp">;

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: "velocity", label: "VELOCITY", unit: "m/s" },
  { key: "acceleration", label: "ACCELERATION", unit: "m/s²" },
  { key: "temperature", label: "TEMPERATURE", unit: "°C" },
  { key: "current", label: "CURRENT", unit: "amps" },
  { key: "voltage", label: "VOLTAGE", unit: "volts" },
];

// SVG rendering slows down past a few thousand points
const MAX_RENDER = 500;

function downsample<T>(arr: T[]): T[] {
  if (arr.length <= MAX_RENDER) return arr;
  const step = Math.ceil(arr.length / MAX_RENDER);
  return arr.filter((_, i) => i % step === 0 || i === arr.length - 1);
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function LiveGraphs({ history }: { history: Telemetry[] }) {
  const [selected, setSelected] = useState<MetricKey>("voltage");
  const points = useMemo(() => downsample(history), [history]);
  const metric = METRICS.find((m) => m.key === selected)!;

  return (
    <div className="z-10 w-full max-w-7xl mt-14 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-3xl p-8 shadow-2xl shadow-purple-900/40">
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(m.key)}
            className={`px-5 py-2 rounded-full font-semibold tracking-wider transition ${
              m.key === selected
                ? "bg-white text-fuchsia-600 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTime}
              stroke="white"
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="white"
              tickFormatter={(v: number) => v.toFixed(1)}
              label={{ value: metric.unit, angle: -90, position: "insideLeft", fill: "white" }}
            />
            <Line
              type="monotone"
              dataKey={selected}
              stroke="white"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
