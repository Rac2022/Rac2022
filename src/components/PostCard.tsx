import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import { localized, type Post } from '@/content/posts'
import { useLanguage, type Lang } from '@/i18n'

export default function PostCard({ post, index = 0, lang: langProp }: { post: Post; index?: number; lang?: Lang }) {
  const { lang: ctxLang, t } = useLanguage()
  const lang = langProp ?? ctxLang
  const p = localized(post, lang)

  const formattedDate = new Date(p.date).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link to={`/writing/${post.slug}`} className="block">
      <GlassCard delay={index * 0.08} className="group hover:bg-white/[0.03] hover:scale-[1.01] transition-all duration-500 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="liquid-glass rounded-full px-2.5 py-0.5 text-[10px] font-body font-medium text-white/50">
            {p.category}
          </span>
          <span className="font-body text-[10px] text-white/25">{p.readingTime}</span>
        </div>

        <h3 className="font-heading italic text-lg md:text-xl text-white mb-3 leading-tight group-hover:text-white/90 transition-colors">
          {p.title}
        </h3>

        <p className="font-body font-light text-white/40 text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
          {p.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
          <span className="font-body text-[11px] text-white/20">{formattedDate}</span>
          <span className="flex items-center gap-1 font-body text-xs text-white/40 group-hover:text-white transition-colors">
            {t.writing.read} <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </GlassCard>
    </Link>
  )
}
