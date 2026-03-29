import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'

const HomePage = lazy(() => import('@/pages/HomePage'))
const WritingPage = lazy(() => import('@/pages/WritingPage'))
const ArticlePage = lazy(() => import('@/pages/ArticlePage'))
const Footer = lazy(() => import('@/sections/Footer'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="bg-black text-white overflow-visible min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/writing/:slug" element={<ArticlePage />} />
          </Routes>
        </Suspense>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  )
}
