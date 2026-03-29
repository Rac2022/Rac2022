import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import BlurText from '@/components/BlurText'
import PostCard from '@/components/PostCard'
import { posts, getFeaturedPosts } from '@/content/posts'

export default function WritingPage() {
  const featured = getFeaturedPosts()
  const remaining = posts.filter((p) => !p.featured)

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-white/40 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> Back home
          </Link>
        </motion.div>

        <BlurText
          text="Writing"
          as="h1"
          className="text-5xl md:text-7xl font-heading italic text-white leading-[0.85] tracking-[-3px] mb-4"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-body font-light text-white/40 text-base md:text-lg leading-relaxed mb-16 max-w-2xl"
        >
          On AI, systems, human judgment, and the decisions that shape what gets built next.
        </motion.p>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-16">
            <h2 className="font-body font-medium text-white/30 text-xs uppercase tracking-widest mb-6">
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* All essays */}
        <div>
          <h2 className="font-body font-medium text-white/30 text-xs uppercase tracking-widest mb-6">
            All Essays
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remaining.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
