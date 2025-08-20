import { Food, NutritionInfo, UserPreferences } from '../types';

export class NutritionUtils {
  /**
   * 음식의 영양 정보를 계산합니다
   */
  static calculateNutrition(food: Food): NutritionInfo {
    const totalMacros = food.carbs + food.protein + food.fat;
    
    return {
      carbs: food.carbs,
      protein: food.protein,
      fat: food.fat,
      calories: food.calories,
      ketoRatio: totalMacros > 0 ? (food.fat / totalMacros) * 100 : 0
    };
  }

  /**
   * 하루 식단의 총 영양 정보를 계산합니다
   */
  static calculateDailyNutrition(foods: Food[]): NutritionInfo {
    const totals = foods.reduce(
      (acc, food) => ({
        carbs: acc.carbs + food.carbs,
        protein: acc.protein + food.protein,
        fat: acc.fat + food.fat,
        calories: acc.calories + food.calories
      }),
      { carbs: 0, protein: 0, fat: 0, calories: 0 }
    );

    const totalMacros = totals.carbs + totals.protein + totals.fat;
    
    return {
      ...totals,
      ketoRatio: totalMacros > 0 ? (totals.fat / totalMacros) * 100 : 0
    };
  }

  /**
   * 키토 다이어트 기준 점수를 계산합니다
   * 이상적 비율: 탄수화물 10%, 단백질 20%, 지방 70%
   */
  static calculateKetoScore(nutrition: NutritionInfo): number {
    const { carbs, protein, fat } = nutrition;
    const totalMacros = carbs + protein + fat;

    if (totalMacros === 0) return 0;

    const carbsRatio = (carbs / totalMacros) * 100;
    const fatRatio = (fat / totalMacros) * 100;
    const proteinRatio = (protein / totalMacros) * 100;

    // 새로운 키토 이상적 비율: 지방 70%, 단백질 20%, 탄수화물 10%
    let score = 0;

    // 지방 비율 점수 (70% 이상적, 최대 40점)
    if (fatRatio >= 70 && fatRatio <= 80) {
      score += 40; // 이상적
    } else if (fatRatio >= 65 && fatRatio < 70) {
      score += 35; // 매우 좋음
    } else if (fatRatio >= 60 && fatRatio < 65) {
      score += 30; // 좋음
    } else if (fatRatio >= 50 && fatRatio < 60) {
      score += 20; // 보통
    } else {
      score += 10; // 부족
    }

    // 탄수화물 비율 점수 (10% 이하 이상적, 최대 35점)
    if (carbsRatio <= 5) {
      score += 35; // 최적
    } else if (carbsRatio <= 10) {
      score += 30; // 이상적
    } else if (carbsRatio <= 15) {
      score += 20; // 허용
    } else if (carbsRatio <= 20) {
      score += 10; // 높음
    } else {
      score += 5; // 매우 높음
    }

    // 단백질 비율 점수 (20% 이상적, 최대 25점)
    if (proteinRatio >= 18 && proteinRatio <= 22) {
      score += 25; // 이상적
    } else if (proteinRatio >= 15 && proteinRatio < 18) {
      score += 22; // 약간 부족
    } else if (proteinRatio >= 22 && proteinRatio <= 25) {
      score += 22; // 약간 높음
    } else if (proteinRatio >= 10 && proteinRatio < 15) {
      score += 18; // 부족
    } else if (proteinRatio >= 25 && proteinRatio <= 30) {
      score += 15; // 높음
    } else {
      score += 10; // 매우 부족하거나 과다
    }

    return Math.min(100, score);
  }

  /**
   * 사용자 선호도에 따라 음식을 필터링합니다
   */
  static filterFoodsByPreferences(foods: Food[], preferences: UserPreferences): Food[] {
    return foods.filter(food => {
      const foodName = food.name.toLowerCase();
      const foodTags = food.tags.map(tag => tag.toLowerCase());
      const searchTerms = [foodName, ...foodTags];

      // 알레르기 식품 제외
      const allergies = [
        ...preferences.allergies.map(a => a.toLowerCase()),
        ...(preferences.customAllergies ? preferences.customAllergies.toLowerCase().split(',').map(s => s.trim()) : [])
      ];

      if (allergies.some(allergy => 
        searchTerms.some(term => term.includes(allergy))
      )) {
        return false;
      }

      // 비선호 식품 제외
      const disliked = [
        ...preferences.dislikedFoods.map(d => d.toLowerCase()),
        ...(preferences.customDisliked ? preferences.customDisliked.toLowerCase().split(',').map(s => s.trim()) : [])
      ];

      if (disliked.some(dislike => 
        searchTerms.some(term => term.includes(dislike))
      )) {
        return false;
      }

      return true;
    });
  }

  /**
   * 선호 식품 점수를 계산합니다
   */
  static calculatePreferenceScore(food: Food, preferences: UserPreferences): number {
    const foodName = food.name.toLowerCase();
    const foodTags = food.tags.map(tag => tag.toLowerCase());
    const searchTerms = [foodName, ...foodTags];

    const preferred = [
      ...preferences.preferredFoods.map(p => p.toLowerCase()),
      ...(preferences.customPreferred ? preferences.customPreferred.toLowerCase().split(',').map(s => s.trim()) : [])
    ];

    let score = 0;
    preferred.forEach(preference => {
      if (searchTerms.some(term => term.includes(preference))) {
        score += 20;
      }
    });

    return Math.min(100, score);
  }
}
