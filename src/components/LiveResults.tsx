'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ClipboardList,
  Layers,
  Lightbulb,
  TrendingUp,
  Clock,
  ShieldCheck,
  Check,
  ArrowRight,
  Phone,
  FileText,
  Copy,
} from 'lucide-react';
import { SnapshotInput, SnapshotResult } from '@/types';
import { generateResults } from '@/lib/recommendations';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Meter } from '@/components/ui/Meter';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Props {
  data: SnapshotInput;
}

function hasMinimumInput(data: SnapshotInput): boolean {
  return (
    data.teamProfile.teamSize > 0 &&
    data.teamProfile.professions.length > 0
  );
}

function fillDefaults(data: SnapshotInput): SnapshotInput {
  return {
    teamProfile: {
      ...data.teamProfile,
      state: data.teamProfile.state || 'NC',
      renewalTimeline: data.teamProfile.renewalTimeline || '3-to-6-months',
    },
    currentSetup: {
      ceApproach: data.currentSetup.ceApproach || 'mixed-vendors',
      trackingMethod: data.currentSetup.trackingMethod || 'manual-spreadsheets',
      confidenceLevel: data.currentSetup.confidenceLevel || 'not-fully-sure',
    },
    priorities: {
      goals: data.priorities.goals.length > 0 ? data.priorities.goals : ['compliance'],
      formats: data.priorities.formats.length > 0 ? data.priorities.formats : ['on-demand'],
      specialties: data.priorities.specialties.length > 0 ? data.priorities.specialties : ['general-rehab'],
    },
    liveSupport: {
      needsLiveHours: data.liveSupport.needsLiveHours || 'not-sure',
      teamEventsValuable: data.liveSupport.teamEventsValuable || 'maybe',
      centralizedVisibility: data.liveSupport.centralizedVisibility || 'yes',
    },
  };
}

const valueIcons = [TrendingUp, Clock, ShieldCheck];

export function LiveResults({ data }: Props) {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState<'walkthrough' | 'custom' | null>(null);
  const [copied, setCopied] = useState(false);

  const ready = hasMinimumInput(data);

  const result: SnapshotResult | null = useMemo(() => {
    if (!ready) return null;
    return generateResults(fillDefaults(data));
  }, [data, ready]);

  const handleCopy = () => {
    if (!result) return;
    const summary = [
      'CE Strategy Snapshot',
      `Team: ${result.input.teamProfile.teamSize} clinicians (${result.input.teamProfile.professions.join(', ')})`,
      `Admin Burden: ${result.adminBurden.level}`,
      `Fragmentation Risk: ${result.fragmentationRisk.level}`,
      `Recommendation: ${result.recommendation.title}`,
      `Next Step: ${result.nextStep.text}`,
      '',
      'Illustrative planning tool. Not a formal quote or compliance review.',
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
          onSubmit={(e) => { e.preventDefault(); setFormSubmitted(type); }}
          className="space-y-3"
        >
          <input type="text" placeholder="Your name" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none" />
          <input type="email" placeholder="Email address" required className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none" />
          <input type="text" placeholder="Organization (optional)" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none" />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      )}
    </div>
  );

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mx-auto mb-4">
            <Lightbulb size={24} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Your snapshot will appear here</p>
          <p className="text-xs text-slate-400">Select a team size and at least one profession to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={JSON.stringify(data)}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="space-y-4"
      >
        {/* Team Summary */}
        <Card padding="sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-800">Team Snapshot</h3>
            <Badge label={result!.urgencyLabel || 'Flexible timeline'} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span><strong className="text-slate-700">{data.teamProfile.teamSize}</strong> clinicians</span>
            {data.teamProfile.professions.length > 0 && (
              <span>{data.teamProfile.professions.join(', ')}</span>
            )}
            {result!.liveRelevant && <span className="text-blue-600">Live hours may apply</span>}
          </div>
        </Card>

        {/* Admin Burden + Fragmentation */}
        <div className="grid grid-cols-2 gap-3">
          <Card padding="sm">
            <div className="flex items-center gap-1.5 mb-2">
              <ClipboardList size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-slate-700">Admin Burden</span>
            </div>
            <Meter level={result!.adminBurden.level} />
            <div className="mt-2">
              <Badge label={result!.adminBurden.level} variant="risk" riskLevel={result!.adminBurden.level} />
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Layers size={14} className="text-orange-500" />
              <span className="text-xs font-semibold text-slate-700">Fragmentation</span>
            </div>
            <Meter level={result!.fragmentationRisk.level} />
            <div className="mt-2">
              <Badge label={result!.fragmentationRisk.level} variant="risk" riskLevel={result!.fragmentationRisk.level} />
            </div>
          </Card>
        </div>

        {/* Blind Spots */}
        <Card padding="sm">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-700">Potential Blind Spots</span>
          </div>
          <ul className="space-y-1.5">
            {result!.blindSpots.slice(0, 4).map((spot, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                {spot.text}
              </li>
            ))}
          </ul>
        </Card>

        {/* Recommendation */}
        <Card padding="sm" className="bg-gradient-to-br from-white to-slate-50 border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800">
              <Lightbulb size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Suggested Support Mix</p>
              <h3 className="text-sm font-semibold text-slate-800">{result!.recommendation.title}</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">{result!.recommendation.rationale}</p>
          <ul className="space-y-1.5 mb-3">
            {result!.recommendation.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
          <div className="rounded-lg bg-slate-100/70 p-3 border border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">Why this may fit</p>
            <p className="text-xs text-slate-600 leading-relaxed">{result!.recommendation.whyFit}</p>
          </div>
        </Card>

        {/* Value Cards */}
        <div className="grid grid-cols-3 gap-2">
          {result!.valueCards.map((card, i) => {
            const Icon = valueIcons[i] ?? TrendingUp;
            return (
              <Card key={i} padding="sm">
                <Icon size={14} className="text-slate-500 mb-1.5" />
                <p className="text-xs font-semibold text-slate-700 mb-1">{card.label}</p>
                <Badge label={card.band} variant="value" valueBand={card.band} />
                <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">{card.note}</p>
              </Card>
            );
          })}
        </div>

        {/* Next Step */}
        <Card padding="sm" className="bg-slate-800 border-slate-700">
          <div className="flex items-start gap-2">
            <ArrowRight size={14} className="text-slate-300 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">Next Step</p>
              <p className="text-xs text-white leading-relaxed">{result!.nextStep.text}</p>
            </div>
          </div>
        </Card>

        {/* CTAs */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button size="sm" onClick={() => setWalkthroughOpen(true)} className="gap-1.5">
            <Phone size={13} />
            Book a Walkthrough
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCustomOpen(true)} className="gap-1.5">
            <FileText size={13} />
            Custom Snapshot
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-slate-400 pt-1">
          Illustrative planning tool. Not a formal quote or compliance review.
        </p>

        {/* Modals */}
        <Modal
          open={walkthroughOpen}
          onClose={() => { setWalkthroughOpen(false); setFormSubmitted(null); }}
          title="Book a Walkthrough"
        >
          <p className="text-sm text-slate-500 mb-4">
            Share your details and we&apos;ll reach out to schedule a brief walkthrough.
          </p>
          <MockForm type="walkthrough" />
        </Modal>
        <Modal
          open={customOpen}
          onClose={() => { setCustomOpen(false); setFormSubmitted(null); }}
          title="Request a Custom Team Snapshot"
        >
          <p className="text-sm text-slate-500 mb-4">
            Want a more detailed, team-specific analysis? Let us know.
          </p>
          <MockForm type="custom" />
        </Modal>
      </motion.div>
    </AnimatePresence>
  );
}
