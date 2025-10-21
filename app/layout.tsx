import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'COCS - Creating warmth and comfort through thoughtful design',
  description: 'Rather than simply designing products, we make about designing the space itself that provides warmth and comfort just by placing COCS\'s product.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
