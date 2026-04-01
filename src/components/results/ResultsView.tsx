'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, PlayCircle, Phone, FileText, Copy, Check } from 'lucide-react';
import { SnapshotResult } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TeamSummaryCard } from './TeamSummaryCard';
import { BlindSpotsCard } from './BlindSpotsCard';
import { AdminBurdenCard } from './AdminBurdenCard';
import { FragmentationCard } from './FragmentationCard';
import { RecommendationCard } from './RecommendationCard';
import { ValueSummary } from './ValueSummary';
import { ComparisonTable } from './ComparisonTable';
import { NextStepCard } from './NextStepCard';

interface Props {
  result: SnapshotResult;
  onReset: () => void;
  onLoadExample: () => void;
}

export function ResultsView({ result, onReset, onLoadExample }: Props) {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState<'walkthrough' | 'custom' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = [
      `CE Strategy Snapshot`,
      `Team: ${result.input.teamProfile.teamSize} clinicians (${result.input.teamProfile.professions.join(', ')})`,
      `Urgency: ${result.urgencyLabel}`,
      `Admin Burden: ${result.adminBurden.level}`,
      `Fragmentation Risk: ${result.fragmentationRisk.level}`,
      `Recommendation: ${result.recommendation.title}`,
      `Next Step: ${result.nextStep.text}`,
      '',
      'This snapshot is illustrative and intended for planning conversations only.',
    ].join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const MockForm = ({ type }: { type: 'walkthrough' | 'custom' }) => (
    <div>
      {formSubmitted === type ? (
        <div className="text-center py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mx-auto mb-3">
            <Check size={20} className="text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-800">Thank you!</p>
          <p className="text-xs text-slate-500 mt-1">We&apos;ll be in touch shortly.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFormSubmitted(type);
          }}
          className="space-y-3"
        >
          <input
            type="text"
            placeholder="Your name"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email address"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Organization (optional)"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your CE Strategy Snapshot</h2>
        <p className="text-sm text-slate-500">
          An illustrative overview based on the details you shared. Intended for planning conversations only.
        </p>
      </motion.div>

      <TeamSummaryCard result={result} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminBurdenCard adminBurden={result.adminBurden} />
        <FragmentationCard fragmentationRisk={result.fragmentationRisk} />
      </div>

      <BlindSpotsCard blindSpots={result.blindSpots} />
      <RecommendationCard recommendation={result.recommendation} />
      <ValueSummary valueCards={result.valueCards} />
      <ComparisonTable comparison={result.comparison} />
      <NextStepCard nextStep={result.nextStep} />

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-slate-400 pt-2"
      >
        This snapshot is illustrative and intended for planning conversations only.
        It does not constitute compliance advice or guaranteed outcomes.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="flex flex-wrap items-center justify-center gap-3 pt-4 pb-8"
      >
        <Button variant="outline" onClick={onLoadExample} className="gap-2">
          <PlayCircle size={16} />
          Use Example Data
        </Button>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw size={16} />
          Reset Snapshot
        </Button>
        <Button variant="secondary" onClick={handleCopySummary} className="gap-2">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Summary'}
        </Button>
        <Button onClick={() => setWalkthroughOpen(true)} className="gap-2">
          <Phone size={16} />
          Book a Walkthrough
        </Button>
        <Button variant="secondary" onClick={() => setCustomOpen(true)} className="gap-2">
          <FileText size={16} />
          Request Custom Snapshot
        </Button>
      </motion.div>

      <Modal
        open={walkthroughOpen}
        onClose={() => { setWalkthroughOpen(false); setFormSubmitted(null); }}
        title="Book a Walkthrough"
      >
        <p className="text-sm text-slate-500 mb-4">
          Share your details and we&apos;ll reach out to schedule a brief walkthrough of how this snapshot could translate into a real plan.
        </p>
        <MockForm type="walkthrough" />
      </Modal>

      <Modal
        open={customOpen}
        onClose={() => { setCustomOpen(false); setFormSubmitted(null); }}
        title="Request a Custom Team Snapshot"
      >
        <p className="text-sm text-slate-500 mb-4">
          Want a more detailed, team-specific analysis? Let us know and we&apos;ll put one together for you.
        </p>
        <MockForm type="custom" />
      </Modal>
    </div>
  );
}
