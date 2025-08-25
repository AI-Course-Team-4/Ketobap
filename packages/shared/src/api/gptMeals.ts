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

      const result = await response.json() as any;
      
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
   * 키토 다이어트 기준: 지방 70-75%, 단백질 20-25%, 탄수화물 5-10%
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
      const proteinRatio = (protein * 4) / totalCalories;

      let score = 0;
      
      // 1. 지방 비율 점수 (40점 만점) - 70-75%가 이상적
      if (fatRatio >= 0.7 && fatRatio <= 0.8) {
        score += 40; // 이상적 범위
      } else if (fatRatio >= 0.65 && fatRatio <= 0.85) {
        score += 35; // 허용 범위
      } else if (fatRatio >= 0.6) {
        score += Math.max(0, 30 - Math.abs(fatRatio - 0.725) * 100);
      } else {
        score += fatRatio * 50; // 60% 미만은 대폭 감점
      }
      
      // 2. 탄수화물 비율 점수 (35점 만점) - 10% 이하가 필수
      if (carbRatio <= 0.05) {
        score += 35; // 5% 이하 완벽
      } else if (carbRatio <= 0.1) {
        score += 30; // 10% 이하 양호
      } else if (carbRatio <= 0.15) {
        score += 20; // 15% 이하 보통
      } else {
        score += Math.max(0, 20 - (carbRatio - 0.15) * 200); // 15% 초과 시 급격히 감점
      }

      // 3. 단백질 비율 점수 (25점 만점) - 20-22%가 이상적
      if (proteinRatio >= 0.2 && proteinRatio <= 0.22) {
        score += 25; // 이상적 범위 (20-22%)
      } else if (proteinRatio >= 0.18 && proteinRatio < 0.2) {
        score += 23; // 약간 부족 (18-20%)
      } else if (proteinRatio > 0.22 && proteinRatio <= 0.25) {
        score += 22; // 약간 높음 (22-25%)
      } else if (proteinRatio > 0.25 && proteinRatio <= 0.28) {
        score += 18; // 높음 (25-28%)
      } else if (proteinRatio >= 0.15 && proteinRatio < 0.18) {
        score += 20; // 부족 (15-18%)
      } else if (proteinRatio > 0.28) {
        // 단백질이 너무 많으면 급격히 감점 (키토시스 방해)
        score += Math.max(5, 15 - (proteinRatio - 0.28) * 150);
      } else {
        // 단백질이 매우 적으면 감점 (15% 미만)
        score += Math.max(10, proteinRatio * 80);
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

  /**
   * 영양소별 키토 적합성을 평가하여 색상 상태를 반환합니다
   */
  static evaluateNutritionStatus(mealItem: { carbs: string; fat: string; protein: string }) {
    try {
      const carbs = parseFloat(mealItem.carbs.replace(/[^\d.]/g, '')) || 0;
      const fat = parseFloat(mealItem.fat.replace(/[^\d.]/g, '')) || 0;
      const protein = parseFloat(mealItem.protein.replace(/[^\d.]/g, '')) || 0;

      const totalCalories = (carbs * 4) + (fat * 9) + (protein * 4);
      
      if (totalCalories === 0) {
        return {
          carbs: { status: 'unknown', message: '정보 없음' },
          fat: { status: 'unknown', message: '정보 없음' },
          protein: { status: 'unknown', message: '정보 없음' }
        };
      }

      const fatRatio = (fat * 9) / totalCalories;
      const carbRatio = (carbs * 4) / totalCalories;
      const proteinRatio = (protein * 4) / totalCalories;

      // 지방 평가
      let fatStatus, fatMessage;
      if (fatRatio >= 0.72 && fatRatio <= 0.78) {
        fatStatus = 'perfect';
        fatMessage = '이상적';
      } else if (fatRatio >= 0.68 && fatRatio <= 0.82) {
        fatStatus = 'good';
        fatMessage = '양호';
      } else if (fatRatio >= 0.60 && fatRatio <= 0.85) {
        fatStatus = 'warning';
        fatMessage = '주의';
      } else if (fatRatio < 0.60) {
        fatStatus = 'low';
        fatMessage = '부족';
      } else {
        fatStatus = 'high';
        fatMessage = '과다';
      }

      // 탄수화물 평가
      let carbStatus, carbMessage;
      if (carbRatio <= 0.03) {
        carbStatus = 'perfect';
        carbMessage = '이상적';
      } else if (carbRatio <= 0.08) {
        carbStatus = 'good';
        carbMessage = '양호';
      } else if (carbRatio <= 0.15) {
        carbStatus = 'warning';
        carbMessage = '주의';
      } else {
        carbStatus = 'high';
        carbMessage = '과다';
      }

      // 단백질 평가 (키토 다이어트 기준: 20% 내외 이상적)
      let proteinStatus, proteinMessage;
      if (proteinRatio >= 0.19 && proteinRatio <= 0.22) {
        proteinStatus = 'perfect';
        proteinMessage = '이상적';
      } else if (proteinRatio >= 0.17 && proteinRatio <= 0.25) {
        proteinStatus = 'good';
        proteinMessage = '양호';
      } else if (proteinRatio >= 0.15 && proteinRatio <= 0.28) {
        proteinStatus = 'warning';
        proteinMessage = '주의';
      } else if (proteinRatio < 0.17) {
        proteinStatus = 'low';
        proteinMessage = '부족';
      } else {
        proteinStatus = 'high';
        proteinMessage = '과다';
      }

      return {
        carbs: { status: carbStatus, message: carbMessage, ratio: Math.round(carbRatio * 100) },
        fat: { status: fatStatus, message: fatMessage, ratio: Math.round(fatRatio * 100) },
        protein: { status: proteinStatus, message: proteinMessage, ratio: Math.round(proteinRatio * 100) }
      };
    } catch (error) {
      console.error('영양소 상태 평가 실패:', error);
      return {
        carbs: { status: 'unknown', message: '계산 오류' },
        fat: { status: 'unknown', message: '계산 오류' },
        protein: { status: 'unknown', message: '계산 오류' }
      };
    }
  }
}
