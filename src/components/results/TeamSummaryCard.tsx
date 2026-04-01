'use client';

import { motion } from 'framer-motion';
import { Users, MapPin, Clock, Radio } from 'lucide-react';
import { SnapshotResult } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { stateConfigs } from '@/data/states';

interface Props {
  result: SnapshotResult;
}

export function TeamSummaryCard({ result }: Props) {
  const { input, urgencyLabel, liveRelevant } = result;
  const { teamProfile } = input;
  const stateConfig = stateConfigs[teamProfile.state];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Team Snapshot Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-start gap-2">
            <Users size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Team Size</p>
              <p className="text-sm font-semibold text-slate-800">{teamProfile.teamSize} clinicians</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Professions</p>
              <p className="text-sm font-semibold text-slate-800">{teamProfile.professions.join(', ')}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">State</p>
              <p className="text-sm font-semibold text-slate-800">{stateConfig?.label ?? teamProfile.state}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Radio size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Live Support</p>
              <p className="text-sm font-semibold text-slate-800">{liveRelevant ? 'Likely relevant' : 'May not be needed'}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Badge label={urgencyLabel} />
        </div>
      </Card>
    </motion.div>
  );
}
