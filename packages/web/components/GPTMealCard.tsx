'use client'

import { GPTMealItem, GPTMealsAPI } from '@ketobab/shared'
import { Clock, ChefHat, Calculator, Utensils } from 'lucide-react'

interface GPTMealCardProps {
  mealItem: GPTMealItem
  mealType: 'breakfast' | 'lunch' | 'dinner'
  className?: string
}

const mealTypeInfo = {
  breakfast: {
    title: '아침',
    icon: '🌅',
    bgColor: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700'
  },
  lunch: {
    title: '점심',
    icon: '☀️',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  dinner: {
    title: '저녁',
    icon: '🌙',
    bgColor: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  }
}

export default function GPTMealCard({ mealItem, mealType, className = '' }: GPTMealCardProps) {
  const typeInfo = mealTypeInfo[mealType]
  const ketoScore = GPTMealsAPI.calculateKetoScore(mealItem)
  const calories = GPTMealsAPI.calculateCalories(mealItem)

  return (
    <div className={`bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${typeInfo.borderColor} ${className}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${typeInfo.bgColor} p-4 border-b border-gray-100`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{typeInfo.icon}</span>
            <span className={`text-sm font-medium ${typeInfo.textColor}`}>
              {typeInfo.title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {/* 키토 점수 */}
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              ketoScore >= 80 ? 'bg-green-100 text-green-800' :
              ketoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              키토 {ketoScore}점
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {mealItem.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* 영양 정보 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">칼로리</div>
            <div className="font-semibold text-gray-900">{calories}</div>
          </div>
          <div className="text-center border-l border-gray-200 pl-3">
            <div className="text-sm text-gray-500 mb-1">탄수화물</div>
            <div className="font-semibold text-orange-600">{mealItem.carbs}</div>
          </div>
          <div className="text-center border-l border-gray-200 pl-3">
            <div className="text-sm text-gray-500 mb-1">단백질</div>
            <div className="font-semibold text-blue-600">{mealItem.protein}</div>
          </div>
          <div className="text-center border-l border-gray-200 pl-3">
            <div className="text-sm text-gray-500 mb-1">지방</div>
            <div className="font-semibold text-green-600">{mealItem.fat}</div>
          </div>
        </div>

        {/* 재료 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Utensils className="w-4 h-4 text-gray-500" />
            <h4 className="font-semibold text-gray-900">재료</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {mealItem.ingredients.map((ingredient, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* 조리법 */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ChefHat className="w-4 h-4 text-gray-500" />
            <h4 className="font-semibold text-gray-900">조리법</h4>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-3 rounded-lg">
            {mealItem.cooking_method}
          </p>
        </div>
      </div>
    </div>
  )
}
