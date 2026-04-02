'use client';

import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;

        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-300',
                  isCompleted && 'bg-slate-800 text-white',
                  isCurrent && 'bg-slate-800 text-white ring-4 ring-slate-200',
                  !isCompleted && !isCurrent && 'bg-gray-100 text-gray-400'
                )}
              >
                {isCompleted ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={clsx(
                  'text-xs hidden sm:block',
                  isCurrent ? 'text-slate-700 font-medium' : 'text-gray-400'
                )}
              >
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div
                className={clsx(
                  'h-px w-8 sm:w-12 transition-colors duration-300',
                  i < currentStep ? 'bg-slate-800' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
