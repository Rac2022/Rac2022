'use client';

import { useState } from 'react';
import { SnapshotInput } from '@/types';
import { exampleScenario } from '@/data/exampleScenario';
import { InputPanel } from '@/components/InputPanel';
import { LiveResults } from '@/components/LiveResults';

const emptyInput: SnapshotInput = {
  teamProfile: { teamSize: 10, professions: ['PT'], state: '', renewalTimeline: '' as SnapshotInput['teamProfile']['renewalTimeline'] },
  currentSetup: { ceApproach: '' as SnapshotInput['currentSetup']['ceApproach'], trackingMethod: '' as SnapshotInput['currentSetup']['trackingMethod'], confidenceLevel: '' as SnapshotInput['currentSetup']['confidenceLevel'] },
  priorities: { goals: [], formats: [], specialties: [] },
  liveSupport: { needsLiveHours: '' as SnapshotInput['liveSupport']['needsLiveHours'], teamEventsValuable: '' as SnapshotInput['liveSupport']['teamEventsValuable'], centralizedVisibility: '' as SnapshotInput['liveSupport']['centralizedVisibility'] },
};

export default function HomePage() {
  const [data, setData] = useState<SnapshotInput>(emptyInput);

  const handleLoadExample = () => {
    setData({ ...exampleScenario });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800 tracking-tight">
            CE Strategy Snapshot
          </span>
          <span className="text-xs text-slate-400 hidden sm:block">
            Adjust inputs and see your snapshot instantly
          </span>
        </div>
      </header>

      {/* Hero — tight, one-line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
          See what a cleaner CE strategy could look like for your team.
        </h1>
        <p className="text-sm text-slate-500">
          Adjust a few inputs and explore an illustrative planning view — no sign-up, no waiting.
        </p>
      </div>

      {/* Two-column live layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: Inputs */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                <h2 className="text-sm font-semibold text-slate-800 mb-4">Your Team</h2>
                <InputPanel
                  data={data}
                  onChange={setData}
                  onLoadExample={handleLoadExample}
                />
              </div>
            </div>
          </div>

          {/* Right: Live Results */}
          <div className="lg:col-span-8">
            <LiveResults data={data} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-slate-400">
          CE Strategy Snapshot — An illustrative planning tool. Not compliance advice.
        </p>
      </footer>
    </div>
  );
}
