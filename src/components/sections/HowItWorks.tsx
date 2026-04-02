'use client';

import { motion } from 'framer-motion';
import { ClipboardList, Search, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const steps = [
  {
    icon: ClipboardList,
    title: 'Enter Team Details',
    description: 'Share a few basics about your therapy team, current CE setup, and priorities.',
  },
  {
    icon: Search,
    title: 'See Potential Blind Spots',
    description: 'Get a quick read on where fragmentation or admin overhead may be hiding.',
  },
  {
    icon: Lightbulb,
    title: 'Review a Suggested Support Mix',
    description: 'See an illustrative recommendation tailored to your team profile.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-2">How It Works</h2>
          <p className="text-sm text-slate-500">Three simple steps. Less than two minutes.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="text-center h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mx-auto mb-4">
                  <step.icon size={22} className="text-slate-600" />
                </div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Step {i + 1}
                </p>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
