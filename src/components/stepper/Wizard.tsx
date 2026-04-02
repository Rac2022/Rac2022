'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SnapshotInput, SnapshotResult } from '@/types';
import { generateResults } from '@/lib/recommendations';
import { StepIndicator } from './StepIndicator';
import { StepTeamProfile } from './StepTeamProfile';
import { StepCurrentSetup } from './StepCurrentSetup';
import { StepPriorities } from './StepPriorities';
import { StepLiveSupport } from './StepLiveSupport';
import { Button } from '@/components/ui/Button';

interface WizardProps {
  initialData?: SnapshotInput;
  onComplete: (result: SnapshotResult) => void;
}

const defaultInput: SnapshotInput = {
  teamProfile: { teamSize: 1, professions: [], state: '', renewalTimeline: '' as SnapshotInput['teamProfile']['renewalTimeline'] },
  currentSetup: { ceApproach: '' as SnapshotInput['currentSetup']['ceApproach'], trackingMethod: '' as SnapshotInput['currentSetup']['trackingMethod'], confidenceLevel: '' as SnapshotInput['currentSetup']['confidenceLevel'] },
  priorities: { goals: [], formats: [], specialties: [] },
  liveSupport: { needsLiveHours: '' as SnapshotInput['liveSupport']['needsLiveHours'], teamEventsValuable: '' as SnapshotInput['liveSupport']['teamEventsValuable'], centralizedVisibility: '' as SnapshotInput['liveSupport']['centralizedVisibility'] },
};

const stepLabels = ['Team', 'Setup', 'Priorities', 'Live Support'];

export function Wizard({ initialData, onComplete }: WizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SnapshotInput>(initialData ?? defaultInput);
  const [direction, setDirection] = useState(1);

  const canNext = (): boolean => {
    switch (step) {
      case 0:
        return data.teamProfile.teamSize > 0 && data.teamProfile.professions.length > 0 && !!data.teamProfile.state && !!data.teamProfile.renewalTimeline;
      case 1:
        return !!data.currentSetup.ceApproach && !!data.currentSetup.trackingMethod && !!data.currentSetup.confidenceLevel;
      case 2:
        return data.priorities.goals.length > 0 && data.priorities.formats.length > 0;
      case 3:
        return !!data.liveSupport.needsLiveHours && !!data.liveSupport.teamEventsValuable && !!data.liveSupport.centralizedVisibility;
      default:
        return false;
    }
  };

  const next = () => {
    if (step < 3) {
      setDirection(1);
      setStep(step + 1);
    } else {
      const result = generateResults(data);
      onComplete(result);
    }
  };

  const prev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <StepIndicator currentStep={step} totalSteps={4} labels={stepLabels} />

      <div className="relative overflow-hidden min-h-[420px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {step === 0 && (
              <StepTeamProfile
                data={data.teamProfile}
                onChange={(teamProfile) => setData({ ...data, teamProfile })}
              />
            )}
            {step === 1 && (
              <StepCurrentSetup
                data={data.currentSetup}
                onChange={(currentSetup) => setData({ ...data, currentSetup })}
              />
            )}
            {step === 2 && (
              <StepPriorities
                data={data.priorities}
                onChange={(priorities) => setData({ ...data, priorities })}
              />
            )}
            {step === 3 && (
              <StepLiveSupport
                data={data.liveSupport}
                onChange={(liveSupport) => setData({ ...data, liveSupport })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={step === 0}
          className="gap-1"
        >
          <ChevronLeft size={16} />
          Back
        </Button>

        <Button
          onClick={next}
          disabled={!canNext()}
          className="gap-1"
        >
          {step === 3 ? (
            <>
              <Sparkles size={16} />
              Generate Snapshot
            </>
          ) : (
            <>
              Next
              <ChevronRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
