import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'KetoBab - AI 키토 식단 추천',
  description: '개인 맞춤형 키토 식단과 강남 키토 친화 음식점을 AI로 추천해드립니다',
  keywords: '키토, 다이어트, 식단, 추천, AI, 강남, 음식점',
  authors: [{ name: 'KetoBab Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0284c7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🥑</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gradient">KetoBab</h1>
                    <p className="text-sm text-gray-600">AI 키토 식단 추천</p>
                  </div>
                </Link>
                <nav className="hidden md:flex space-x-6">
                  <a href="/" className="text-gray-600 hover:text-primary-600 font-medium">홈</a>
                  <a href="/preferences" className="text-gray-600 hover:text-primary-600 font-medium">선호도 설정</a>
                  <a href="/recommendations" className="text-gray-600 hover:text-primary-600 font-medium">식단 추천</a>
                  <a href="/restaurants" className="text-gray-600 hover:text-primary-600 font-medium">외식 추천</a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-gray-400">
                  © 2025 KetoBab. AI 기반 키토 식단 추천 서비스
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  건강한 키토 라이프를 위한 똑똑한 선택
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
