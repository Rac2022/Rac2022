import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'

const projects = [
  {
    title: 'Territory Intelligence Command Center',
    desc: 'A centralized dashboard for mapping territories, tracking pipeline signals, and prioritizing outreach.',
    tags: ['Dashboard', 'Strategy', 'Data'],
    status: 'In Progress',
  },
  {
    title: 'AI-Assisted Sales Workflow System',
    desc: 'Prompt chains and automated pipelines that turn CRM data into actionable next steps and insights.',
    tags: ['AI', 'Automation', 'Sales'],
    status: 'In Progress',
  },
  {
    title: 'Personal Brand & Creative Identity',
    desc: 'This site and the broader system behind it. Building a digital presence that reflects real thinking.',
    tags: ['Web', 'Brand', 'Design'],
    status: 'Live Concept',
  },
  {
    title: 'AI-Driven Decision Dashboards',
    desc: 'Visual tools that surface patterns, summarize complexity, and help teams make faster calls.',
    tags: ['AI', 'Dashboards', 'Tools'],
    status: 'Exploring',
  },
  {
    title: 'Future-Facing Digital Experiments',
    desc: 'Explorations at the edge. AI agents, creative tools, and products designed for what comes next.',
    tags: ['Experiments', 'AI', 'Products'],
    status: 'Exploring',
  },
]

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionBadge text="Projects" />
          <BlurText
            text="Things I'm building and exploring."
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <GlassCard
              key={i}
              delay={i * 0.08}
              className="group hover:bg-white/[0.03] transition-all duration-500 flex flex-col"
            >
              {/* Mock screenshot placeholder */}
              <div className="liquid-glass rounded-xl aspect-[16/9] mb-4 flex items-center justify-center">
                <span className="font-body text-[10px] text-white/15 uppercase tracking-widest">Preview</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="liquid-glass rounded-full px-2.5 py-0.5 text-[10px] font-body font-medium text-white/50">
                  {project.status}
                </span>
              </div>

              <h3 className="font-heading italic text-lg text-white mb-2 leading-tight">{project.title}</h3>
              <p className="font-body font-light text-white/40 text-xs leading-relaxed mb-4 flex-1">{project.desc}</p>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-body text-white/30">
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
