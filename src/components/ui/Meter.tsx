'use client';

import { clsx } from 'clsx';
import { RiskLevel } from '@/types';

interface MeterProps {
  level: RiskLevel;
}

const widths: Record<RiskLevel, string> = {
  Low: 'w-1/3',
  Moderate: 'w-2/3',
  High: 'w-full',
};

const colors: Record<RiskLevel, string> = {
  Low: 'bg-emerald-400',
  Moderate: 'bg-amber-400',
  High: 'bg-red-400',
};

export function Meter({ level }: MeterProps) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-700 ease-out',
          widths[level],
          colors[level]
        )}
      />
    </div>
  );
}
