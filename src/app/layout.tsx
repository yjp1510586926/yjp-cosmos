import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YJP区块链浏览器',
  description: '查看区块、交易和账户信息',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

