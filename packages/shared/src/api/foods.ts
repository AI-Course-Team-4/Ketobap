import { Food, SearchFilters } from '../types';

export class FoodsAPI {
  /**
   * 모든 음식 데이터를 가져옵니다
   */
  static async getAllFoods(): Promise<Food[]> {
    try {
      // 백엔드 API 호출
      const response = await fetch('http://localhost:8000/foods');
      const result = await response.json();

      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('백엔드 API 호출 실패:', error);
      return [];
    }
  }

  /**
   * 필터 조건에 맞는 음식을 검색합니다
   */
  static async searchFoods(filters: SearchFilters): Promise<Food[]> {
    try {
      // 검색 파라미터 구성
      const params = new URLSearchParams();
      if (filters.minKetoScore) {
        params.append('minKetoScore', filters.minKetoScore.toString());
      }
      if (filters.maxCarbs) {
        params.append('maxCarbs', filters.maxCarbs.toString());
      }
      if (filters.includeTags && filters.includeTags.length > 0) {
        params.append('includeTags', filters.includeTags.join(','));
      }
      if (filters.excludeTags && filters.excludeTags.length > 0) {
        params.append('excludeTags', filters.excludeTags.join(','));
      }

      const response = await fetch(`http://localhost:8000/foods/search?${params.toString()}`);
      const result = await response.json();

      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('백엔드 API 호출 실패:', error);
      return [];
    }
  }

  /**
   * 랜덤한 음식을 가져옵니다
   */
  static async getRandomFoods(count: number = 3, filters?: SearchFilters): Promise<Food[]> {
    const foods = await this.searchFoods(filters || {});
    
    if (foods.length === 0) {
      return [];
    }

    // 랜덤하게 섞어서 필요한 개수만큼 반환
    const shuffled = foods.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, foods.length));
  }

  /**
   * ID로 특정 음식을 가져옵니다
   */
  static async getFoodById(id: number): Promise<Food | null> {
    try {
      const response = await fetch(`http://localhost:8000/foods/${id}`);
      const result = await response.json();

      return result && typeof result === 'object' ? result as Food : null;
    } catch (error) {
      console.error('백엔드 API 호출 실패:', error);
      return null;
    }
  }
}
