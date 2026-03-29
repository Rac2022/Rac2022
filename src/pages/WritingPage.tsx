import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import BlurText from '@/components/BlurText'
import PostCard from '@/components/PostCard'
import { posts, getFeaturedPosts, localized } from '@/content/posts'
import { useLanguage } from '@/i18n'

export default function WritingPage() {
  const { t, lang } = useLanguage()
  const featured = getFeaturedPosts()
  const heroPost = featured[0] ? localized(featured[0], lang) : null
  const remaining = posts.filter((p) => p.slug !== featured[0]?.slug)

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-white/40 hover:text-white transition-colors mb-16"
          >
            <ArrowLeft className="w-4 h-4" /> {t.writing.backHome}
          </Link>
        </motion.div>

        {/* Page header */}
        <BlurText
          text={t.writing.badge}
          as="h1"
          className="text-5xl md:text-7xl font-heading italic text-white leading-[0.85] tracking-[-3px] mb-5"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-body font-light text-white/40 text-base md:text-lg leading-relaxed mb-20 max-w-2xl"
        >
          {t.writing.pageSub}
        </motion.p>

        {/* Hero featured post */}
        {heroPost && featured[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <Link to={`/writing/${featured[0].slug}`} className="block group">
              <div className="liquid-glass rounded-2xl p-8 md:p-12 hover:bg-white/[0.02] transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <span className="liquid-glass rounded-full px-3 py-1 text-[10px] font-body font-medium text-white/50 uppercase tracking-wider">
                    {t.writing.featured}
                  </span>
                  <span className="font-body text-[11px] text-white/30">{heroPost.category}</span>
                  <span className="font-body text-[11px] text-white/25">{heroPost.readingTime}</span>
                </div>

                <h2 className="font-heading italic text-3xl md:text-4xl lg:text-5xl text-white leading-[0.9] tracking-[-1px] mb-5 group-hover:text-white/90 transition-colors">
                  {heroPost.title}
                </h2>

                <p className="font-body font-light text-white/45 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
                  {heroPost.description}
                </p>

                <span className="inline-flex items-center gap-2 font-body text-sm text-white/50 group-hover:text-white transition-colors">
                  {t.writing.read} <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.06] mb-12" />

        {/* All essays */}
        <h2 className="font-body font-medium text-white/30 text-xs uppercase tracking-widest mb-8">
          {t.writing.allEssays}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {remaining.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  )
}
