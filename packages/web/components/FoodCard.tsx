'use client'

import { Food } from '@Ketobap/shared'
import KetoScore from './ui/KetoScore'
import { Clock, Utensils } from 'lucide-react'

interface FoodCardProps {
  food: Food
  mealType: 'breakfast' | 'lunch' | 'dinner'
  className?: string
  style?: React.CSSProperties
}

const MEAL_LABELS = {
  breakfast: '🌅 아침',
  lunch: '☀️ 점심', 
  dinner: '🌙 저녁'
}

const MEAL_TIMES = {
  breakfast: '07:00 - 09:00',
  lunch: '12:00 - 14:00',
  dinner: '18:00 - 20:00'
}

export default function FoodCard({ food, mealType, className, style }: FoodCardProps) {
  const totalMacros = food.carbs + food.protein + food.fat
  const carbsPercent = totalMacros > 0 ? (food.carbs / totalMacros) * 100 : 0
  const proteinPercent = totalMacros > 0 ? (food.protein / totalMacros) * 100 : 0
  const fatPercent = totalMacros > 0 ? (food.fat / totalMacros) * 100 : 0

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}
      style={style}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-green-50 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {MEAL_LABELS[mealType]}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{MEAL_TIMES[mealType]}</span>
            </div>
          </div>
          <KetoScore score={food.keto_score} size="sm" />
        </div>
      </div>

      {/* Food Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-2">{food.name}</h4>
            
            {/* Tags */}
            {food.tags && food.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {food.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {food.tags.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{food.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="text-right ml-4">
            <p className="text-2xl font-bold text-primary-600">{food.calories}</p>
            <p className="text-sm text-gray-500">칼로리</p>
          </div>
        </div>

        {/* Nutrition Info */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-lg font-semibold text-red-600">{food.carbs}g</p>
              <p className="text-xs text-red-500">탄수화물</p>
              <p className="text-xs text-gray-500">{carbsPercent.toFixed(1)}%</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-lg font-semibold text-blue-600">{food.protein}g</p>
              <p className="text-xs text-blue-500">단백질</p>
              <p className="text-xs text-gray-500">{proteinPercent.toFixed(1)}%</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-lg font-semibold text-green-600">{food.fat}g</p>
              <p className="text-xs text-green-500">지방</p>
              <p className="text-xs text-gray-500">{fatPercent.toFixed(1)}%</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-2">
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-red-400 transition-all duration-1000"
                style={{ width: `${carbsPercent}%` }}
              />
              <div 
                className="absolute top-0 h-full bg-blue-400 transition-all duration-1000"
                style={{ 
                  left: `${carbsPercent}%`,
                  width: `${proteinPercent}%` 
                }}
              />
              <div 
                className="absolute top-0 h-full bg-green-400 transition-all duration-1000"
                style={{ 
                  left: `${carbsPercent + proteinPercent}%`,
                  width: `${fatPercent}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Keto Status */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {food.keto_score >= 80 ? (
            <div className="flex items-center space-x-2 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium">키토 우수</span>
            </div>
          ) : food.keto_score >= 60 ? (
            <div className="flex items-center space-x-2 text-yellow-600">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-sm font-medium">키토 보통</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-600">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-sm font-medium">키토 부족</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
