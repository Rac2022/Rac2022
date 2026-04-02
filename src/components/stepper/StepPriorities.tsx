'use client';

import { Priorities, Goal, Format, Specialty } from '@/types';
import { goalLabels, formatLabels, specialtyLabels } from '@/data/options';
import { Target, Layout, BookOpen } from 'lucide-react';

interface Props {
  data: Priorities;
  onChange: (data: Priorities) => void;
}

function MultiSelect<T extends string>({
  label,
  icon: Icon,
  description,
  options,
  selected,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  description: string;
  options: Record<string, string>;
  selected: T[];
  onChange: (vals: T[]) => void;
}) {
  const toggle = (val: T) => {
    onChange(
      selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
    );
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
        <Icon size={16} className="text-slate-400" />
        {label}
      </label>
      <p className="text-xs text-slate-400 mb-2">{description}</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([val, lbl]) => (
          <button
            key={val}
            type="button"
            onClick={() => toggle(val as T)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-all cursor-pointer ${
              selected.includes(val as T)
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

export function StepPriorities({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Priorities</h2>
        <p className="text-sm text-slate-500">What matters most to your team right now?</p>
      </div>

      <MultiSelect<Goal>
        label="Top Goals"
        icon={Target}
        description="Select all that apply"
        options={goalLabels}
        selected={data.goals}
        onChange={(goals) => onChange({ ...data, goals })}
      />

      <MultiSelect<Format>
        label="Desired Formats"
        icon={Layout}
        description="Which CE formats interest your team?"
        options={formatLabels}
        selected={data.formats}
        onChange={(formats) => onChange({ ...data, formats })}
      />

      <MultiSelect<Specialty>
        label="Specialty Interests"
        icon={BookOpen}
        description="Any specialty areas your team is focused on?"
        options={specialtyLabels}
        selected={data.specialties}
        onChange={(specialties) => onChange({ ...data, specialties })}
      />
    </div>
  );
}
