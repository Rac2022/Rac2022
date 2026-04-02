'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, ShieldCheck } from 'lucide-react';
import { ValueCard } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Props {
  valueCards: ValueCard[];
}

const icons = [TrendingUp, Clock, ShieldCheck];

export function ValueSummary({ valueCards }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Illustrative Value Summary</h3>
        <p className="text-xs text-slate-500">Directional indicators — not guarantees</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {valueCards.map((card, i) => {
          const Icon = icons[i] ?? TrendingUp;
          return (
            <Card key={i} padding="sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <Icon size={16} className="text-slate-600" />
                </div>
                <span className="text-sm font-semibold text-slate-800">{card.label}</span>
              </div>
              <Badge label={card.band} variant="value" valueBand={card.band} />
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">{card.note}</p>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
