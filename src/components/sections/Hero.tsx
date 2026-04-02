'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Eye, CheckCircle2, BarChart3, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  onStart: () => void;
  onExample: () => void;
}

const bullets = [
  { icon: BarChart3, text: 'Compare group vs. fragmented CE support' },
  { icon: CheckCircle2, text: 'Visualize admin simplification' },
  { icon: Sparkles, text: 'Explore live education fit' },
  { icon: Clock, text: 'Get a rough planning snapshot in under 2 minutes' },
];

export function Hero({ onStart, onExample }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-slate-100/60 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center py-20 sm:py-28 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase mb-3">
            CE Strategy Snapshot
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight mb-4">
            See what a cleaner CE strategy could look like for your team.
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
            A quick, illustrative snapshot to help you explore how centralized education
            support could simplify planning for your therapy team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Button size="lg" onClick={onStart} className="gap-2">
            Start Snapshot
            <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="outline" onClick={onExample} className="gap-2">
            <Eye size={18} />
            View Example
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto"
        >
          {bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-sm text-slate-600 bg-white/70 rounded-xl px-4 py-2.5 border border-gray-100"
            >
              <b.icon size={16} className="text-slate-400 shrink-0" />
              {b.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
