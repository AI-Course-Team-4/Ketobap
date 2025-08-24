'use client'

import { NutritionInfo } from '@ketobab/shared'

interface NutritionChartProps {
  nutrition: NutritionInfo
  className?: string
}

export default function NutritionChart({ nutrition, className }: NutritionChartProps) {
  // 칼로리 기준으로 비율 계산 (키토 다이어트 표준)
  const carbsCalories = nutrition.carbs * 4
  const proteinCalories = nutrition.protein * 4  
  const fatCalories = nutrition.fat * 9
  const totalCalories = carbsCalories + proteinCalories + fatCalories
  
  const carbsPercent = totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0
  const proteinPercent = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0
  const fatPercent = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0

  const macroData = [
    {
      name: '탄수화물',
      value: nutrition.carbs,
      calories: carbsCalories,
      percent: carbsPercent,
      color: 'bg-red-500',
      ideal: '≤10%'
    },
    {
      name: '단백질',
      value: nutrition.protein,
      calories: proteinCalories,
      percent: proteinPercent,
      color: 'bg-blue-500',
      ideal: '~20%'
    },
    {
      name: '지방',
      value: nutrition.fat,
      calories: fatCalories,
      percent: fatPercent,
      color: 'bg-green-500',
      ideal: '~70%'
    }
  ]

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-6">
        {/* 칼로리 정보 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-700">{totalCalories.toFixed(0)}</p>
            <p className="text-sm text-purple-600">칼로리</p>
          </div>
        </div>

        {/* 키토 비율 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{fatPercent.toFixed(1)}%</p>
            <p className="text-sm text-green-600">지방 비율</p>
          </div>
        </div>
      </div>

      {/* 영양소 비율 차트 */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">영양소 비율</h4>
        
        {/* 비율 바 */}
        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div 
            className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-1000"
            style={{ width: `${carbsPercent}%` }}
          />
          <div 
            className="absolute top-0 h-full bg-blue-500 transition-all duration-1000"
            style={{ 
              left: `${carbsPercent}%`,
              width: `${proteinPercent}%` 
            }}
          />
          <div 
            className="absolute top-0 h-full bg-green-500 transition-all duration-1000"
            style={{ 
              left: `${carbsPercent + proteinPercent}%`,
              width: `${fatPercent}%` 
            }}
          />
        </div>

        {/* 범례 */}
        <div className="space-y-3">
          {macroData.map((macro, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${macro.color}`} />
                <span className="font-medium text-gray-700">{macro.name}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {macro.value}g ({macro.percent.toFixed(1)}%)
                </p>
                <p className="text-xs text-gray-500">
                  {macro.calories.toFixed(0)}kcal • 이상적: {macro.ideal}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 키토 상태 평가 */}
        <div className="mt-4 p-4 rounded-lg border-2 border-dashed">
          {fatPercent >= 68 && carbsPercent <= 12 && proteinPercent >= 18 && proteinPercent <= 25 ? (
            <div className="text-center text-green-700 bg-green-50">
              <p className="font-semibold">🎉 완벽한 키토 비율입니다!</p>
              <p className="text-sm">이상적인 탄10%/단20%/지70% 비율을 달성했어요</p>
            </div>
          ) : fatPercent >= 65 && carbsPercent <= 15 && proteinPercent >= 15 && proteinPercent <= 30 ? (
            <div className="text-center text-yellow-700 bg-yellow-50">
              <p className="font-semibold">⚡ 좋은 키토 비율이에요</p>
              <p className="text-sm">거의 완벽한 키토 식단입니다</p>
            </div>
          ) : fatPercent >= 60 && carbsPercent <= 20 ? (
            <div className="text-center text-orange-700 bg-orange-50">
              <p className="font-semibold">🔧 키토 비율 조정 필요</p>
              <p className="text-sm">지방 ↑, 탄수화물 ↓ 조정하면 더 좋아요</p>
            </div>
          ) : (
            <div className="text-center text-red-700 bg-red-50">
              <p className="font-semibold">💪 키토 비율 개선 필요</p>
              <p className="text-sm">목표: 탄수화물 ≤10%, 단백질 ~20%, 지방 ~70%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
