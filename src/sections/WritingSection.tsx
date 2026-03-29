import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import GlassCard from '@/components/GlassCard'
import PostCard from '@/components/PostCard'
import { getRecentPosts, localized } from '@/content/posts'
import { useLanguage } from '@/i18n'

export default function WritingSection() {
  const { t, lang } = useLanguage()
  const recentPosts = getRecentPosts(3)
  const hero = recentPosts[0] ? localized(recentPosts[0], lang) : null
  const secondary = recentPosts.slice(1)

  return (
    <section id="writing" className="relative py-28 md:py-40 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionBadge text={t.writing.badge} />
          <BlurText
            text={t.writing.heading}
            as="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white leading-[0.85] tracking-[-2px] justify-center mb-6"
          />
          <p className="max-w-2xl mx-auto font-body font-light text-white/40 text-sm leading-relaxed">
            {t.writing.sub}
          </p>
        </div>

        {/* Featured essay */}
        {hero && recentPosts[0] && (
          <GlassCard delay={0} className="mb-5 group hover:bg-white/[0.02] transition-all duration-500">
            <Link to={`/writing/${recentPosts[0].slug}`} className="block p-2 md:p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="liquid-glass rounded-full px-2.5 py-0.5 text-[10px] font-body font-medium text-white/50 uppercase tracking-wider">
                  {t.writing.featured}
                </span>
                <span className="font-body text-[10px] text-white/30">{hero.category}</span>
                <span className="font-body text-[10px] text-white/25">{hero.readingTime}</span>
              </div>

              <h3 className="font-heading italic text-2xl md:text-3xl text-white leading-tight mb-3 group-hover:text-white/90 transition-colors">
                {hero.title}
              </h3>

              <p className="font-body font-light text-white/40 text-sm md:text-base leading-relaxed max-w-3xl mb-4">
                {hero.description}
              </p>

              <span className="inline-flex items-center gap-1.5 font-body text-xs text-white/50 group-hover:text-white transition-colors">
                {t.writing.read} <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </GlassCard>
        )}

        {/* Secondary posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {secondary.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i + 1} lang={lang} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 liquid-glass-strong px-6 py-3 rounded-full font-body font-medium text-sm text-white hover:bg-white/10 transition-colors"
          >
            {t.writing.allEssays} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
