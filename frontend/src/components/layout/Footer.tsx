import { Newspaper } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <Newspaper className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">
            News<span className="text-orange-500">Flow</span>
          </span>
        </Link>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} NewsFlow. Built with Next.js & Express.
        </p>
      </div>
    </footer>
  )
}