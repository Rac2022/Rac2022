'use client';

import { useState, useRef, useCallback } from 'react';
import { SnapshotResult } from '@/types';
import { exampleScenario } from '@/data/exampleScenario';
import { generateResults } from '@/lib/recommendations';
import { Hero } from '@/components/sections/Hero';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Wizard } from '@/components/stepper/Wizard';
import { ResultsView } from '@/components/results/ResultsView';
import { Card } from '@/components/ui/Card';

type AppView = 'home' | 'wizard' | 'results';

export default function HomePage() {
  const [view, setView] = useState<AppView>('home');
  const [result, setResult] = useState<SnapshotResult | null>(null);
  const [wizardKey, setWizardKey] = useState(0);
  const [wizardInitialData, setWizardInitialData] = useState<typeof exampleScenario | undefined>(undefined);

  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStart = () => {
    setWizardInitialData(undefined);
    setWizardKey((k) => k + 1);
    setView('wizard');
    scrollToTop();
  };

  const handleExample = () => {
    const exampleResult = generateResults(exampleScenario);
    setResult(exampleResult);
    setView('results');
    scrollToTop();
  };

  const handleComplete = (r: SnapshotResult) => {
    setResult(r);
    setView('results');
    scrollToTop();
  };

  const handleReset = () => {
    setResult(null);
    setView('home');
    scrollToTop();
  };

  return (
    <div ref={topRef} className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-sm font-semibold text-slate-800 tracking-tight cursor-pointer hover:text-slate-600 transition-colors"
          >
            CE Strategy Snapshot
          </button>
          {view !== 'home' && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        {view === 'home' && (
          <>
            <Hero onStart={handleStart} onExample={handleExample} />
            <HowItWorks />

            {/* Example Scenario Teaser */}
            <section className="py-16">
              <div className="max-w-xl mx-auto text-center">
                <Card padding="lg">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">See It in Action</h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    Not ready to fill in your own details? Load a pre-built example scenario
                    to see what the snapshot looks like for a 12-person PT/OT team in North Carolina.
                  </p>
                  <button
                    onClick={handleExample}
                    className="text-sm font-medium text-slate-800 underline underline-offset-4 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    View Example Snapshot
                  </button>
                </Card>
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-16 text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to explore?</h2>
              <p className="text-sm text-slate-500 mb-6">
                It takes less than two minutes. No account required.
              </p>
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-7 py-3 text-base font-medium text-white hover:bg-slate-700 transition-all cursor-pointer shadow-sm"
              >
                Start Your Snapshot
              </button>
            </section>
          </>
        )}

        {view === 'wizard' && (
          <section className="py-12 sm:py-16">
            <Wizard
              key={wizardKey}
              initialData={wizardInitialData}
              onComplete={handleComplete}
            />
          </section>
        )}

        {view === 'results' && result && (
          <section className="py-12 sm:py-16">
            <ResultsView
              result={result}
              onReset={handleReset}
              onLoadExample={handleExample}
            />
          </section>
        )}
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
