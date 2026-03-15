"use client";

const TOTAL_STEPS = 10;
const HALF = TOTAL_STEPS / 2;

interface TugArenaProps {
  /** Negative = Team 1 leading, Positive = Team 2 leading. Range: -HALF to +HALF */
  position: number;
  winZone: number;
}

export default function TugArena({ position, winZone }: TugArenaProps) {
  // Convert position to a percentage (0% = full Team1 win, 50% = center, 100% = full Team2 win)
  const pct = ((position + winZone) / (winZone * 2)) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-amber-50 px-2 py-3 relative overflow-hidden">
      {/* Title */}
      <p className="text-xs sm:text-sm font-bold text-amber-800 tracking-widest uppercase mb-2">
        Tug of War
      </p>

      {/* Arena container */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-0">
        {/* Win zones */}
        <div className="absolute inset-0 flex">
          <div className="w-[15%] bg-blue-200/50 rounded-l-lg" />
          <div className="flex-1" />
          <div className="w-[15%] bg-red-200/50 rounded-r-lg" />
        </div>

        {/* Center line */}
        <div className="absolute left-1/2 top-2 bottom-2 w-0.5 bg-amber-800/30 -translate-x-1/2 z-10" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-3 h-3 rounded-full bg-amber-800/30" />
        </div>

        {/* Rope */}
        <div className="relative w-[90%] h-4 sm:h-5 z-20">
          {/* Rope line */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className="w-full h-2 sm:h-3 bg-gradient-to-b from-yellow-700 via-yellow-600 to-yellow-800 rounded-full shadow-md" />
          </div>

          {/* Rope texture marks */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 sm:h-4 bg-yellow-900/20 rounded"
              style={{ left: `${(i + 1) * (100 / 21)}%` }}
            />
          ))}

          {/* Marker flag */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-out"
            style={{ left: `${pct}%` }}
          >
            {/* Flag pole */}
            <div className="w-1 h-14 sm:h-16 bg-gray-800 rounded-full mx-auto -mt-12 sm:-mt-14 shadow" />
            {/* Flag */}
            <div className="absolute -top-12 sm:-top-14 left-1 w-6 sm:w-8 h-4 sm:h-5 bg-yellow-400 rounded-r shadow-md flex items-center justify-center">
              <span className="text-[8px] sm:text-[10px] font-bold text-yellow-900">
                &#9873;
              </span>
            </div>
            {/* Knot on rope */}
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full border-2 border-red-700 shadow-lg mx-auto -mt-1" />
          </div>
        </div>

        {/* Team labels at sides */}
        <div className="absolute bottom-1 left-2 text-xs font-bold text-blue-600 opacity-60">
          &#8592; T1 WIN
        </div>
        <div className="absolute bottom-1 right-2 text-xs font-bold text-red-600 opacity-60">
          T2 WIN &#8594;
        </div>

        {/* Step indicators */}
        <div className="w-[90%] flex justify-between mt-2 px-1">
          {Array.from({ length: TOTAL_STEPS + 1 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === HALF
                  ? "bg-amber-800"
                  : i < HALF
                  ? "bg-blue-400/50"
                  : "bg-red-400/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
