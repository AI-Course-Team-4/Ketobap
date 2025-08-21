'use client'

import { useEffect, useRef, useState } from 'react'
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
  { value: '올리브오일', label: '🧴 올리브오일' },
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
  { value: '기타', label: '➕ 기타 (직접 입력)' },
]

const ALLERGY_OPTIONS = [
  { value: '견과류', label: '🥜 견과류' },
  { value: '유제품', label: '🥛 유제품' },
  { value: '해산물', label: '🦐 해산물' },
  { value: '계란', label: '🥚 계란' },
  { value: '콩', label: '🌱 콩류' },
  { value: '글루텐', label: '🌾 글루텐' },
  { value: '기타', label: '➕ 기타 (직접 입력)' },
]

// 기타 입력값: 한국어만 허용 (한글 음절/자모), 구분자(쉼표/공백/줄바꿈/CJK 쉼표) 허용
const KOREAN_ONLY_REGEX = /[^\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\s,，、]/g
const baseFoodOptionValues = FOOD_OPTIONS
  .filter((o) => o.value !== '기타')
  .map((o) => o.value)

const sanitizeKoreanChars = (raw: string) => (raw || '').replace(KOREAN_ONLY_REGEX, '')
const splitTokens = (raw: string) =>
  (raw || '')
    .split(/[\s,，、]+/)
    .map((t) => t.trim())
    .filter(Boolean)
const normalizeKoreanList = (raw: string) => {
  const tokens = splitTokens(sanitizeKoreanChars(raw))
  const filtered = tokens.filter((t) => !baseFoodOptionValues.includes(t))
  const unique = Array.from(new Set(filtered))
  return unique.join(', ')
}

