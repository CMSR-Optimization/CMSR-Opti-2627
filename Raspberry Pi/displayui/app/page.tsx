"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function Page() {
  // State to hold live Arduino data
  const [data, setData] = useState({
    timestamp: 0,
    velocity: 0,
    acceleration: 0,
    temperature: 0,
    current: 0,
    voltage: 0,
  });

  useEffect(() => {
    // Connect to the local Node.js bridge we just built
    const socket = io("http://localhost:3001");

    // Listen for the 'telemetry' event from the bridge
    socket.on("telemetry", (incomingData) => {
      setData(incomingData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const metrics = [
    { title: "VELOCITY", value: data.velocity.toFixed(1), unit: "m/s" },
    { title: "ACCELERATION", value: data.acceleration.toFixed(2), unit: "m/s²" },
    { title: "TEMPERATURE", value: data.temperature.toFixed(1), unit: "°C" },
    { title: "CURRENT", value: data.current.toFixed(2), unit: "amps" },
    { title: "VOLTAGE", value: data.voltage.toFixed(2), unit: "volts" },
  ];

  const elapsedSeconds = Math.floor(data.timestamp / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return ( 
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-300 via-fuchsia-400 to-purple-500 flex flex-col items-center py-14 px-6">
      <Sparkles />
      <div className="absolute top-6 right-8 z-20 text-white text-2xl font-bold drop-shadow-lg">
        Uptime: {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      {/* HEADER */}
      <div className="z-10 bg-gradient-to-r from-red-500 to-pink-600 border-[6px] border-red-900 rounded-3xl px-14 py-5 mb-16 shadow-2xl shadow-pink-600/50">
        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-widest drop-shadow-lg">
          OPTIMI-SLAY-TION
        </h1>
      </div>

      {/* TOP ROW */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl mb-14">
        {metrics.slice(0, 3).map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* BOTTOM ROW */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        {metrics.slice(3).map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
}

function MetricCard({ metric }) {
  return (
    <div className="relative bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl shadow-purple-900/40 min-h-[260px] transform transition duration-300 hover:scale-105 hover:rotate-1">
      <div className="absolute inset-0 rounded-3xl blur-2xl opacity-30 bg-white animate-pulse" />
      <div className="relative flex items-center gap-3 mb-6">
        <h2 className="text-white text-3xl md:text-2xl font-semibold tracking-wider drop-shadow-md">
          {metric.title}
        </h2>
      </div>
      <div className="relative text-white text-6xl md:text-7xl font-extrabold leading-none drop-shadow-xl">
        {metric.value}
      </div>
      <div className="relative text-white text-xl mt-3 opacity-90">
        {metric.unit}
      </div>
    </div>
  );
}

const sparkles = [];
function Sparkles() {
  const rows = 20;
  const cols = 25; 
  if (sparkles.length == 0){
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        sparkles.push({
          top: (row + Math.random()) * (100 / rows),
          left: (col + Math.random()) * (100 / cols),
          delay: Math.random() * 3,
        });
      }
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle, i) => (
        <div
          key={i}
          className="absolute text-white text-xl animate-pulse"
          style={{
            top: `${sparkle.top}%`,
            left: `${sparkle.left}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}