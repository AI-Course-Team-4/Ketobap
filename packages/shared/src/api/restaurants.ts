import { RestaurantMenu, SearchFilters } from '../types';

export class RestaurantsAPI {
  /**
   * 키토 점수가 높은 음식점 메뉴를 가져옵니다
   */
  static async getTopKetoMenus(limit: number = 5): Promise<RestaurantMenu[]> {
    try {
      // 백엔드 FastAPI 서버 호출
      const response = await fetch(`http://localhost:8000/restaurants/top?limit=${limit}`);
      const result = await response.json();

      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('백엔드 API 호출 실패:', error);
      return [];
    }
  }

  /**
   * 필터 조건에 맞는 음식점 메뉴를 검색합니다
   */
  static async searchRestaurantMenus(filters: SearchFilters): Promise<RestaurantMenu[]> {
    try {
      // 검색 파라미터 구성
      const params = new URLSearchParams();
      if (filters.minKetoScore) {
        params.append('minKetoScore', filters.minKetoScore.toString());
      }

      const response = await fetch(`http://localhost:8000/restaurants/search?${params.toString()}`);
      const result = await response.json();

      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('백엔드 API 호출 실패:', error);
      return [];
    }
  }

  /**
   * 네이버 검색 URL을 생성합니다
   */
  static generateNaverSearchUrl(menu: RestaurantMenu): string {
    const keyword = menu.naver_search_keyword || `강남 ${menu.restaurant_name} ${menu.menu_name}`;
    return `https://search.naver.com/search.naver?query=${encodeURIComponent(keyword)}`;
  }

  /**
   * 사용자 조건에 맞는 음식점 메뉴를 필터링합니다
   */
  static filterMenusByUserPreferences(
    menus: RestaurantMenu[],
    excludeKeywords: string[]
  ): RestaurantMenu[] {
    if (excludeKeywords.length === 0) {
      return menus;
    }

    return menus.filter(menu => {
      const searchText = `${menu.menu_name} ${menu.description || ''}`.toLowerCase();
      return !excludeKeywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
    });
  }
}
