// 사용자 입력 데이터 타입
export interface UserPreferences {
  preferredFoods: string[];
  dislikedFoods: string[];
  allergies: string[];
  customPreferred?: string;
  customDisliked?: string;
  customAllergies?: string;
}

// 음식 정보 타입
export interface Food {
  id: number;
  name: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  keto_score: number;
  tags: string[];
  created_at?: string;
}

// 음식점 메뉴 타입
export interface RestaurantMenu {
  id: number;
  restaurant_name: string;
  menu_name: string;
  description?: string;
  keto_score: number;
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  naver_search_keyword?: string;
  created_at?: string;
}

// 식단 추천 결과 타입
export interface MealRecommendation {
  breakfast: Food;
  lunch: Food;
  dinner: Food;
}

// 영양소 정보 타입
export interface NutritionInfo {
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  ketoRatio: number;
}

// AI 응답 타입
export interface AIResponse {
  keto_score: number;
  confidence: number;
  reasoning?: string;
}

// 검색 필터 타입
export interface SearchFilters {
  minKetoScore?: number;
  maxCarbs?: number;
  excludeTags?: string[];
  includeTags?: string[];
}

// GPT 식단 추천 관련 타입
export interface GPTMealItem {
  name: string;
  ingredients: string[];
  cooking_method: string;
  carbs: string;
  fat: string;
  protein: string;
}

export interface GPTMealPlan {
  breakfast: GPTMealItem;
  lunch: GPTMealItem;
  dinner: GPTMealItem;
}

export interface GPTMealRecommendationRequest {
  preferred_foods: string[];
  disliked_foods: string[];
  allergies: string[];
}

export interface GPTMealRecommendationResponse {
  meal_plan: GPTMealPlan;
  user_preferences: GPTMealRecommendationRequest;
  generated_at: string;
}