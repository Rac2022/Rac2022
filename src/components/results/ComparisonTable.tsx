'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ComparisonRow } from '@/types';
import { Card } from '@/components/ui/Card';

interface Props {
  comparison: ComparisonRow[];
}

export function ComparisonTable({ comparison }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Side-by-Side Comparison</h3>
        <p className="text-xs text-slate-500 mb-4">Current model vs. a more centralized approach</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wide w-1/3">Dimension</th>
                <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wide w-1/3">Current Model</th>
                <th className="text-left py-2 text-xs font-medium text-slate-500 uppercase tracking-wide w-1/3">More Centralized</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-700">{row.dimension}</td>
                  <td className="py-3 pr-4 text-slate-500">{row.current}</td>
                  <td className="py-3 text-slate-700 flex items-center gap-1.5">
                    <ArrowRight size={12} className="text-emerald-500 shrink-0" />
                    {row.centralized}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
