'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FoodsAPI, NutritionUtils, useUserStore, Food, MealRecommendation } from '@ketobab/shared'
import FoodCard from '@/components/FoodCard'
import NutritionChart from '@/components/ui/NutritionChart'
import { RefreshCw, ArrowLeft, AlertCircle, Utensils, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function RecommendationsPage() {
  const router = useRouter()
  const { preferences, hasPreferences } = useUserStore()
  
  const [recommendations, setRecommendations] = useState<MealRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 선호도가 없으면 선호도 페이지로 리다이렉트
  useEffect(() => {
    if (!hasPreferences()) {
      router.push('/preferences')
    }
  }, [hasPreferences, router])

  const generateRecommendations = async () => {
    try {
      setError(null)
      
      // 모든 음식 데이터 가져오기
      const allFoods = await FoodsAPI.getAllFoods()
      
      if (allFoods.length === 0) {
        throw new Error('음식 데이터가 없습니다')
      }

      // 사용자 선호도에 따라 필터링
      const filteredFoods = NutritionUtils.filterFoodsByPreferences(allFoods, preferences)
      
      if (filteredFoods.length < 3) {
        throw new Error('조건에 맞는 음식이 충분하지 않습니다. 선호도를 조정해보세요.')
      }

      // 키토 점수가 높은 음식들을 우선 선택
      const sortedFoods = filteredFoods.sort((a, b) => {
        // 키토 점수 + 사용자 선호도 점수
        const aScore = a.keto_score + NutritionUtils.calculatePreferenceScore(a, preferences)
        const bScore = b.keto_score + NutritionUtils.calculatePreferenceScore(b, preferences)
        return bScore - aScore
      })

      // 각 끼니별로 다른 음식 추천 (중복 방지)
      const usedFoodIds = new Set<number>()
      const mealTypes: (keyof MealRecommendation)[] = ['breakfast', 'lunch', 'dinner']
      const recommendedMeals: Partial<MealRecommendation> = {}

      for (const mealType of mealTypes) {
        const availableFoods = sortedFoods.filter(food => !usedFoodIds.has(food.id))
        
        if (availableFoods.length === 0) {
          // 사용 가능한 음식이 없으면 전체에서 랜덤 선택
          const randomFood = sortedFoods[Math.floor(Math.random() * sortedFoods.length)]
          recommendedMeals[mealType] = randomFood
        } else {
          // 키토 점수와 선호도를 고려하여 상위 5개 중 랜덤 선택
          const topFoods = availableFoods.slice(0, Math.min(5, availableFoods.length))
          const selectedFood = topFoods[Math.floor(Math.random() * topFoods.length)]
          recommendedMeals[mealType] = selectedFood
          usedFoodIds.add(selectedFood.id)
        }
      }

      setRecommendations(recommendedMeals as MealRecommendation)
    } catch (err) {
      console.error('추천 생성 실패:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    generateRecommendations()
  }

  useEffect(() => {
    if (hasPreferences()) {
      generateRecommendations()
    }
  }, [hasPreferences])

  // 일일 총 영양 정보 계산
  const dailyNutrition = recommendations 
    ? NutritionUtils.calculateDailyNutrition([
        recommendations.breakfast,
        recommendations.lunch,
        recommendations.dinner
      ])
    : null

  if (!hasPreferences()) {
    return null // 리다이렉트 처리 중
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">AI가 맞춤 식단을 분석하고 있어요...</h2>
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
            <h2 className="text-xl font-semibold text-red-700 mb-2">추천 생성 실패</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRefresh}
                className="btn-primary"
              >
                다시 시도
              </button>
              <Link href="/preferences" className="btn-secondary">
                선호도 수정
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href="/preferences"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              선호도 수정
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">오늘의 추천 키토 식단</h1>
            <p className="text-lg text-gray-600 mt-2">
              당신의 선호도에 맞춰 AI가 추천한 완벽한 키토 식단이에요
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>새로운 추천</span>
          </button>
        </div>

        {recommendations && (
          <>
            {/* Daily Overview */}
            {dailyNutrition && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-green-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">일일 영양 분석</h2>
                    <p className="text-sm text-gray-600">하루 총 영양소 및 키토 비율</p>
                  </div>
                </div>
                
                <NutritionChart nutrition={dailyNutrition} />
              </div>
            )}

            {/* Meal Recommendations */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <FoodCard 
                food={recommendations.breakfast} 
                mealType="breakfast"
                className="animate-slide-up"
              />
              <FoodCard 
                food={recommendations.lunch} 
                mealType="lunch"
                className="animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              />
              <FoodCard 
                food={recommendations.dinner} 
                mealType="dinner"
                className="animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              />
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-8 text-center">
              <Utensils className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                식단 유지가 어려우신가요?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                강남 지역의 키토 친화적인 음식점에서<br />
                맛있는 대안을 찾아보세요!
              </p>
              <Link 
                href="/restaurants"
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>강남 키토 맛집 보기</span>
                <Utensils className="w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
