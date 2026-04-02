'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NextStep } from '@/types';
import { Card } from '@/components/ui/Card';

interface Props {
  nextStep: NextStep;
}

export function NextStepCard({ nextStep }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-700">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shrink-0">
            <ArrowRight size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300 uppercase tracking-wide mb-1">Recommended Next Step</p>
            <p className="text-base text-white leading-relaxed">{nextStep.text}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
