'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { getPosts } from '@/lib/api'
import type { Post } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PostCard from '@/components/news/PostCard'

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations()
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function fetchPosts(searchTerm = '', pageNum = 1) {
    try {
      setLoading(true)
      const data = await getPosts({ search: searchTerm, page: pageNum, limit: 6 })
      if (pageNum === 1) {
        setPosts(data.posts)
      } else {
        setPosts(prev => [...prev, ...data.posts])
      }
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchPosts(search, 1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Forzar re-render cuando cambia el locale
  const key = locale
  return (
    <div key={key} className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-14 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('home.hero')}
          </h1>
          <p className="text-gray-500 text-lg mb-8">{t('home.heroSub')}</p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="input-base pl-11"
            />
          </div>
        </motion.div>
      </section>

      {/* Posts grid */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        {loading && posts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-80 animate-pulse bg-gray-200" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-4">📭</p>
            <h3 className="text-xl font-semibold text-gray-700">{t('home.noResults')}</h3>
            <p className="text-gray-400 mt-2">{t('home.noResultsSub')}</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>

            {page < totalPages && (
              <div className="text-center mt-10">
                <button
                  onClick={() => { setPage(p => p + 1); fetchPosts(search, page + 1) }}
                  className="btn-outline"
                  disabled={loading}
                >
                  {loading ? t('status.loading') : t('home.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}