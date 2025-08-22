import { GPTMealRecommendationRequest, GPTMealRecommendationResponse, UserPreferences } from '../types';

export class GPTMealsAPI {
  /**
   * GPT를 사용하여 맞춤형 키토 식단을 추천받습니다
   */
  static async recommendMealPlan(preferences: UserPreferences): Promise<GPTMealRecommendationResponse | null> {
    try {
      // UserPreferences를 GPTMealRecommendationRequest 형식으로 변환
      const requestData: GPTMealRecommendationRequest = {
        preferred_foods: [
          ...preferences.preferredFoods,
          ...(preferences.customPreferred ? preferences.customPreferred.split(',').map(s => s.trim()).filter(s => s) : [])
        ],
        disliked_foods: [
          ...preferences.dislikedFoods,
          ...(preferences.customDisliked ? preferences.customDisliked.split(',').map(s => s.trim()).filter(s => s) : [])
        ],
        allergies: [
          ...preferences.allergies,
          ...(preferences.customAllergies ? preferences.customAllergies.split(',').map(s => s.trim()).filter(s => s) : [])
        ]
      };

      const response = await fetch('http://localhost:8000/recommend-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('GPT 식단 추천 API 오류:', errorData);
        return null;
      }

      const result = await response.json();
      
      // 응답이 올바른 형식인지 확인
      if (result && result.meal_plan && 
          result.meal_plan.breakfast && 
          result.meal_plan.lunch && 
          result.meal_plan.dinner) {
        return result as GPTMealRecommendationResponse;
      }

      console.error('GPT 식단 추천 응답 형식이 올바르지 않습니다:', result);
      return null;

    } catch (error) {
      console.error('GPT 식단 추천 API 호출 실패:', error);
      return null;
    }
  }

  /**
   * GPT 식단 추천 결과에서 키토 점수를 계산합니다
   */
  static calculateKetoScore(mealItem: { carbs: string; fat: string; protein: string }): number {
    try {
      // "15g" 같은 형식에서 숫자만 추출
      const carbs = parseFloat(mealItem.carbs.replace(/[^\d.]/g, '')) || 0;
      const fat = parseFloat(mealItem.fat.replace(/[^\d.]/g, '')) || 0;
      const protein = parseFloat(mealItem.protein.replace(/[^\d.]/g, '')) || 0;

      const totalCalories = (carbs * 4) + (fat * 9) + (protein * 4);
      
      if (totalCalories === 0) return 50; // 기본값

      const fatRatio = (fat * 9) / totalCalories;
      const carbRatio = (carbs * 4) / totalCalories;

      // 키토 점수 계산 (지방 비율이 높고 탄수화물 비율이 낮을수록 높은 점수)
      let score = 0;
      
      // 지방 비율 점수 (70% 이상이면 만점)
      if (fatRatio >= 0.7) {
        score += 50;
      } else {
        score += fatRatio * 71.4; // 70%일 때 50점
      }
      
      // 탄수화물 비율 점수 (10% 이하면 만점)
      if (carbRatio <= 0.1) {
        score += 50;
      } else {
        score += Math.max(0, 50 - (carbRatio - 0.1) * 500); // 10%를 넘으면 감점
      }

      return Math.round(Math.max(0, Math.min(100, score)));
    } catch (error) {
      console.error('키토 점수 계산 실패:', error);
      return 50;
    }
  }

  /**
   * GPT 식단 추천 결과에서 총 칼로리를 계산합니다
   */
  static calculateCalories(mealItem: { carbs: string; fat: string; protein: string }): number {
    try {
      const carbs = parseFloat(mealItem.carbs.replace(/[^\d.]/g, '')) || 0;
      const fat = parseFloat(mealItem.fat.replace(/[^\d.]/g, '')) || 0;
      const protein = parseFloat(mealItem.protein.replace(/[^\d.]/g, '')) || 0;

      return Math.round((carbs * 4) + (fat * 9) + (protein * 4));
    } catch (error) {
      console.error('칼로리 계산 실패:', error);
      return 0;
    }
  }
}
