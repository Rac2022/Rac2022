import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'

const identityBullets = [
  'Business development across complex B2B markets',
  'Designing AI-assisted workflows and decision systems',
  'Territory strategy and growth architecture',
  'Writing on intelligence, agency, and the future',
  'Building tools that make people sharper, not lazier',
  'Grounded by family, driven by curiosity',
]

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left */}
        <div>
          <SectionBadge text="About" />
          <BlurText
            text="Not a title. A point of view."
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] mb-8"
          />
          <p className="font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-4">
            I spend my days in business development, where the real work is not selling but understanding: what people need, what systems fail them, and where the leverage actually is.
          </p>
          <p className="font-body font-light text-white/40 text-sm leading-relaxed">
            I spend my nights building AI workflows, writing about the future of human judgment, and studying the deeper patterns behind how technology reshapes how we think and decide. I believe the most important skill of the next decade is knowing when to trust the machine and when to trust yourself.
          </p>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <GlassCard variant="strong" className="aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}me.JPG`}
              alt="Rodolfo Avalos"
              loading="lazy"
              decoding="async"
              width={600}
              height={450}
              className="w-full h-full object-cover rounded-xl"
            />
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
