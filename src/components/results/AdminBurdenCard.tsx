'use client';

import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { AdminBurden } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Meter } from '@/components/ui/Meter';

interface Props {
  adminBurden: AdminBurden;
}

export function AdminBurdenCard({ adminBurden }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <ClipboardList size={16} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Estimated Admin Burden</h3>
          </div>
          <Badge label={adminBurden.level} variant="risk" riskLevel={adminBurden.level} />
        </div>
        <Meter level={adminBurden.level} />
        <ul className="mt-4 space-y-2">
          {adminBurden.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}
