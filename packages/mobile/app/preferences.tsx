// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useUserStore, UserPreferences } from '@ketobab/shared';

// const FOOD_OPTIONS = [
//   { value: '아보카도', label: '🥑 아보카도' },
//   { value: '연어', label: '🐟 연어' },
//   { value: '치즈', label: '🧀 치즈' },
//   { value: '계란', label: '🥚 계란' },
//   { value: '견과류', label: '🥜 견과류' },
//   { value: '올리브오일', label: '🧴 올리브오일' },
//   { value: '닭가슴살', label: '🐔 닭가슴살' },
//   { value: '브로콜리', label: '🥦 브로콜리' },
//   { value: '시금치', label: '🌿 시금치' },
//   { value: '버터', label: '🧈 버터' },
// ];

// const ALLERGY_OPTIONS = [
//   { value: '견과류', label: '🥜 견과류' },
//   { value: '유제품', label: '🥛 유제품' },
//   { value: '해산물', label: '🦐 해산물' },
//   { value: '계란', label: '🥚 계란' },
//   { value: '콩', label: '🌱 콩류' },
//   { value: '글루텐', label: '🌾 글루텐' },
// ];

// interface MultiSelectProps {
//   title: string;
//   options: Array<{ value: string; label: string }>;
//   selected: string[];
//   onToggle: (value: string) => void;
//   color: string;
//   icon: string;
// }

// function MultiSelect({ title, options, selected, onToggle, color, icon }: MultiSelectProps) {
//   return (
//     <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
//       <View className="flex-row items-center mb-4">
//         <View 
//           className="w-10 h-10 rounded-xl mr-3 items-center justify-center"
//           style={{ backgroundColor: `${color}20` }}
//         >
//           <Ionicons name={icon as any} size={20} color={color} />
//         </View>
//         <Text className="text-xl font-semibold text-gray-900">{title}</Text>
//       </View>
      
//       <View className="flex-row flex-wrap -m-1">
//         {options.map((option) => {
//           const isSelected = selected.includes(option.value);
//           return (
//             <TouchableOpacity
//               key={option.value}
//               onPress={() => onToggle(option.value)}
//               className={`m-1 px-4 py-2 rounded-full border ${
//                 isSelected 
//                   ? 'border-primary-500 bg-primary-50' 
//                   : 'border-gray-200 bg-white'
//               }`}
//             >
//               <Text 
//                 className={`font-medium ${
//                   isSelected ? 'text-primary-700' : 'text-gray-600'
//                 }`}
//               >
//                 {option.label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
      
//       {selected.length > 0 && (
//         <View className="mt-4 pt-4 border-t border-gray-100">
//           <Text className="text-sm text-gray-600 mb-2">선택됨:</Text>
//           <View className="flex-row flex-wrap">
//             {selected.map((item) => (
//               <View key={item} className="bg-primary-100 px-3 py-1 rounded-full mr-2 mb-2">
//                 <Text className="text-primary-700 text-sm font-medium">{item}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }

// export default function PreferencesPage() {
//   const router = useRouter();
//   const { preferences, setPreferences } = useUserStore();
  
//   const [formData, setFormData] = useState<UserPreferences>(preferences);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleToggle = (category: keyof Pick<UserPreferences, 'preferredFoods' | 'dislikedFoods' | 'allergies'>, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [category]: prev[category].includes(value)
//         ? prev[category].filter(item => item !== value)
//         : [...prev[category], value]
//     }));
//   };

//   const handleSubmit = async () => {
//     const hasBasicPreferences = 
//       formData.preferredFoods.length > 0 || 
//       formData.dislikedFoods.length > 0 || 
//       formData.allergies.length > 0 ||
//       formData.customPreferred ||
//       formData.customDisliked ||
//       formData.customAllergies;

//     if (!hasBasicPreferences) {
//       Alert.alert(
//         '선호도 설정 필요',
//         '하나 이상의 선호도를 설정해주세요.',
//         [{ text: '확인' }]
//       );
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       setPreferences(formData);
//       Alert.alert(
//         '설정 완료',
//         'AI가 맞춤 식단을 추천해드릴게요!',
//         [
//           {
//             text: '확인',
//             onPress: () => router.push('/recommendations')
//           }
//         ]
//       );
//     } catch (error) {
//       Alert.alert('오류', '설정 저장에 실패했습니다.');
//       console.error('선호도 저장 실패:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View className="mb-8">
//           <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
//             맞춤 식단을 위한 선호도 설정
//           </Text>
//           <Text className="text-gray-600 text-center">
//             당신의 취향에 맞는 완벽한 키토 식단을 추천해드릴게요
//           </Text>
//         </View>

