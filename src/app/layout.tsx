import type { Metadata } from 'next'
import './globals.css'
import { ConvexClientProvider } from '@/components/ConvexClientProvider'

export const metadata: Metadata = {
  title: '味ばあ - おばあちゃんの味を次世代へ',
  description: '日本全国のおばあちゃんの味と郷土の食文化を次世代に残す文化継承プラットフォーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}