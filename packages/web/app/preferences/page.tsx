'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@ketobab/shared'
import { UserPreferences } from '@ketobab/shared'
import MultiSelect from '@/components/ui/MultiSelect'
import { ChevronRight, Info, Heart, X, AlertTriangle } from 'lucide-react'

const FOOD_OPTIONS = [
  // 키토 친화적 음식
  { value: '아보카도', label: '🥑 아보카도' },
  { value: '연어', label: '🐟 연어' },
  { value: '치즈', label: '🧀 치즈' },
  { value: '계란', label: '🥚 계란' },
  { value: '견과류', label: '🥜 견과류' },
  { value: '올리브오일', label: '🫒 올리브오일' },
  { value: '닭가슴살', label: '🐔 닭가슴살' },
  { value: '브로콜리', label: '🥦 브로콜리' },
  { value: '시금치', label: '🌿 시금치' },
  { value: '버터', label: '🧈 버터' },
  { value: '베이컨', label: '🥓 베이컨' },
  { value: '새우', label: '🦐 새우' },
  // 기타 음식
  { value: '토마토', label: '🍅 토마토' },
  { value: '양상추', label: '🥬 양상추' },
  { value: '오이', label: '🥒 오이' },
  { value: '기타', label: '➕ 기타 (직접 입력)' }
]

const ALLERGY_OPTIONS = [
  { value: '견과류', label: '🥜 견과류' },
  { value: '유제품', label: '🥛 유제품' },
  { value: '해산물', label: '🦐 해산물' },
  { value: '계란', label: '🥚 계란' },
  { value: '콩', label: '🫘 콩류' },
  { value: '글루텐', label: '🌾 글루텐' },
  { value: '기타', label: '➕ 기타 (직접 입력)' }
]

export default function PreferencesPage() {
  const router = useRouter()
  const { preferences, setPreferences } = useUserStore()
  
  const [formData, setFormData] = useState<UserPreferences>(preferences)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // 사용자 선호도 저장
      setPreferences(formData)
      
      // 식단 추천 페이지로 이동
      router.push('/recommendations')
    } catch (error) {
      console.error('선호도 저장 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasBasicPreferences = () => {
    return formData.preferredFoods.length > 0 || 
           formData.dislikedFoods.length > 0 || 
           formData.allergies.length > 0 ||
           formData.customPreferred ||
           formData.customDisliked ||
           formData.customAllergies
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            맞춤 식단을 위한 선호도 설정
          </h1>
          <p className="text-lg text-gray-600">
            당신의 취향에 맞는 완벽한 키토 식단을 추천해드릴게요
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>1단계: 선호도 설정</span>
            <span>2단계: 식단 추천</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full w-1/2 transition-all duration-500"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 선호 음식 */}
          <div className="card animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">선호하는 음식</h2>
                <p className="text-sm text-gray-600">자주 드시거나 좋아하는 음식을 선택해주세요</p>
              </div>
            </div>
            
            <MultiSelect
              options={FOOD_OPTIONS}
              value={formData.preferredFoods}
              onChange={(value) => setFormData(prev => ({ ...prev, preferredFoods: value }))}
              placeholder="선호하는 음식을 선택해주세요"
              className="mb-4"
            />
            
            {formData.preferredFoods.includes('기타') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 선호 음식 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={formData.customPreferred || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, customPreferred: e.target.value }))}
                  placeholder="예: 랍스터, 트러플, 캐비어"
                  className="input-field"
                />
              </div>
            )}
          </div>

          {/* 비선호 음식 */}
          <div className="card animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">비선호하는 음식</h2>
                <p className="text-sm text-gray-600">드시고 싶지 않거나 싫어하는 음식을 선택해주세요</p>
              </div>
            </div>
            
            <MultiSelect
              options={FOOD_OPTIONS}
              value={formData.dislikedFoods}
              onChange={(value) => setFormData(prev => ({ ...prev, dislikedFoods: value }))}
              placeholder="비선호하는 음식을 선택해주세요"
              className="mb-4"
            />
            
            {formData.dislikedFoods.includes('기타') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 비선호 음식 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={formData.customDisliked || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, customDisliked: e.target.value }))}
                  placeholder="예: 매운음식, 생선, 향신료"
                  className="input-field"
                />
              </div>
            )}
          </div>

          {/* 알레르기 */}
          <div className="card animate-slide-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">알레르기 정보</h2>
                <p className="text-sm text-gray-600">알레르기가 있는 식품을 선택해주세요 (중요)</p>
              </div>
            </div>
            
            <MultiSelect
              options={ALLERGY_OPTIONS}
              value={formData.allergies}
              onChange={(value) => setFormData(prev => ({ ...prev, allergies: value }))}
              placeholder="알레르기가 있는 식품을 선택해주세요"
              className="mb-4"
            />
            
            {formData.allergies.includes('기타') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 알레르기 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={formData.customAllergies || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, customAllergies: e.target.value }))}
                  placeholder="예: 파인애플, 키위, 복숭아"
                  className="input-field"
                />
              </div>
            )}
            
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-orange-800">
                  알레르기 정보는 식단 추천 시 해당 식품을 완전히 제외하는데 사용됩니다. 
                  정확한 정보를 입력해주세요.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                hasBasicPreferences() && !isSubmitting
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-glow'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>분석 중...</span>
                </>
              ) : (
                <>
                  <span>AI 식단 추천 받기</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            {!hasBasicPreferences() && (
              <p className="text-center text-sm text-gray-500">
                하나 이상의 선호도를 설정해주세요
              </p>
            )}
          </div>
        </form>

        {/* Tips */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 더 정확한 추천을 위한 팁</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>평소 자주 드시는 음식을 선호 음식에 포함시켜주세요</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>알레르기 정보는 반드시 정확하게 입력해주세요</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>설정은 언제든지 변경할 수 있습니다</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