//         {/* Progress */}
//         <View className="mb-8">
//           <View className="flex-row justify-between mb-2">
//             <Text className="text-sm text-gray-500">1단계: 선호도 설정</Text>
//             <Text className="text-sm text-gray-500">2단계: 식단 추천</Text>
//           </View>
//           <View className="w-full bg-gray-200 rounded-full h-2">
//             <View className="bg-primary-600 h-2 rounded-full w-1/2" />
//           </View>
//         </View>

//         {/* 선호 음식 */}
//         <MultiSelect
//           title="선호하는 음식"
//           options={FOOD_OPTIONS}
//           selected={formData.preferredFoods}
//           onToggle={(value) => handleToggle('preferredFoods', value)}
//           color="#16a34a"
//           icon="heart-outline"
//         />

//         {/* 비선호 음식 */}
//         <MultiSelect
//           title="비선호하는 음식"
//           options={FOOD_OPTIONS}
//           selected={formData.dislikedFoods}
//           onToggle={(value) => handleToggle('dislikedFoods', value)}
//           color="#ef4444"
//           icon="close-circle-outline"
//         />

//         {/* 알레르기 */}
//         <MultiSelect
//           title="알레르기 정보"
//           options={ALLERGY_OPTIONS}
//           selected={formData.allergies}
//           onToggle={(value) => handleToggle('allergies', value)}
//           color="#f59e0b"
//           icon="warning-outline"
//         />

//         {/* 기타 입력 */}
//         <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
//           <Text className="text-lg font-semibold text-gray-900 mb-4">기타 선호도 (선택사항)</Text>
          
//           <View className="space-y-4">
//             <View>
//               <Text className="text-sm font-medium text-gray-700 mb-2">기타 선호 음식</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
//                 placeholder="예: 랍스터, 트러플, 캐비어 (쉼표로 구분)"
//                 value={formData.customPreferred || ''}
//                 onChangeText={(text) => setFormData(prev => ({ ...prev, customPreferred: text }))}
//                 multiline
//               />
//             </View>
            
//             <View>
//               <Text className="text-sm font-medium text-gray-700 mb-2">기타 비선호 음식</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
//                 placeholder="예: 매운음식, 생선, 향신료 (쉼표로 구분)"
//                 value={formData.customDisliked || ''}
//                 onChangeText={(text) => setFormData(prev => ({ ...prev, customDisliked: text }))}
//                 multiline
//               />
//             </View>
            
//             <View>
//               <Text className="text-sm font-medium text-gray-700 mb-2">기타 알레르기</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
//                 placeholder="예: 파인애플, 키위, 복숭아 (쉼표로 구분)"
//                 value={formData.customAllergies || ''}
//                 onChangeText={(text) => setFormData(prev => ({ ...prev, customAllergies: text }))}
//                 multiline
//               />
//             </View>
//           </View>
//         </View>

//         {/* 주의사항 */}
//         <View className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8">
//           <View className="flex-row items-start">
//             <Ionicons name="information-circle-outline" size={20} color="#f59e0b" />
//             <View className="ml-3 flex-1">
//               <Text className="text-orange-800 text-sm leading-5">
//                 알레르기 정보는 식단 추천 시 해당 식품을 완전히 제외하는데 사용됩니다. 
//                 정확한 정보를 입력해주세요.
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           onPress={handleSubmit}
//           disabled={isSubmitting}
//           className={`py-4 px-6 rounded-2xl flex-row items-center justify-center mb-8 ${
//             isSubmitting ? 'bg-gray-400' : 'bg-primary-600'
//           }`}
//         >
//           {isSubmitting ? (
//             <>
//               <Ionicons name="refresh" size={20} color="white" />
//               <Text className="text-white font-semibold text-lg ml-2">분석 중...</Text>
//             </>
//           ) : (
//             <>
//               <Text className="text-white font-semibold text-lg mr-2">AI 식단 추천 받기</Text>
//               <Ionicons name="chevron-forward" size={20} color="white" />
//             </>
//           )}
//         </TouchableOpacity>

//         {/* Tips */}
//         <View className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
//           <Text className="text-lg font-semibold text-gray-900 mb-3">💡 더 정확한 추천을 위한 팁</Text>
//           <View className="space-y-2">
//             <Text className="text-blue-800 text-sm">• 평소 자주 드시는 음식을 선호 음식에 포함시켜주세요</Text>
//             <Text className="text-blue-800 text-sm">• 알레르기 정보는 반드시 정확하게 입력해주세요</Text>
//             <Text className="text-blue-800 text-sm">• 설정은 언제든지 변경할 수 있습니다</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
