import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import BlurText from '@/components/BlurText'
import SectionBadge from '@/components/SectionBadge'
import PostCard from '@/components/PostCard'
import { getRecentPosts } from '@/content/posts'
import { useLanguage } from '@/i18n'

export default function WritingSection() {
  const { t, lang } = useLanguage()
  const recentPosts = getRecentPosts(3)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {recentPosts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} lang={lang} />
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
