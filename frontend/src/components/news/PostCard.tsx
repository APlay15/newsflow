'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatDate, truncate } from '@/lib/utils'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  index: number
}

export default function PostCard({ post, index }: PostCardProps) {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="card group cursor-pointer"
    >
      <Link href={`/news/${post.slug}`}>
        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-orange-50 to-orange-100">
              📰
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(post.createdAt, locale)}</span>
          </div>

          <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
            {post.title}
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {truncate(post.content, 120)}
          </p>

          <div className="flex items-center gap-1 mt-4 text-orange-500 text-sm font-medium">
            {t('home.readMore')}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}