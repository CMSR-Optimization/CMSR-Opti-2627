export function MetricCard({ metric }) {
  return (
    <div className="relative bg-gradient-to-br from-lime-500 to-green-500 rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl shadow-purple-900/40 min-h-[260px] transform transition duration-300 hover:scale-105 hover:rotate-1">
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

export default MetricCard;