'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { FragmentationRisk } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Meter } from '@/components/ui/Meter';

interface Props {
  fragmentationRisk: FragmentationRisk;
}

export function FragmentationCard({ fragmentationRisk }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <Layers size={16} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Estimated Fragmentation Risk</h3>
          </div>
          <Badge label={fragmentationRisk.level} variant="risk" riskLevel={fragmentationRisk.level} />
        </div>
        <Meter level={fragmentationRisk.level} />
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          {fragmentationRisk.explanation}
        </p>
      </Card>
    </motion.div>
  );
}
