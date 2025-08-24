'use client'

import { ThumbsUp, Check, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

export default function NutritionGuide() {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">🎯 키토 영양소 상태 가이드</h3>
        <p className="text-xs text-gray-600">영양소 값의 색상과 아이콘으로 키토 적합성을 확인하세요</p>
      </div>
      
      <div className="grid grid-cols-5 gap-2 text-xs">
        {/* 이상적 */}
        <div className="flex flex-col items-center bg-white/60 p-2 rounded-lg text-center">
          <ThumbsUp className="w-4 h-4 text-green-600 mb-1" />
          <span className="font-semibold text-green-600">이상적</span>
          <span className="text-gray-500 text-xs">완벽</span>
        </div>

        {/* 양호 */}
        <div className="flex flex-col items-center bg-white/60 p-2 rounded-lg text-center">
          <Check className="w-4 h-4 text-green-500 mb-1" />
          <span className="font-semibold text-green-500">양호</span>
          <span className="text-gray-500 text-xs">키토 맞음</span>
        </div>

        {/* 주의 */}
        <div className="flex flex-col items-center bg-white/60 p-2 rounded-lg text-center">
          <AlertTriangle className="w-4 h-4 text-orange-600 mb-1" />
          <span className="font-semibold text-orange-600">주의</span>
          <span className="text-gray-500 text-xs">허용 범위</span>
        </div>

        {/* 과다 */}
        <div className="flex flex-col items-center bg-white/60 p-2 rounded-lg text-center">
          <TrendingUp className="w-4 h-4 text-red-600 mb-1" />
          <span className="font-semibold text-red-600">과다</span>
          <span className="text-gray-500 text-xs">너무 많음</span>
        </div>

        {/* 부족 */}
        <div className="flex flex-col items-center bg-white/60 p-2 rounded-lg text-center">
          <TrendingDown className="w-4 h-4 text-red-600 mb-1" />
          <span className="font-semibold text-red-600">부족</span>
          <span className="text-gray-500 text-xs">너무 적음</span>
        </div>
      </div>
    </div>
  )
}