export default function PreferencesPage() {
  const router = useRouter()
  const { preferences, setPreferences } = useUserStore()

  const [formData, setFormData] = useState<UserPreferences>(preferences)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 기타 입력 로컬 텍스트(타이핑 보존)
  const [customPreferredText, setCustomPreferredText] = useState<string>(preferences.customPreferred || '')
  const [customDislikedText, setCustomDislikedText] = useState<string>(preferences.customDisliked || '')
  const [customAllergiesText, setCustomAllergiesText] = useState<string>(preferences.customAllergies || '')

  // 입력 포커스 참조
  const preferredInputRef = useRef<HTMLInputElement>(null)
  const dislikedInputRef = useRef<HTMLInputElement>(null)
  const allergyInputRef = useRef<HTMLInputElement>(null)

  // '기타' 선택 시 즉시 포커스
  useEffect(() => {
    if (formData.preferredFoods.includes('기타')) {
      setTimeout(() => preferredInputRef.current?.focus(), 0)
    }
  }, [formData.preferredFoods])

  useEffect(() => {
    if (formData.dislikedFoods.includes('기타')) {
      setTimeout(() => dislikedInputRef.current?.focus(), 0)
    }
  }, [formData.dislikedFoods])

  useEffect(() => {
    if (formData.allergies.includes('기타')) {
      setTimeout(() => allergyInputRef.current?.focus(), 0)
    }
  }, [formData.allergies])

  // 필터링된 옵션: 상대 목록에 이미 선택된 음식 제외 (단, '기타'는 포함)
  const preferredOptions = FOOD_OPTIONS.filter(
    (o) => !formData.dislikedFoods.includes(o.value) || o.value === '기타'
  )
  const dislikedOptions = FOOD_OPTIONS.filter(
    (o) => !formData.preferredFoods.includes(o.value) || o.value === '기타'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 사용자 선호도 저장 (기타 입력 정규화 반영)
      const normalized = {
        ...formData,
        customPreferred: normalizeKoreanList(customPreferredText),
        customDisliked: normalizeKoreanList(customDislikedText),
      }
      setPreferences(normalized)

      // 식단 추천 페이지로 이동
      router.push('/recommendations')
    } catch (error) {
      console.error('선호도 저장 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 선호/비선호 변경 시 상대 목록에 중복된 항목 제거
  const handlePreferredChange = (value: string[]) => {
    setFormData((prev) => ({
      ...prev,
      preferredFoods: value,
      // '기타'는 서로 동시에 선택 가능하도록 유지
      dislikedFoods: prev.dislikedFoods.filter((food) => food === '기타' || !value.includes(food)),
    }))
  }

  const handleDislikedChange = (value: string[]) => {
    setFormData((prev) => ({
      ...prev,
      dislikedFoods: value,
      // '기타'는 서로 동시에 선택 가능하도록 유지
      preferredFoods: prev.preferredFoods.filter((food) => food === '기타' || !value.includes(food)),
    }))
  }

  const hasBasicPreferences = () => {
    const customPreferredSet = new Set(
      splitTokens(sanitizeKoreanChars(customPreferredText))
    )
    const customDislikedSet = new Set(
      splitTokens(sanitizeKoreanChars(customDislikedText))
    )
    const hasConflict = [...customPreferredSet].some((x) => customDislikedSet.has(x))

    return (
      formData.preferredFoods.length > 0 ||
      formData.dislikedFoods.length > 0 ||
      formData.allergies.length > 0 ||
      customPreferredSet.size > 0 ||
      customDislikedSet.size > 0 ||
      !!formData.customAllergies
    ) && !hasConflict
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
                <p className="text-sm text-gray-600">
                  자주 드시거나 좋아하는 음식을 선택해주세요
                </p>
              </div>
            </div>

            <MultiSelect
              options={preferredOptions}
              value={formData.preferredFoods}
              onChange={handlePreferredChange}
              placeholder="선호하는 음식을 선택해주세요"
              className="mb-4"
            />

            {formData.preferredFoods.includes('기타') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 선호 음식 (쉼표/공백/줄바꿈으로 구분)
                </label>
                <input
                  type="text"
                  value={customPreferredText}
                  onChange={(e) => setCustomPreferredText(sanitizeKoreanChars(e.target.value))}
                  onBlur={(e) => setCustomPreferredText(normalizeKoreanList(e.target.value))}
                  placeholder="예: 랍스터, 트러플, 캐비어"
                  className="input-field"
                  ref={preferredInputRef}
                />
                {/* 입력된 기타 항목 미리보기 */}
                {splitTokens(sanitizeKoreanChars(customPreferredText)).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {splitTokens(sanitizeKoreanChars(customPreferredText)).map((token, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {token}
                      </span>
                    ))}
                  </div>
                )}
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
                <p className="text-sm text-gray-600">
                  드시고 싶지 않거나 싫어하는 음식을 선택해주세요
                </p>
              </div>
            </div>

            <MultiSelect
              options={dislikedOptions}
              value={formData.dislikedFoods}
              onChange={handleDislikedChange}
              placeholder="비선호하는 음식을 선택해주세요"
              className="mb-4"
            />

            {formData.dislikedFoods.includes('기타') && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 비선호 음식 (쉼표/공백/줄바꿈으로 구분)
                </label>
                <input
                  type="text"
                  value={customDislikedText}
                  onChange={(e) => setCustomDislikedText(sanitizeKoreanChars(e.target.value))}
                  onBlur={(e) => setCustomDislikedText(normalizeKoreanList(e.target.value))}
                  placeholder="예: 매운음식, 생선, 향신료"
                  className="input-field"
                  ref={dislikedInputRef}
                />
                {/* 입력된 기타 항목 미리보기 */}
                {splitTokens(sanitizeKoreanChars(customDislikedText)).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {splitTokens(sanitizeKoreanChars(customDislikedText)).map((token, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {token}
                      </span>
                    ))}
                  </div>
                )}
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
                <p className="text-sm text-gray-600">
                  알레르기가 있는 식품을 선택해주세요 (중요)
                </p>
              </div>
            </div>

            <MultiSelect
              options={ALLERGY_OPTIONS}
              value={formData.allergies}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, allergies: value }))
              }
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
                  value={customAllergiesText}
                  onChange={(e) => setCustomAllergiesText(sanitizeKoreanChars(e.target.value))}
                  onBlur={(e) => setCustomAllergiesText(normalizeKoreanList(e.target.value))}
                  placeholder="예: 파인애플, 키위, 복숭아"
                  className="input-field"
                  ref={allergyInputRef}
                />
              </div>
            )}

            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-orange-800">
                  알레르기 정보는 식단 추천 시 해당 식품을 완전히 제외하는데
                  사용됩니다. 정확한 정보를 입력해주세요.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button + Validation */}
          <div className="flex flex-col space-y-4">
            {/* 교차 중복 경고: 선호 기타 vs 비선호 기타 */}
            {(() => {
              const pref = splitTokens(sanitizeKoreanChars(customPreferredText))
              const dislike = splitTokens(sanitizeKoreanChars(customDislikedText))
              const conflict = pref.find((p) => dislike.includes(p))
              return conflict ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  같은 음식이 입력되었습니다 수정해주세요
                </div>
              ) : null
            })()}

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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 더 정확한 추천을 위한 팁
          </h3>
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
