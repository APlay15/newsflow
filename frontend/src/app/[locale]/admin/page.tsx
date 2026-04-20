'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/navigation'
import { getPosts, deletePost } from '@/lib/api'
import type { Post } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const t = useTranslations()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function fetchPosts() {
    try {
      const data = await getPosts({ limit: 50 })
      setPosts(data.posts)
    } catch {
      toast.error(t('toast.error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  async function handleDelete(id: string) {
    try {
      setDeletingId(id)
      await deletePost(id)
      toast.success(t('toast.deleted'))
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch {
      toast.error(t('toast.error'))
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
            <p className="text-gray-500 mt-1">{t('admin.subtitle')}</p>
          </div>
          <Link href="/admin/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            {t('admin.newPost')}
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5 mb-8 flex items-center gap-4 w-fit">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('admin.totalPosts')}</p>
            <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
          </div>
        </motion.div>

        {/* Posts list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card h-20 animate-pulse bg-gray-200" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20">
            <p className="text-4xl mb-4">📝</p>
            <h3 className="text-xl font-semibold text-gray-700">{t('admin.noPostsYet')}</h3>
            <p className="text-gray-400 mt-2 mb-6">{t('admin.createFirst')}</p>
            <Link href="/admin/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              {t('admin.newPost')}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, i) => (
              <motion.div key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-4 flex items-center gap-4">

                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {post.imageUrl ? (
                    <Image src={post.imageUrl} alt={post.title} width={64} height={64}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{post.content.slice(0, 80)}...</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/edit/${post.id}`} className="btn-outline text-xs px-3 py-2">
                    <Pencil className="w-3.5 h-3.5" />
                    {t('post.edit')}
                  </Link>
                  <button onClick={() => setConfirmId(post.id)}
                    className="btn-danger text-xs px-3 py-2">
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('post.delete')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Delete confirm modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('post.deleteConfirm')}</h3>
            <p className="text-gray-500 text-sm mb-6">{t('post.deleteConfirmSub')}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="btn-outline flex-1">
                {t('post.cancel')}
              </button>
              <button onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                className="btn-danger flex-1">
                {deletingId === confirmId ? t('status.deleting') : t('post.confirmDelete')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  )
}