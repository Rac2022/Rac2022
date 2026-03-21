import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'

const identityBullets = [
  'Business Development Professional',
  'AI Workflow Builder',
  'Territory Intelligence Thinker',
  'Creative Problem Solver',
  'Future-Focused Learner',
  'Family-Driven and Grounded',
]

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left */}
        <div>
          <SectionBadge text="About" />
          <BlurText
            text="Not just a title. A way of thinking."
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] mb-8"
          />
          <p className="font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-4">
            Rodolfo is a professional who does more than sell. He connects ideas, people, systems, and opportunities. He works at the overlap of execution and imagination — helping teams move faster, communicate better, and make smarter decisions.
          </p>
          <p className="font-body font-light text-white/40 text-sm leading-relaxed">
            Whether it's structuring a territory plan, building an AI workflow, or thinking about what the future of work actually looks like, Rodolfo brings the same energy: clarity, curiosity, and a builder's bias toward action.
          </p>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {/* Portrait placeholder */}
          <GlassCard variant="strong" className="aspect-[4/3] flex items-center justify-center mb-4">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-white/5 to-white/[0.01] flex items-center justify-center">
              <span className="font-heading italic text-6xl text-white/10">RA</span>
              {/* Replace with: <img src="/images/rodolfo-portrait.jpg" alt="Rodolfo Avalos" className="w-full h-full object-cover rounded-xl" /> */}
            </div>
          </GlassCard>

          {/* Identity bullets */}
          <GlassCard delay={0.2}>
            <ul className="space-y-3">
              {identityBullets.map((bullet, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                  <span className="font-body font-light text-white/60 text-sm">{bullet}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
