'use client';

import { TeamProfile, Profession } from '@/types';
import { stateOptions } from '@/data/states';
import { renewalTimelineLabels } from '@/data/options';
import { Users, MapPin, Clock, Briefcase } from 'lucide-react';

interface Props {
  data: TeamProfile;
  onChange: (data: TeamProfile) => void;
}

const professions: { value: Profession; label: string }[] = [
  { value: 'PT', label: 'Physical Therapy (PT)' },
  { value: 'OT', label: 'Occupational Therapy (OT)' },
  { value: 'SLP', label: 'Speech-Language Pathology (SLP)' },
];

export function StepTeamProfile({ data, onChange }: Props) {
  const toggleProfession = (p: Profession) => {
    const updated = data.professions.includes(p)
      ? data.professions.filter((x) => x !== p)
      : [...data.professions, p];
    onChange({ ...data, professions: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Team Profile</h2>
        <p className="text-sm text-slate-500">Tell us about your therapy team so we can tailor the snapshot.</p>
      </div>

      {/* Team Size */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <Users size={16} className="text-slate-400" />
          Team Size
        </label>
        <input
          type="number"
          min={1}
          max={500}
          value={data.teamSize || ''}
          onChange={(e) => onChange({ ...data, teamSize: Math.max(1, parseInt(e.target.value) || 1) })}
          placeholder="e.g., 12"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
        />
      </div>

      {/* Professions */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <Briefcase size={16} className="text-slate-400" />
          Professions (select all that apply)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {professions.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => toggleProfession(p.value)}
              className={`rounded-xl border px-4 py-2.5 text-sm transition-all cursor-pointer ${
                data.professions.includes(p.value)
                  ? 'border-slate-800 bg-slate-800 text-white'
                  : 'border-gray-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* State */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <MapPin size={16} className="text-slate-400" />
          State
        </label>
        <select
          value={data.state}
          onChange={(e) => onChange({ ...data, state: e.target.value })}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-slate-800 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all appearance-none bg-white cursor-pointer"
        >
          <option value="">Select a state</option>
          {stateOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Renewal Timeline */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
          <Clock size={16} className="text-slate-400" />
          Renewal Timeline
        </label>
        <select
          value={data.renewalTimeline}
          onChange={(e) => onChange({ ...data, renewalTimeline: e.target.value as TeamProfile['renewalTimeline'] })}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-slate-800 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all appearance-none bg-white cursor-pointer"
        >
          <option value="">Select timeline</option>
          {Object.entries(renewalTimelineLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
