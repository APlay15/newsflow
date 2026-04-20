'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter, Link } from '@/i18n/navigation'
import { getPostBySlug, deletePost } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function PostPage({ params }: { params: { slug: string } }) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    getPostBySlug(params.slug)
      .then(setPost)
      .catch(() => router.push('/'))
      .finally(() => setLoading(false))
  }, [params.slug])

  async function handleDelete() {
    if (!post) return
    try {
      setDeleting(true)
      await deletePost(post.id)
      toast.success(t('toast.deleted'))
      router.push('/')
    } catch {
      toast.error(t('toast.error'))
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-28">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
          </div>
        </div>
      </div>
    </div>
  )

  if (!post) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Back */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('post.backToHome')}
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <Calendar className="w-4 h-4" />
              <span>{t('post.publishedOn')} {formatDate(post.createdAt, locale)}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/admin/edit/${post.id}`} className="btn-outline text-sm">
                <Pencil className="w-4 h-4" />
                {t('post.edit')}
              </Link>
              <button onClick={() => setShowConfirm(true)} className="btn-danger text-sm">
                <Trash2 className="w-4 h-4" />
                {t('post.delete')}
              </button>
            </div>
          </div>

          {/* Image */}
          {post.imageUrl && (
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
              <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {post.content}
          </div>

        </motion.div>
      </main>

      {/* Delete confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('post.deleteConfirm')}</h3>
            <p className="text-gray-500 text-sm mb-6">{t('post.deleteConfirmSub')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-outline flex-1">
                {t('post.cancel')}
              </button>
              <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
                {deleting ? t('status.deleting') : t('post.confirmDelete')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}