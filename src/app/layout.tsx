import type { Metadata } from 'next'
import { Geist, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-body',
  subsets: ['latin'],
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'InterU Honduras',
  description:
    'La red universitaria de Honduras, verificada y con identidad protegida. Tu carné nunca se publica.',
  icons: { icon: '/icon.png', apple: '/icon.png' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${jakarta.variable} min-h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-canvas text-ink">{children}</body>
    </html>
  )
}
