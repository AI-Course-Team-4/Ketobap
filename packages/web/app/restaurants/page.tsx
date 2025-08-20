'use client'

import { useEffect, useState } from 'react'
import { RestaurantsAPI, useUserStore, RestaurantMenu } from '@ketobab/shared'
import RestaurantCard from '@/components/RestaurantCard'
import { MapPin, Filter, RefreshCw, AlertCircle, Utensils, Star } from 'lucide-react'
import Link from 'next/link'

export default function RestaurantsPage() {
  const { preferences, hasPreferences } = useUserStore()
  
  const [restaurants, setRestaurants] = useState<RestaurantMenu[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<RestaurantMenu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [minKetoScore, setMinKetoScore] = useState(60)

  const loadRestaurants = async () => {
    try {
      setError(null)
      
      // 키토 점수가 높은 메뉴 가져오기
      const allMenus = await RestaurantsAPI.getTopKetoMenus(20)
      
      if (allMenus.length === 0) {
        throw new Error('음식점 데이터가 없습니다')
      }

      let filteredMenus = allMenus

      // 사용자 선호도가 있으면 필터링 적용
      if (hasPreferences()) {
        const excludeKeywords = [
          ...preferences.dislikedFoods,
          ...preferences.allergies,
          ...(preferences.customDisliked ? preferences.customDisliked.split(',').map(s => s.trim()) : []),
          ...(preferences.customAllergies ? preferences.customAllergies.split(',').map(s => s.trim()) : [])
        ]

        if (excludeKeywords.length > 0) {
          filteredMenus = RestaurantsAPI.filterMenusByUserPreferences(allMenus, excludeKeywords)
        }
      }

      setRestaurants(filteredMenus)
      applyKetoScoreFilter(filteredMenus, minKetoScore)
    } catch (err) {
      console.error('음식점 로딩 실패:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const applyKetoScoreFilter = (menus: RestaurantMenu[], scoreThreshold: number) => {
    const filtered = menus.filter(menu => menu.keto_score >= scoreThreshold)
    setFilteredRestaurants(filtered)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    loadRestaurants()
  }

  const handleKetoScoreChange = (score: number) => {
    setMinKetoScore(score)
    applyKetoScoreFilter(restaurants, score)
  }

  useEffect(() => {
    loadRestaurants()
  }, [])

  useEffect(() => {
    if (restaurants.length > 0) {
      applyKetoScoreFilter(restaurants, minKetoScore)
    }
  }, [minKetoScore, restaurants])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">강남 키토 맛집을 찾고 있어요...</h2>
          <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">데이터 로딩 실패</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="btn-primary"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">강남 키토 맛집</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            키토 다이어트 중에도 걱정 없이 즐길 수 있는<br />
            강남 지역의 키토 친화적인 음식점과 메뉴를 추천해드려요
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
            <p className="text-sm text-gray-600">총 키토 메뉴</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{filteredRestaurants.length}</p>
            <p className="text-sm text-gray-600">필터링된 메뉴</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">강남구</p>
            <p className="text-sm text-gray-600">서비스 지역</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">필터</h3>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-secondary flex items-center space-x-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Keto Score Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                최소 키토 점수: {minKetoScore}점
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={minKetoScore}
                onChange={(e) => handleKetoScoreChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            {/* User Preferences Info */}
            <div>
              {hasPreferences() ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-700 mb-1">✅ 개인 선호도 적용됨</p>
                  <p className="text-xs text-green-600">
                    알레르기와 비선호 음식이 자동으로 제외되었습니다
                  </p>
                  <Link 
                    href="/preferences" 
                    className="text-xs text-green-600 hover:text-green-700 underline mt-1 inline-block"
                  >
                    선호도 수정하기
                  </Link>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-700 mb-1">💡 더 정확한 추천을 원하신다면?</p>
                  <p className="text-xs text-blue-600 mb-2">
                    선호도를 설정하면 알레르기와 비선호 음식을 제외한 맞춤 추천을 받을 수 있어요
                  </p>
                  <Link 
                    href="/preferences" 
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    선호도 설정하기
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Restaurant Cards */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((menu, index) => (
              <RestaurantCard 
                key={menu.id} 
                menu={menu}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              조건에 맞는 음식점이 없어요
            </h3>
            <p className="text-gray-500 mb-6">
              키토 점수 기준을 조정하거나 선호도를 변경해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handleKetoScoreChange(Math.max(0, minKetoScore - 20))}
                className="btn-secondary"
              >
                키토 점수 기준 낮추기
              </button>
              <Link href="/preferences" className="btn-primary">
                선호도 수정하기
              </Link>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              키토 외식 가이드
            </h3>
            <p className="text-gray-600">
              외식할 때 키토 다이어트를 유지하는 방법
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🥗</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">탄수화물 대체</h4>
              <p className="text-sm text-gray-600">
                밥, 면, 빵 대신 샐러드나 채소로 대체 요청하세요
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🧈</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">건강한 지방</h4>
              <p className="text-sm text-gray-600">
                올리브오일, 아보카도, 견과류가 포함된 메뉴를 선택하세요
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">요청사항</h4>
              <p className="text-sm text-gray-600">
                "키토 다이어트 중"이라고 말하고 조리법을 문의해보세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
