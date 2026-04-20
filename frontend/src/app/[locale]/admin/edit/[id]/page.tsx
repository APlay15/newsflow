
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { getPosts, updatePost } from '@/lib/api'
import type { Post, CreatePostInput } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PostForm from '@/components/news/PostForm'
import toast from 'react-hot-toast'

export default function EditPostPage({ params }: { params: { id: string } }) {
  const t = useTranslations()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    getPosts({ limit: 50 })
      .then(data => {
        const found = data.posts.find(p => p.id === params.id)
        if (found) setPost(found)
        else router.push('/admin')
      })
      .finally(() => setFetching(false))
  }, [params.id])

  async function handleSubmit(data: CreatePostInput) {
    if (!post) return
    try {
      setLoading(true)
      await updatePost(post.id, data)
      toast.success(t('toast.updated'))
      router.push('/admin')
    } catch {
      toast.error(t('toast.error'))
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-28">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('admin.title')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('form.editTitle')}</h1>
          <div className="card p-6">
            {post && <PostForm initial={post} onSubmit={handleSubmit} loading={loading} />}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}