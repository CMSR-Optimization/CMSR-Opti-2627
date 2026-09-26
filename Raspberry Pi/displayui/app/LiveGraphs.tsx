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
    <div className="relative z-10 w-full rounded-3xl border-2 border-green-300/50 bg-[#111a22] p-8 shadow-2xl shadow-black/70">
      <div className="mb-6 flex flex-wrap gap-3">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(m.key)}
            className={`rounded-lg border px-4 py-2 font-mono text-sm tracking-wider transition ${
              m.key === selected
                ? "border-green-300/50 bg-green-400/15 text-green-300"
                : "border-[#2b3945] text-[#71808d] hover:border-[#34424f] hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid stroke="#2b3945" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTime}
              stroke="#71808d"
              tick={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="#71808d"
              tick={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
              tickFormatter={(v: number) => v.toFixed(1)}
              label={{ value: metric.unit, angle: -90, position: "insideLeft", fill: "#71808d" }}
            />
            <Line
              type="monotone"
              dataKey={selected}
              stroke="#4ade80"
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
