"use client";

import type { TugArenaProps } from "@/types/game";

const TOTAL_STEPS = 10;
const HALF = TOTAL_STEPS / 2;

export default function TugArena({ position, winZone }: TugArenaProps) {
  // Convert position to a percentage (0% = full Team1 win, 50% = center, 100% = full Team2 win)
  const pct = ((position + winZone) / (winZone * 2)) * 100;

  // How close the marker is to either edge (0 = center, 1 = at win zone)
  const intensity = Math.abs(position) / winZone;
  const leadsTeam1 = position < 0;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-amber-50 to-amber-100 px-2 py-4 relative overflow-hidden">
      {/* Title */}
      <p className="text-xs sm:text-sm font-extrabold text-amber-900 tracking-[0.2em] uppercase mb-3">
        Tug of War
      </p>

      {/* Arena container */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-0">
        {/* Win zones — stronger backgrounds */}
        <div className="absolute inset-0 flex rounded-lg overflow-hidden">
          <div
            className="w-[18%] transition-colors duration-500"
            style={{
              backgroundColor:
                leadsTeam1
                  ? `rgba(59, 130, 246, ${0.15 + intensity * 0.35})`
                  : "rgba(59, 130, 246, 0.1)",
            }}
          />
          <div className="flex-1" />
          <div
            className="w-[18%] transition-colors duration-500"
            style={{
              backgroundColor:
                !leadsTeam1 && position !== 0
                  ? `rgba(239, 68, 68, ${0.15 + intensity * 0.35})`
                  : "rgba(239, 68, 68, 0.1)",
            }}
          />
        </div>

        {/* Center line — dashed, more prominent */}
        <div className="absolute left-1/2 top-3 bottom-3 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 flex-1 bg-amber-900/40 rounded-full"
            />
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-4 h-4 rounded-full bg-amber-900/25 border-2 border-amber-900/30" />
        </div>

        {/* Rope */}
        <div className="relative w-[88%] h-5 sm:h-6 z-20">
          {/* Rope body */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className="w-full h-2.5 sm:h-3.5 bg-gradient-to-b from-yellow-600 via-yellow-500 to-yellow-700 rounded-full shadow-md border-t border-yellow-400/30" />
          </div>

          {/* Rope texture */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-px h-3 sm:h-4 bg-yellow-900/15 rounded"
              style={{ left: `${(i + 1) * (100 / 19)}%` }}
            />
          ))}

          {/* Marker — larger, more visible */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ left: `${pct}%` }}
          >
            {/* Flag pole */}
            <div className="w-1 h-16 sm:h-20 bg-gray-800 rounded-full mx-auto -mt-14 sm:-mt-17 shadow-md" />
            {/* Flag */}
            <div className="absolute -top-14 sm:-top-17 left-1 w-7 sm:w-9 h-5 sm:h-6 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-r-sm shadow-md flex items-center justify-center border border-yellow-500/50">
              <span className="text-[9px] sm:text-xs font-black text-amber-800">
                &#9873;
              </span>
            </div>
            {/* Rope knot — pulsing glow when near win */}
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 shadow-lg mx-auto -mt-1 transition-colors duration-500"
              style={{
                backgroundColor:
                  intensity > 0.6
                    ? leadsTeam1
                      ? "rgb(59, 130, 246)"
                      : "rgb(239, 68, 68)"
                    : "rgb(239, 68, 68)",
                borderColor:
                  intensity > 0.6
                    ? leadsTeam1
                      ? "rgb(37, 99, 235)"
                      : "rgb(220, 38, 38)"
                    : "rgb(185, 28, 28)",
                boxShadow:
                  intensity > 0.6
                    ? `0 0 ${8 + intensity * 12}px ${
                        leadsTeam1
                          ? "rgba(59, 130, 246, 0.5)"
                          : "rgba(239, 68, 68, 0.5)"
                      }`
                    : "0 4px 6px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>

        {/* Team labels at sides */}
        <div className="absolute bottom-1 left-1 text-[10px] sm:text-xs font-extrabold text-blue-600/70 tracking-wide">
          &#9664; T1
        </div>
        <div className="absolute bottom-1 right-1 text-[10px] sm:text-xs font-extrabold text-red-600/70 tracking-wide">
          T2 &#9654;
        </div>

        {/* Step indicators — larger dots */}
        <div className="w-[88%] flex justify-between mt-3 px-0.5">
          {Array.from({ length: TOTAL_STEPS + 1 }).map((_, i) => {
            const isCenter = i === HALF;
            const isLeftSide = i < HALF;
            return (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  isCenter
                    ? "w-2.5 h-2.5 bg-amber-800 shadow-sm"
                    : isLeftSide
                    ? "w-2 h-2 bg-blue-400/40"
                    : "w-2 h-2 bg-red-400/40"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
