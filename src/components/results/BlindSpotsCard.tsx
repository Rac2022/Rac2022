'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { BlindSpot } from '@/types';
import { Card } from '@/components/ui/Card';

interface Props {
  blindSpots: BlindSpot[];
}

export function BlindSpotsCard({ blindSpots }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Potential Blind Spots</h3>
            <p className="text-xs text-slate-500">Areas that may be worth double-checking</p>
          </div>
        </div>
        <ul className="space-y-2.5">
          {blindSpots.map((spot, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
              {spot.text}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}
