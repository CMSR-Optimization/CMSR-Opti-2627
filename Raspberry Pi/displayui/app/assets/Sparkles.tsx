const sparkles = [];

export function Sparkles() {
  const rows = 20;
  const cols = 25;

  if (sparkles.length === 0) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const seed = row * cols + col;

        sparkles.push({
          top: (row + ((seed * 37) % 100) / 100) * (100 / rows),
          left: (col + ((seed * 73) % 100) / 100) * (100 / cols),
          delay: ((seed * 17) % 300) / 100,
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

export default Sparkles;