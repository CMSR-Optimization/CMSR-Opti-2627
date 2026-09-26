export function MetricCard({ metric }) {
  return (
    <div className="relative bg-gradient-to-br from-green-700 to-lime-950 rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl shadow-black/70 min-h-[260px] border-2 border-green-300/50 transition duration-500 hover:scale-105">
      
      <div className="absolute inset-0 rounded-3xl bg-white opacity-5 pointer-events-none" />

      {/* Title */}
      <div className="relative flex items-center gap-3 mb-6">
        <h2 className="text-white text-3xl md:text-2xl font-bold tracking-wider drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)]">
          {metric.title}
        </h2>
      </div>

      {/* Value */}
      <div className="relative text-white text-6xl md:text-7xl font-extrabold leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
        {metric.value}
      </div>

      {/* Unit */}
      <div className="relative text-white text-2xl mt-3 font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
        {metric.unit}
      </div>
    </div>
  );
}

export default MetricCard;