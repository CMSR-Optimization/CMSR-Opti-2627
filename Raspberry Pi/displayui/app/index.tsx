
import { useState } from "react";
import image from "./image.svg";
import rectangle18 from "./rectangle-18.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";
import vector7 from "./vector-7.svg";
import vector8 from "./vector-8.svg";
import vector9 from "./vector-9.svg";
import vector10 from "./vector-10.svg";
import vector11 from "./vector-11.svg";
import vector12 from "./vector-12.svg";
import vector13 from "./vector-13.svg";
import vector14 from "./vector-14.svg";
import vector from "./vector.svg";

interface MetricCardData {
  title: string;
  value: string;
  unit: string;
  icon: string;
  position: {
    top: string;
    left: string;
  };
  titleSize: string;
  valueSize: string;
  unitSize: string;
  titlePosition: {
    top: string;
    left: string;
  };
  valuePosition: {
    top: string;
    left: string;
  };
  bgColor?: string;
  bgImage?: string;
}

interface DecorativeIcon {
  src: string;
  alt: string;
  style: {
    width: string;
    height: string;
    top: string;
    left: string;
  };
}

export const Frame = () => {
  const [metrics] = useState<MetricCardData[]>([
    {
      title: "VELOCITY",
      value: "0.0",
      unit: "m/s",
      icon: vector2,
      position: { top: "134px", left: "63px" },
      titleSize: "text-[32px]",
      valueSize: "text-[78px]",
      unitSize: "text-2xl",
      titlePosition: { top: "156px", left: "87px" },
      valuePosition: { top: "213px", left: "135px" },
      bgColor: "bg-[#151c24]",
    },
    {
      title: "ACCELERATION",
      value: "0.0",
      unit: "m/s²",
      icon: vector7,
      position: { top: "134px", left: "429px" },
      titleSize: "text-[28px]",
      valueSize: "text-[78px]",
      unitSize: "text-2xl",
      titlePosition: { top: "165px", left: "445px" },
      valuePosition: { top: "213px", left: "500px" },
      bgColor: "bg-[#151c24]",
    },
    {
      title: "TEMPERATURE",
      value: "0.0",
      unit: "°C",
      icon: vector4,
      position: { top: "134px", left: "786px" },
      titleSize: "text-[28px]",
      valueSize: "text-[78px]",
      unitSize: "text-2xl",
      titlePosition: { top: "170px", left: "804px" },
      valuePosition: { top: "215px", left: "857px" },
      bgColor: "bg-[#151c24]",
    },
    {
      title: "CURRENT",
      value: "0.0",
      unit: "A",
      icon: vector3,
      position: { top: "404px", left: "229px" },
      titleSize: "text-[32px]",
      valueSize: "text-[78px]",
      unitSize: "text-2xl",
      titlePosition: { top: "419px", left: "256px" },
      valuePosition: { top: "475px", left: "313px" },
      bgColor: "bg-[#151c24]",
    },
    {
      title: "VOLTAGE",
      value: "0.0",
      unit: "V",
      icon: vector6,
      position: { top: "404px", left: "634px" },
      titleSize: "text-[32px]",
      valueSize: "text-[78px]",
      unitSize: "text-2xl",
      titlePosition: { top: "417px", left: "666px" },
      valuePosition: { top: "479px", left: "714px" },
      bgColor: "bg-[#151c24]",
    },
  ]);

  const decorativeIcons: DecorativeIcon[] = [];

  return (
    <main
      className="w-full min-w-[1203px] h-[678px] relative bg-[#0b1117] overflow-hidden"
      role="main"
    >
      {/* Subtle engineering grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="absolute top-[22px] left-[63px] w-[1043px] h-[78px] bg-[#111a22] border border-[#34424f] border-l-[4px] border-l-[#4cc9f0]">
        <div className="absolute top-[13px] left-[25px]">
          <div className="text-[12px] font-mono tracking-[0.25em] text-[#71808d]">
            CARNEGIE MELLON SOLAR RACING
          </div>

          <h1 className="mt-[3px] font-mono font-bold text-white text-[32px] tracking-[0.08em]">
            CMSR // LIVE TELEMETRY
          </h1>
        </div>

        <div className="absolute right-[25px] top-[27px] flex items-center gap-3">
          <div className="w-[9px] h-[9px] rounded-full bg-[#4ade80]" />
          <span className="font-mono text-[13px] tracking-[0.12em] text-[#4ade80]">
            SYSTEM ONLINE
          </span>
        </div>
      </header>

      {/* Metric Cards */}
      {metrics.map((metric, index) => (
        <section
          key={index}
          className="absolute w-[322px] h-[237px] bg-[#151c24] border border-[#34424f] border-t-[3px] border-t-[#4cc9f0]"
          style={{
            top: metric.position.top,
            left: metric.position.left,
          }}
          aria-labelledby={`metric-title-${index}`}
        >
          <div className="absolute top-[16px] left-[22px] text-[11px] font-mono tracking-[0.2em] text-[#687987]">
            LIVE DATA
          </div>

          <h2
            id={`metric-title-${index}`}
            className={`absolute w-[265px] font-mono font-semibold text-[#aebbc6] ${metric.titleSize} tracking-[0.12em] leading-[normal]`}
            style={{
              top: `calc(${metric.titlePosition.top} - ${metric.position.top} + 5px)`,
              left: `calc(${metric.titlePosition.left} - ${metric.position.left})`,
            }}
          >
            {metric.title}
          </h2>

          <p
            className={`absolute w-[240px] font-mono font-bold text-white ${metric.valueSize} text-left tracking-[-0.04em] leading-[normal]`}
            style={{
              top: `calc(${metric.valuePosition.top} - ${metric.position.top} + 5px)`,
              left: `calc(${metric.valuePosition.left} - ${metric.position.left})`,
            }}
            aria-label={`${metric.title}: ${metric.value} ${metric.unit}`}
          >
            <span>{metric.value}</span>

            <span
              className={`ml-3 ${metric.unitSize} font-normal text-[#71808d] tracking-normal`}
            >
              {metric.unit}
            </span>
          </p>

          {/* Bottom status line */}
          <div className="absolute bottom-[17px] left-[22px] right-[22px] border-t border-[#293640] pt-[8px]">
            <span className="font-mono text-[10px] tracking-[0.15em] text-[#536371]">
              SENSOR ACTIVE
            </span>
          </div>
        </section>
      ))}

      {/* Footer */}
      <div className="absolute bottom-[18px] left-[63px] right-[63px] flex justify-between font-mono text-[10px] tracking-[0.15em] text-[#536371]">
        <span>TELEMETRY LINK: ACTIVE</span>
        <span>CMSR-OPTIMIZATION</span>
      </div>
    </main>
  );
};

