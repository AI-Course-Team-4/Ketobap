'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GPTMealsAPI, useUserStore, GPTMealRecommendationResponse } from '@ketobab/shared'
import GPTMealCard from '@/components/GPTMealCard'
import NutritionChart from '@/components/ui/NutritionChart'
import { RefreshCw, ArrowLeft, AlertCircle, Utensils, TrendingUp, Brain } from 'lucide-react'
import Link from 'next/link'

export default function RecommendationsPage() {
  const router = useRouter()
  const { preferences, hasPreferences } = useUserStore()
  
  const [recommendations, setRecommendations] = useState<GPTMealRecommendationResponse | null>(null)
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
      
      // GPT API를 사용하여 식단 추천 받기
      const result = await GPTMealsAPI.recommendMealPlan(preferences)
      
      if (!result) {
        throw new Error('GPT 서비스에서 식단 추천을 받아올 수 없습니다. 잠시 후 다시 시도해주세요.')
      }

      setRecommendations(result)
    } catch (err) {
      console.error('GPT 식단 추천 실패:', err)
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
    ? {
        carbs: parseFloat(recommendations.meal_plan.breakfast.carbs.replace(/[^\d.]/g, '')) + 
               parseFloat(recommendations.meal_plan.lunch.carbs.replace(/[^\d.]/g, '')) + 
               parseFloat(recommendations.meal_plan.dinner.carbs.replace(/[^\d.]/g, '')),
        protein: parseFloat(recommendations.meal_plan.breakfast.protein.replace(/[^\d.]/g, '')) + 
                 parseFloat(recommendations.meal_plan.lunch.protein.replace(/[^\d.]/g, '')) + 
                 parseFloat(recommendations.meal_plan.dinner.protein.replace(/[^\d.]/g, '')),
        fat: parseFloat(recommendations.meal_plan.breakfast.fat.replace(/[^\d.]/g, '')) + 
             parseFloat(recommendations.meal_plan.lunch.fat.replace(/[^\d.]/g, '')) + 
             parseFloat(recommendations.meal_plan.dinner.fat.replace(/[^\d.]/g, '')),
        calories: GPTMealsAPI.calculateCalories(recommendations.meal_plan.breakfast) +
                  GPTMealsAPI.calculateCalories(recommendations.meal_plan.lunch) +
                  GPTMealsAPI.calculateCalories(recommendations.meal_plan.dinner),
        ketoRatio: 0 // 계산은 아래에서
      }
    : null

  if (dailyNutrition) {
    const totalCalories = dailyNutrition.calories
    dailyNutrition.ketoRatio = totalCalories > 0 ? (dailyNutrition.fat * 9) / totalCalories : 0
  }

  if (!hasPreferences()) {
    return null // 리다이렉트 처리 중
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-green-500 rounded-2xl flex items-center justify-center animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🧠 GPT가 맞춤 식단을 생성하고 있어요</h2>
          <p className="text-lg text-gray-600 mb-4">당신의 선호도를 분석하여 완벽한 키토 식단을 추천해드릴게요</p>
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span>잠시만 기다려주세요...</span>
          </div>
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
        <div className="mb-6 sm:mb-8">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <Link 
              href="/preferences"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              선호도 수정
            </Link>
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-gray-900">🧠 GPT 맞춤 키토 식단</h1>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-primary flex items-center space-x-1 text-sm px-3 py-2"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>새로운 추천</span>
              </button>
            </div>
            <p className="text-sm text-gray-600">
              당신의 선호도를 바탕으로 GPT가 생성한 완벽한 키토 식단이에요
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div>
              <Link 
                href="/preferences"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                선호도 수정
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">🧠 GPT 맞춤 키토 식단</h1>
              <p className="text-lg text-gray-600 mt-2">
                당신의 선호도를 바탕으로 GPT가 생성한 완벽한 키토 식단이에요
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

            {/* GPT Meal Recommendations */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <GPTMealCard 
                mealItem={recommendations.meal_plan.breakfast} 
                mealType="breakfast"
                className="animate-slide-up"
              />
              <GPTMealCard 
                mealItem={recommendations.meal_plan.lunch} 
                mealType="lunch"
                className="animate-slide-up"
              />
              <GPTMealCard 
                mealItem={recommendations.meal_plan.dinner} 
                mealType="dinner"
                className="animate-slide-up"
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
