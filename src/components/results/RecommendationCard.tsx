'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Check } from 'lucide-react';
import { Recommendation } from '@/types';
import { Card } from '@/components/ui/Card';

interface Props {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50" padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
            <Lightbulb size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Suggested Support Mix</p>
            <h3 className="text-lg font-semibold text-slate-800">{recommendation.title}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {recommendation.rationale}
        </p>

        <ul className="space-y-2 mb-5">
          {recommendation.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
              <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
              {b}
            </li>
          ))}
        </ul>

        <div className="rounded-xl bg-slate-100/70 p-4 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Why this may fit your team</p>
          <p className="text-sm text-slate-600 leading-relaxed">{recommendation.whyFit}</p>
        </div>
      </Card>
    </motion.div>
  );
}
