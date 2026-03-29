import { useParams, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import PostCard from '@/components/PostCard'
import { getPost, getRelatedPosts, localized } from '@/content/posts'
import { useLanguage } from '@/i18n'

function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return <div className="reading-progress" style={{ width: `${progress}%` }} />
}

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
          <p key={key++} className="font-body font-light text-white/60 text-[17px] md:text-lg leading-[1.85] mb-7">
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
        <h2 key={key++} className="font-heading italic text-2xl md:text-3xl text-white mt-14 mb-7 leading-tight">
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
      <ReadingProgress />

      <article className="max-w-[680px] mx-auto px-5 sm:px-6 pt-32 pb-24">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/writing"
            className="inline-flex items-center gap-2 font-body text-sm text-white/40 hover:text-white transition-colors mb-14"
          >
            <ArrowLeft className="w-4 h-4" /> {t.writing.allEssaysBack}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <span className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body font-medium text-white/50">
              {post.category}
            </span>
            <span className="font-body text-[11px] text-white/30">{post.readingTime}</span>
            <span className="font-body text-[11px] text-white/25">{formattedDate}</span>
          </div>

          <h1 className="font-heading italic text-[2.5rem] md:text-5xl lg:text-[3.5rem] text-white leading-[0.92] tracking-[-2px] mb-8">
            {post.title}
          </h1>

          <p className="font-body font-light text-white/50 text-lg md:text-xl leading-[1.6] mb-14">
            {post.description}
          </p>

          <div className="w-full h-px bg-white/10 mb-14" />
        </motion.header>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="article-body"
        >
          {renderBody(post.body)}
        </motion.div>

        {/* End divider */}
        <div className="flex items-center gap-4 my-20">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-body text-[10px] text-white/20 uppercase tracking-widest">End</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-body font-medium text-white/30 text-xs uppercase tracking-widest mb-8">
              {t.writing.continueReading}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {related.slice(0, 2).map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
