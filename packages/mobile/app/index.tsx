import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomePage() {
  const features = [
    {
      icon: 'brain-outline',
      title: 'AI 맞춤 추천',
      description: '개인의 선호도와 알레르기를 고려한 똑똑한 키토 식단 추천',
      color: '#0284c7'
    },
    {
      icon: 'restaurant-outline',
      title: '영양 분석',
      description: '탄단지 비율과 키토 점수를 실시간으로 분석하여 제공',
      color: '#16a34a'
    },
    {
      icon: 'location-outline',
      title: '외식 가이드',
      description: '강남 지역 키토 친화적인 음식점과 메뉴 추천',
      color: '#f59e0b'
    },
    {
      icon: 'star-outline',
      title: '간편한 사용',
      description: '회원가입 없이 바로 사용 가능한 직관적인 인터페이스',
      color: '#8b5cf6'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-8 pb-4">
          <View className="flex-row items-center mb-6">
            <View className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl mr-3 items-center justify-center">
              <Text className="text-2xl">🥑</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-gray-900">KetoBab</Text>
              <Text className="text-sm text-gray-600">AI 키토 식단 추천</Text>
            </View>
          </View>
        </View>

        {/* Hero Section */}
        <View className="px-6 py-8">
          <View className="bg-primary-50 rounded-3xl p-6 mb-8">
            <Text className="text-sm font-medium text-primary-700 bg-primary-100 self-start px-3 py-1 rounded-full mb-4">
              🚀 AI 기반 키토 다이어트 도우미
            </Text>
            <Text className="text-3xl font-bold text-gray-900 mb-4">
              당신만의{' '}
              <Text className="text-primary-600">키토 식단</Text>을{'\n'}
              AI가 추천해드려요
            </Text>
            <Text className="text-gray-600 text-base leading-6 mb-6">
              개인 선호도, 알레르기, 비선호 식품을 고려하여{'\n'}
              완벽한 키토 식단과 강남 맛집을 추천받으세요
            </Text>
            
            <View className="space-y-3">
              <Link href="/preferences" asChild>
                <TouchableOpacity className="bg-primary-600 py-4 px-6 rounded-2xl flex-row items-center justify-center">
                  <Text className="text-white font-semibold text-lg mr-2">식단 추천 받기</Text>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
              </Link>
              
              <Link href="/restaurants" asChild>
                <TouchableOpacity className="bg-white border-2 border-gray-200 py-4 px-6 rounded-2xl flex-row items-center justify-center">
                  <Ionicons name="location-outline" size={20} color="#374151" />
                  <Text className="text-gray-700 font-semibold text-lg ml-2">강남 맛집 보기</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="px-6 pb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            왜 KetoBab을 선택해야 할까요?
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            AI 기술과 영양학을 결합한 스마트한 키토 다이어트 솔루션
          </Text>
          
          <View className="space-y-4">
            {features.map((feature, index) => (
              <View 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <View className="flex-row items-start">
                  <View 
                    className="w-12 h-12 rounded-2xl mr-4 items-center justify-center"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Ionicons 
                      name={feature.icon as any} 
                      size={24} 
                      color={feature.color} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </Text>
                    <Text className="text-gray-600 leading-5">
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works Section */}
        <View className="px-6 py-8 bg-gray-50">
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            어떻게 작동하나요?
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            3단계로 간단하게 시작하세요
          </Text>
          
          <View className="space-y-6">
            {[
              {
                step: '01',
                title: '선호도 입력',
                description: '좋아하는 음식, 싫어하는 음식, 알레르기 정보를 입력해주세요',
                color: '#8b5cf6'
              },
              {
                step: '02',
                title: 'AI 분석',
                description: 'AI가 당신의 조건에 맞는 키토 친화적인 식단을 분석합니다',
                color: '#16a34a'
              },
              {
                step: '03',
                title: '추천 완료',
                description: '완벽한 키토 식단과 대체 외식 옵션을 추천받으세요',
                color: '#f59e0b'
              }
            ].map((item, index) => (
              <View key={index} className="flex-row items-center">
                <View 
                  className="w-16 h-16 rounded-2xl mr-4 items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <Text className="text-white font-bold text-lg">{item.step}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 leading-5">
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View className="px-6 py-8 bg-primary-600">
          <Text className="text-3xl font-bold text-white mb-4 text-center">
            지금 바로 시작해보세요!
          </Text>
          <Text className="text-primary-100 text-center mb-8 text-lg">
            회원가입 없이 바로 사용 가능한 AI 키토 식단 추천
          </Text>
          <Link href="/preferences" asChild>
            <TouchableOpacity className="bg-white py-4 px-8 rounded-2xl flex-row items-center justify-center">
              <Text className="text-primary-600 font-semibold text-lg mr-2">무료로 시작하기</Text>
              <Ionicons name="chevron-forward" size={20} color="#0284c7" />
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
