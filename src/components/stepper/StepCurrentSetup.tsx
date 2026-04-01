'use client';

import { CurrentSetup } from '@/types';
import { ceApproachLabels, trackingMethodLabels, confidenceLevelLabels } from '@/data/options';
import { Settings, BarChart3, ShieldCheck } from 'lucide-react';

interface Props {
  data: CurrentSetup;
  onChange: (data: CurrentSetup) => void;
}

function RadioGroup({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  options: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
        <Icon size={16} className="text-slate-400" />
        {label}
      </label>
      <div className="space-y-2">
        {Object.entries(options).map(([val, lbl]) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-all cursor-pointer ${
              value === val
                ? 'border-slate-800 bg-slate-800 text-white'
                : 'border-gray-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepCurrentSetup({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Current Setup</h2>
        <p className="text-sm text-slate-500">How does your team currently handle continuing education?</p>
      </div>

      <RadioGroup
        label="Current CE Approach"
        icon={Settings}
        options={ceApproachLabels}
        value={data.ceApproach}
        onChange={(v) => onChange({ ...data, ceApproach: v as CurrentSetup['ceApproach'] })}
      />

      <RadioGroup
        label="Current Tracking Method"
        icon={BarChart3}
        options={trackingMethodLabels}
        value={data.trackingMethod}
        onChange={(v) => onChange({ ...data, trackingMethod: v as CurrentSetup['trackingMethod'] })}
      />

      <RadioGroup
        label="Confidence in Current CE Coverage"
        icon={ShieldCheck}
        options={confidenceLevelLabels}
        value={data.confidenceLevel}
        onChange={(v) => onChange({ ...data, confidenceLevel: v as CurrentSetup['confidenceLevel'] })}
      />
    </div>
  );
}
