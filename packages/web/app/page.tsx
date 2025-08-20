'use client'

import Link from 'next/link'
import { ChevronRight, Utensils, MapPin, Brain, Star } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary-600" />,
      title: 'AI 맞춤 추천',
      description: '개인의 선호도와 알레르기를 고려한 똑똑한 키토 식단 추천'
    },
    {
      icon: <Utensils className="w-8 h-8 text-green-600" />,
      title: '영양 분석',
      description: '탄단지 비율과 키토 점수를 실시간으로 분석하여 제공'
    },
    {
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      title: '외식 가이드',
      description: '강남 지역 키토 친화적인 음식점과 메뉴 추천'
    },
    {
      icon: <Star className="w-8 h-8 text-purple-600" />,
      title: '간편한 사용',
      description: '회원가입 없이 바로 사용 가능한 직관적인 인터페이스'
    }
  ]

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              🚀 AI 기반 키토 다이어트 도우미
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              당신만의{' '}
              <span className="text-gradient">키토 식단</span>을<br />
              AI가 추천해드려요
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              개인 선호도, 알레르기, 비선호 식품을 고려하여<br />
              완벽한 키토 식단과 강남 맛집을 추천받으세요
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Link 
              href="/preferences" 
              className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-glow"
            >
              <span>식단 추천 받기</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/restaurants" 
              className="group bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 border-2 border-gray-200 hover:border-primary-300"
            >
              <MapPin className="w-5 h-5" />
              <span>강남 맛집 보기</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 KetoBab을 선택해야 할까요?
            </h2>
            <p className="text-lg text-gray-600">
              AI 기술과 영양학을 결합한 스마트한 키토 다이어트 솔루션
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 border border-gray-100"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              어떻게 작동하나요?
            </h2>
            <p className="text-lg text-gray-600">
              3단계로 간단하게 시작하세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '선호도 입력',
                description: '좋아하는 음식, 싫어하는 음식, 알레르기 정보를 입력해주세요',
                color: 'from-blue-500 to-purple-600'
              },
              {
                step: '02',
                title: 'AI 분석',
                description: 'AI가 당신의 조건에 맞는 키토 친화적인 식단을 분석합니다',
                color: 'from-green-500 to-teal-600'
              },
              {
                step: '03',
                title: '추천 완료',
                description: '완벽한 키토 식단과 대체 외식 옵션을 추천받으세요',
                color: 'from-orange-500 to-red-600'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-xl">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-8">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 바로 시작해보세요!
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            회원가입 없이 바로 사용 가능한 AI 키토 식단 추천
          </p>
          <Link 
            href="/preferences"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>무료로 시작하기</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
