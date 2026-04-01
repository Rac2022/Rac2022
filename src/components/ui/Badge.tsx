'use client';

import { clsx } from 'clsx';
import { RiskLevel, ValueBand } from '@/types';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'risk' | 'value';
  riskLevel?: RiskLevel;
  valueBand?: ValueBand;
}

export function Badge({ label, variant = 'default', riskLevel, valueBand }: BadgeProps) {
  const riskColors: Record<RiskLevel, string> = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-red-50 text-red-700 border-red-200',
  };

  const valueColors: Record<ValueBand, string> = {
    Limited: 'bg-gray-50 text-gray-600 border-gray-200',
    Moderate: 'bg-blue-50 text-blue-700 border-blue-200',
    Strong: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'High Potential': 'bg-violet-50 text-violet-700 border-violet-200',
  };

  let colorClass = 'bg-gray-50 text-gray-700 border-gray-200';
  if (variant === 'risk' && riskLevel) colorClass = riskColors[riskLevel];
  if (variant === 'value' && valueBand) colorClass = valueColors[valueBand];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        colorClass
      )}
    >
      {label}
    </span>
  );
}
