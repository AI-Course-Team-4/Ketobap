'use client'

import { RestaurantMenu, RestaurantsAPI } from '@ketobab/shared'
import KetoScore from './ui/KetoScore'
import { MapPin, Phone, ExternalLink, Star } from 'lucide-react'

interface RestaurantCardProps {
  menu: RestaurantMenu
  className?: string
}

export default function RestaurantCard({ menu, className }: RestaurantCardProps) {
  const handleNaverSearch = () => {
    const searchUrl = RestaurantsAPI.generateNaverSearchUrl(menu)
    window.open(searchUrl, '_blank')
  }

  const handlePhoneCall = () => {
    if (menu.phone) {
      window.location.href = `tel:${menu.phone}`
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {menu.restaurant_name}
            </h3>
            <h4 className="text-xl font-semibold text-orange-600 mb-2">
              {menu.menu_name}
            </h4>
            {menu.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {menu.description}
              </p>
            )}
          </div>
          <KetoScore score={menu.keto_score} size="md" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        {menu.address && (
          <div className="flex items-start space-x-3 mb-4">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">위치</p>
              <p className="text-sm text-gray-600">{menu.address}</p>
            </div>
          </div>
        )}

        {/* Contact */}
        {menu.phone && (
          <div className="flex items-center space-x-3 mb-6">
            <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">전화번호</p>
              <button 
                onClick={handlePhoneCall}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {menu.phone}
              </button>
            </div>
          </div>
        )}

        {/* Keto Information */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700">키토 친화도</span>
          </div>
          <div className="text-sm text-green-600">
            {menu.keto_score >= 80 && (
              <>
                <p className="font-medium">🎉 키토 다이어트에 완벽한 메뉴에요!</p>
                <p>탄수화물이 적고 건강한 지방이 풍부합니다.</p>
              </>
            )}
            {menu.keto_score >= 60 && menu.keto_score < 80 && (
              <>
                <p className="font-medium">👍 키토 다이어트에 적합한 메뉴에요!</p>
                <p>약간의 주의만 하면 키토 식단에 포함할 수 있어요.</p>
              </>
            )}
            {menu.keto_score < 60 && (
              <>
                <p className="font-medium">⚠️ 키토 다이어트에 주의가 필요해요</p>
                <p>탄수화물 함량을 확인하고 조절해서 드세요.</p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleNaverSearch}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <ExternalLink className="w-5 h-5" />
            <span>네이버에서 검색하기</span>
          </button>
          
          {menu.phone && (
            <button
              onClick={handlePhoneCall}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Phone className="w-5 h-5" />
              <span>전화 걸기</span>
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>💡 팁:</strong> 주문 시 "키토 다이어트 중"이라고 말씀하시고, 
            탄수화물 대신 채소나 샐러드로 대체 요청해보세요!
          </p>
        </div>
      </div>
    </div>
  )
}
