import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'
import { routing } from '../../i18n/routing'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'NewsFlow', template: '%s | NewsFlow' },
  description: 'Modern news management platform',
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#111',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: { primary: '#f97316', secondary: '#fff' },
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}