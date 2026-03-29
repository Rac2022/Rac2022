import { ArrowUpRight, Mail, Linkedin, Github, Calendar } from 'lucide-react'
import BlurText from '@/components/BlurText'
import GlassCard from '@/components/GlassCard'

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'rodolfoavalos635@gmail.com', href: 'mailto:rodolfoavalos635@gmail.com' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/rodolfo-avalos', href: 'https://www.linkedin.com/in/rodolfo-avalos-69683168/' },
  { icon: Github, label: 'GitHub', value: 'github.com/Rac2022', href: 'https://github.com/Rac2022' },
  { icon: Calendar, label: 'Schedule', value: 'Book a conversation', href: '#' },
]

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-28 md:py-40 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <BlurText
          text="Let's think together."
          as="h2"
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center mb-6"
        />

        <p className="max-w-xl mx-auto font-body font-light text-white/50 text-sm md:text-base leading-relaxed mb-10">
          If you are building something at the intersection of AI, strategy, and human judgment, I would like to hear about it.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="mailto:rodolfoavalos635@gmail.com"
            className="liquid-glass-strong flex items-center gap-2 px-6 py-3 rounded-full font-body font-medium text-sm text-white hover:bg-white/10 transition-colors"
          >
            Connect With Me <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="mailto:rodolfoavalos635@gmail.com"
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-body font-medium text-sm hover:bg-white/90 transition-colors"
          >
            Email Me
          </a>
        </div>

        {/* Contact methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {contactMethods.map((method, i) => (
            <GlassCard key={i} delay={i * 0.08} className="text-center group">
              <a href={method.href} target="_blank" rel="noopener noreferrer" className="block">
                <method.icon className="w-4 h-4 text-white/30 mx-auto mb-2 group-hover:text-white/60 transition-colors" />
                <p className="font-body font-medium text-white text-xs mb-0.5">{method.label}</p>
                <p className="font-body font-light text-white/30 text-[10px]">{method.value}</p>
              </a>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
