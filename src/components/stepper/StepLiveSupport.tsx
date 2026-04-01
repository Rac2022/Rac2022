'use client';

import { LiveSupport } from '@/types';
import { Radio, Users, Eye } from 'lucide-react';

interface Props {
  data: LiveSupport;
  onChange: (data: LiveSupport) => void;
}

function TriSelect({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
        <Icon size={16} className="text-slate-400" />
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
              value === opt.value
                ? 'border-slate-800 bg-slate-800 text-white'
                : 'border-gray-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepLiveSupport({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Live Support Needs</h2>
        <p className="text-sm text-slate-500">Help us understand if live education is part of your planning.</p>
      </div>

      <TriSelect
        label="Does your team need live CE hours?"
        icon={Radio}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not-sure', label: 'Not sure' },
        ]}
        value={data.needsLiveHours}
        onChange={(v) => onChange({ ...data, needsLiveHours: v as LiveSupport['needsLiveHours'] })}
      />

      <TriSelect
        label="Would team-based CE events be valuable?"
        icon={Users}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'maybe', label: 'Maybe' },
          { value: 'no', label: 'No' },
        ]}
        value={data.teamEventsValuable}
        onChange={(v) => onChange({ ...data, teamEventsValuable: v as LiveSupport['teamEventsValuable'] })}
      />

      <TriSelect
        label="Is centralized visibility into CE progress important?"
        icon={Eye}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'somewhat', label: 'Somewhat' },
          { value: 'not-really', label: 'Not really' },
        ]}
        value={data.centralizedVisibility}
        onChange={(v) => onChange({ ...data, centralizedVisibility: v as LiveSupport['centralizedVisibility'] })}
      />
    </div>
  );
}
