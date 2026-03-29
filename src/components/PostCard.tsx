import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import type { Post } from '@/content/posts'

export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <GlassCard delay={index * 0.08} className="group hover:bg-white/[0.03] transition-all duration-500 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <span className="liquid-glass rounded-full px-2.5 py-0.5 text-[10px] font-body font-medium text-white/50">
          {post.category}
        </span>
        <span className="font-body text-[10px] text-white/30">{post.readingTime}</span>
      </div>

      <h3 className="font-heading italic text-lg md:text-xl text-white mb-3 leading-tight">
        {post.title}
      </h3>

      <p className="font-body font-light text-white/40 text-sm leading-relaxed mb-5 flex-1">
        {post.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="font-body text-[11px] text-white/25">{formattedDate}</span>
        <Link
          to={`/writing/${post.slug}`}
          className="flex items-center gap-1 font-body text-xs text-white/50 hover:text-white transition-colors"
        >
          Read <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </GlassCard>
  )
}
