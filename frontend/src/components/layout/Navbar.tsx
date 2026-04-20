'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useRouter, Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, Plus, Globe, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Removes the locale prefix from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  const toggleLocale = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es'
    router.replace(pathnameWithoutLocale, { locale: nextLocale })
  }

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm' : 'bg-white/70 backdrop-blur-sm'
    )}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: -10 }}
            className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-white" />
          </motion.div>
          <span className="font-bold text-xl text-gray-900">
            News<span className="text-orange-500">Flow</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '/' as const, label: t('home') },
            { href: '/admin' as const, label: t('admin') }
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggleLocale}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Globe className="w-4 h-4" />
            <span>{locale === 'es' ? 'EN' : 'ES'}</span>
          </button>
          <Link href="/admin/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            {t('newPost')}
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-gray-200 px-4 pb-4">
            <div className="flex flex-col gap-1 pt-2">
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                {t('home')}
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                {t('admin')}
              </Link>
              <button onClick={() => { toggleLocale(); setMobileOpen(false) }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-left w-full">
                <Globe className="w-4 h-4" />
                {locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              </button>
              <Link href="/admin/new" onClick={() => setMobileOpen(false)} className="btn-primary mt-2">
                <Plus className="w-4 h-4" />
                {t('newPost')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}