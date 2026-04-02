'use client';

import { useMemo } from 'react';
import { SnapshotInput, Profession, Goal, Format, CEApproach } from '@/types';
import { stateOptions } from '@/data/states';
import { goalLabels, formatLabels } from '@/data/options';
import { Users, MapPin } from 'lucide-react';

interface Props {
  data: SnapshotInput;
  onChange: (data: SnapshotInput) => void;
  onLoadExample: () => void;
}

const professions: { value: Profession; label: string }[] = [
  { value: 'PT', label: 'PT' },
  { value: 'OT', label: 'OT' },
  { value: 'SLP', label: 'SLP' },
];

const teamSizePresets = [5, 10, 15, 25, 50];

const setupOptions: { value: CEApproach; label: string }[] = [
  { value: 'individual', label: 'Individual purchases' },
  { value: 'mixed-vendors', label: 'Mixed vendors' },
  { value: 'manual-adhoc', label: 'Mostly manual' },
  { value: 'centralized', label: 'Already centralized' },
];

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
        selected
          ? 'border-slate-800 bg-slate-800 text-white'
          : 'border-gray-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}

function SegmentedButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer text-left ${
        selected
          ? 'border-slate-800 bg-slate-800 text-white'
          : 'border-gray-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}

export function InputPanel({ data, onChange, onLoadExample }: Props) {
  const toggleProfession = (p: Profession) => {
    const current = data.teamProfile.professions;
    const updated = current.includes(p) ? current.filter((x) => x !== p) : [...current, p];
    onChange({ ...data, teamProfile: { ...data.teamProfile, professions: updated } });
  };

  const toggleGoal = (g: Goal) => {
    const current = data.priorities.goals;
    const updated = current.includes(g) ? current.filter((x) => x !== g) : [...current, g];
    onChange({ ...data, priorities: { ...data.priorities, goals: updated } });
  };

  const toggleFormat = (f: Format) => {
    const current = data.priorities.formats;
    const updated = current.includes(f) ? current.filter((x) => x !== f) : [...current, f];
    onChange({ ...data, priorities: { ...data.priorities, formats: updated } });
  };

  const setTeamSize = (size: number) => {
    onChange({ ...data, teamProfile: { ...data.teamProfile, teamSize: Math.max(1, size) } });
  };

  const setApproach = (approach: CEApproach) => {
    onChange({ ...data, currentSetup: { ...data.currentSetup, ceApproach: approach } });
  };

  const setState = (state: string) => {
    onChange({ ...data, teamProfile: { ...data.teamProfile, state } });
  };

  return (
    <div className="space-y-5">
      {/* Load Sample */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">Quick start:</span>
        <button
          type="button"
          onClick={onLoadExample}
          className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-medium text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer"
        >
          Load Sample Team
        </button>
      </div>

      {/* Team Size */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-2">
          <Users size={13} className="text-slate-400" />
          Team Size
        </label>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {teamSizePresets.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTeamSize(size)}
                className={`h-8 w-10 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  data.teamProfile.teamSize === size
                    ? 'border-slate-800 bg-slate-800 text-white'
                    : 'border-gray-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            max={500}
            value={data.teamProfile.teamSize || ''}
            onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
            placeholder="Other"
            className="h-8 w-16 rounded-lg border border-gray-200 px-2 text-xs text-slate-800 text-center placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Professions */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">Professions</label>
        <div className="flex gap-2">
          {professions.map((p) => (
            <Chip
              key={p.value}
              label={p.label}
              selected={data.teamProfile.professions.includes(p.value)}
              onClick={() => toggleProfession(p.value)}
            />
          ))}
        </div>
      </div>

      {/* State */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 mb-2">
          <MapPin size={13} className="text-slate-400" />
          State
        </label>
        <select
          value={data.teamProfile.state}
          onChange={(e) => setState(e.target.value)}
          className="w-full h-8 rounded-lg border border-gray-200 px-2 text-xs text-slate-800 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 focus:outline-none appearance-none bg-white cursor-pointer"
        >
          <option value="">Select a state</option>
          {stateOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Current Setup */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">Current CE Approach</label>
        <div className="grid grid-cols-1 gap-1.5">
          {setupOptions.map((opt) => (
            <SegmentedButton
              key={opt.value}
              label={opt.label}
              selected={data.currentSetup.ceApproach === opt.value}
              onClick={() => setApproach(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">Top Goals</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(goalLabels).map(([val, lbl]) => (
            <Chip
              key={val}
              label={lbl}
              selected={data.priorities.goals.includes(val as Goal)}
              onClick={() => toggleGoal(val as Goal)}
            />
          ))}
        </div>
      </div>

      {/* Formats */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">Formats of Interest</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(formatLabels).map(([val, lbl]) => (
            <Chip
              key={val}
              label={lbl}
              selected={data.priorities.formats.includes(val as Format)}
              onClick={() => toggleFormat(val as Format)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
