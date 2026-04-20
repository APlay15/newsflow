'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { createPost } from '@/lib/api'
import type { CreatePostInput } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PostForm from '@/components/news/PostForm'
import toast from 'react-hot-toast'

export default function NewPostPage() {
  const t = useTranslations()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data: CreatePostInput) {
    try {
      setLoading(true)
      await createPost(data)
      toast.success(t('toast.created'))
      router.push('/admin')
    } catch {
      toast.error(t('toast.error'))
      setLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('form.createTitle')}</h1>
          <div className="card p-6">
            <PostForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}