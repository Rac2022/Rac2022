import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import PostCard from '@/components/PostCard'
import { getPost, getRelatedPosts, localized } from '@/content/posts'
import { useLanguage } from '@/i18n'

function renderBody(body: string) {
  const blocks: React.ReactNode[] = []
  const lines = body.split('\n')
  let currentParagraph: string[] = []
  let key = 0

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ')
      if (text.trim()) {
        blocks.push(
          <p key={key++} className="font-body font-light text-white/60 text-base md:text-lg leading-[1.8] mb-6">
            {renderInline(text)}
          </p>
        )
      }
      currentParagraph = []
    }
  }

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-medium text-white/80">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushParagraph()
      blocks.push(
        <h2 key={key++} className="font-heading italic text-2xl md:text-3xl text-white mt-12 mb-6 leading-tight">
          {line.slice(3)}
        </h2>
      )
    } else if (line.trim() === '') {
      flushParagraph()
    } else {
      currentParagraph.push(line)
    }
  }
  flushParagraph()
  return blocks
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useLanguage()
  const rawPost = slug ? getPost(slug) : undefined

  if (!rawPost) return <Navigate to="/writing" replace />

  const post = localized(rawPost, lang)
  const related = getRelatedPosts(rawPost.slug, 3)
  const formattedDate = new Date(post.date).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-black text-white min-h-screen">
      <article className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 font-body text-sm text-white/40 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> {t.writing.allEssaysBack}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="liquid-glass rounded-full px-3 py-1 text-xs font-body font-medium text-white/50">
              {post.category}
            </span>
            <span className="font-body text-xs text-white/30">{post.readingTime}</span>
            <span className="font-body text-xs text-white/30">{formattedDate}</span>
          </div>

          <h1 className="font-heading italic text-4xl md:text-5xl lg:text-6xl text-white leading-[0.9] tracking-[-2px] mb-8">
            {post.title}
          </h1>

          <p className="font-body font-light text-white/50 text-lg md:text-xl leading-relaxed mb-12">
            {post.description}
          </p>

          <div className="w-full h-px bg-white/10 mb-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {renderBody(post.body)}
        </motion.div>

        <div className="w-full h-px bg-white/10 my-16" />

        {related.length > 0 && (
          <div>
            <h2 className="font-body font-medium text-white/30 text-xs uppercase tracking-widest mb-6">
              {t.writing.continueReading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
