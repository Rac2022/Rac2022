"use client";

import type { TugArenaProps } from "@/types/game";

const TOTAL_STEPS = 10;
const HALF = TOTAL_STEPS / 2;

export default function TugArena({ position, winZone, theme }: TugArenaProps) {
  const pct = ((position + winZone) / (winZone * 2)) * 100;
  const intensity = Math.abs(position) / winZone;
  const leadsTeam1 = position < 0;

  const t1 = theme.team1;
  const t2 = theme.team2;
  const activeTeam = leadsTeam1 ? t1 : t2;

  return (
    <div className={`flex flex-col items-center justify-center h-full ${theme.arenaBg} px-2 py-4 relative overflow-hidden`}>
      {/* Title */}
      <p className={`text-xs sm:text-sm font-extrabold ${theme.arenaTitle} tracking-[0.2em] uppercase mb-3`}>
        Tug of War
      </p>

      {/* Arena container */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-0">
        {/* Win zones */}
        <div className="absolute inset-0 flex rounded-lg overflow-hidden">
          <div
            className="w-[18%] transition-colors duration-500"
            style={{
              backgroundColor:
                leadsTeam1
                  ? `rgba(${t1.winZoneRgb}, ${0.15 + intensity * 0.35})`
                  : `rgba(${t1.winZoneRgb}, 0.1)`,
            }}
          />
          <div className="flex-1" />
          <div
            className="w-[18%] transition-colors duration-500"
            style={{
              backgroundColor:
                !leadsTeam1 && position !== 0
                  ? `rgba(${t2.winZoneRgb}, ${0.15 + intensity * 0.35})`
                  : `rgba(${t2.winZoneRgb}, 0.1)`,
            }}
          />
        </div>

        {/* Center line — dashed */}
        <div className="absolute left-1/2 top-3 bottom-3 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`w-0.5 flex-1 ${theme.arenaCenterLine} rounded-full`}
            />
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`w-4 h-4 rounded-full ${theme.arenaCenterDot} border-2 ${theme.arenaCenterDotBorder}`} />
        </div>

        {/* Rope */}
        <div className="relative w-[88%] h-5 sm:h-6 z-20">
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className={`w-full h-2.5 sm:h-3.5 ${theme.ropeGradient} rounded-full shadow-md border-t ${theme.ropeBorder}`} />
          </div>

          {/* Rope texture */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className={`absolute top-1/2 -translate-y-1/2 w-px h-3 sm:h-4 ${theme.ropeTexture} rounded`}
              style={{ left: `${(i + 1) * (100 / 19)}%` }}
            />
          ))}

          {/* Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ left: `${pct}%` }}
          >
            <div className="w-1 h-16 sm:h-20 bg-gray-800 rounded-full mx-auto -mt-14 sm:-mt-17 shadow-md" />
            <div className={`absolute -top-14 sm:-top-17 left-1 w-7 sm:w-9 h-5 sm:h-6 ${theme.flagGradient} rounded-r-sm shadow-md flex items-center justify-center border ${theme.flagBorder}`}>
              <span className={`text-[9px] sm:text-xs font-black ${theme.flagText}`}>
                &#9873;
              </span>
            </div>
            {/* Knot */}
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 shadow-lg mx-auto -mt-1 transition-colors duration-500"
              style={{
                backgroundColor:
                  intensity > 0.6 ? activeTeam.knotRgb : t2.knotRgb,
                borderColor:
                  intensity > 0.6 ? activeTeam.knotBorderRgb : t2.knotBorderRgb,
                boxShadow:
                  intensity > 0.6
                    ? `0 0 ${8 + intensity * 12}px ${activeTeam.knotGlowRgba}`
                    : "0 4px 6px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>

        {/* Side labels */}
        <div className={`absolute bottom-1 left-1 text-[10px] sm:text-xs font-extrabold opacity-70 tracking-wide ${t1.scoreLabel}`}>
          &#9664; {t1.label.charAt(0)}{t1.label.charAt(1)}
        </div>
        <div className={`absolute bottom-1 right-1 text-[10px] sm:text-xs font-extrabold opacity-70 tracking-wide ${t2.scoreLabel}`}>
          {t2.label.charAt(0)}{t2.label.charAt(1)} &#9654;
        </div>

        {/* Step indicators */}
        <div className="w-[88%] flex justify-between mt-3 px-0.5">
          {Array.from({ length: TOTAL_STEPS + 1 }).map((_, i) => {
            const isCenter = i === HALF;
            const isLeftSide = i < HALF;
            return (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  isCenter
                    ? `w-2.5 h-2.5 ${theme.stepCenter} shadow-sm`
                    : isLeftSide
                    ? `w-2 h-2 ${t1.dot}/40`
                    : `w-2 h-2 ${t2.dot}/40`
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
