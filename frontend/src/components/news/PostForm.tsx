'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Upload, X, Link2 } from 'lucide-react'
import Image from 'next/image'
import type { Post, CreatePostInput } from '@/types'

interface PostFormProps {
  initial?: Post
  onSubmit: (data: CreatePostInput) => Promise<void>
  loading: boolean
}

export default function PostForm({ initial, onSubmit, loading }: PostFormProps) {
  const t = useTranslations()
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initial?.imageUrl || null)
  const [useUrl, setUseUrl] = useState(!initial?.imageUrl?.includes('cloudinary'))
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!title.trim() || title.length < 3) e.title = t('form.titleMin')
    if (!content.trim() || content.length < 10) e.content = t('form.contentMin')
    if (useUrl && imageUrl && !imageUrl.startsWith('http')) e.imageUrl = t('form.invalidUrl')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit({
      title,
      content,
      ...(imageFile ? { image: imageFile } : {}),
      ...(useUrl && imageUrl ? { imageUrl } : {}),
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('form.titleLabel')} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={t('form.titlePlaceholder')}
          className="input-base"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('form.contentLabel')} <span className="text-red-400">*</span>
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t('form.contentPlaceholder')}
          rows={8}
          className="input-base resize-none"
        />
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('form.imageLabel')}
        </label>

        <div className="flex gap-2 mb-3">
          <button type="button" onClick={() => setUseUrl(false)}
            className={`btn text-xs px-3 py-1.5 ${!useUrl ? 'btn-primary' : 'btn-outline'}`}>
            <Upload className="w-3.5 h-3.5" />
            {t('form.imageUploadLabel')}
          </button>
          <button type="button" onClick={() => setUseUrl(true)}
            className={`btn text-xs px-3 py-1.5 ${useUrl ? 'btn-primary' : 'btn-outline'}`}>
            <Link2 className="w-3.5 h-3.5" />
            {t('form.imageUrlLabel')}
          </button>
        </div>

        {useUrl ? (
          <input type="text" value={imageUrl} onChange={e => { setImageUrl(e.target.value); setPreview(e.target.value) }}
            placeholder={t('form.imageUrlPlaceholder')} className="input-base" />
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-sm text-gray-400">{t('form.imageUploadLabel')}</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        )}

        {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}

        {/* Preview */}
        {preview && (
          <div className="relative mt-3 h-40 rounded-xl overflow-hidden">
            <Image src={preview} alt="preview" fill className="object-cover" />
            <button type="button" onClick={() => { setPreview(null); setImageFile(null); setImageUrl('') }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? t('status.saving') : initial ? t('form.submitEdit') : t('form.submit')}
      </button>
    </motion.form>
  )
}