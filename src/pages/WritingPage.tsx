import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import BlurText from '@/components/BlurText'
import PostCard from '@/components/PostCard'
import { posts, getFeaturedPosts } from '@/content/posts'
import { useLanguage } from '@/i18n'

export default function WritingPage() {
  const { t, lang } = useLanguage()
  const featured = getFeaturedPosts()
  const remaining = posts.filter((p) => !p.featured)

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-white/40 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> {t.writing.backHome}
          </Link>
        </motion.div>

        <BlurText
          text={t.writing.badge}
          as="h1"
          className="text-5xl md:text-7xl font-heading italic text-white leading-[0.85] tracking-[-3px] mb-4"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-body font-light text-white/40 text-base md:text-lg leading-relaxed mb-16 max-w-2xl"
        >
          {t.writing.pageSub}
        </motion.p>

        {featured.length > 0 && (
          <div className="mb-16">
            <h2 className="font-body font-medium text-white/30 text-xs uppercase tracking-widest mb-6">
              {t.writing.featured}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} lang={lang} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-body font-medium text-white/30 text-xs uppercase tracking-widest mb-6">
            {t.writing.allEssays}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remaining.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
