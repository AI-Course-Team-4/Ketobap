import { supabase } from '../config/supabase';
import { RestaurantMenu, SearchFilters } from '../types';
import { MOCK_RESTAURANTS } from './mockData';

export class RestaurantsAPI {
  /**
   * 키토 점수가 높은 음식점 메뉴를 가져옵니다
   */
  static async getTopKetoMenus(limit: number = 5): Promise<RestaurantMenu[]> {
    try {
      const { data, error } = await supabase
        .from('restaurant_menus')
        .select('*')
        .order('keto_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Supabase에서 음식점 데이터 조회 실패, 로컬 데이터 사용:', error);
        return MOCK_RESTAURANTS
          .sort((a, b) => b.keto_score - a.keto_score)
          .slice(0, limit);
      }

      return data || MOCK_RESTAURANTS.slice(0, limit);
    } catch (error) {
      console.warn('데이터베이스 연결 실패, 로컬 데이터 사용:', error);
      return MOCK_RESTAURANTS
        .sort((a, b) => b.keto_score - a.keto_score)
        .slice(0, limit);
    }
  }

  /**
   * 필터 조건에 맞는 음식점 메뉴를 검색합니다
   */
  static async searchRestaurantMenus(filters: SearchFilters): Promise<RestaurantMenu[]> {
    let query = supabase
      .from('restaurant_menus')
      .select('*');

    // 키토 점수 필터
    if (filters.minKetoScore) {
      query = query.gte('keto_score', filters.minKetoScore);
    }

    const { data, error } = await query.order('keto_score', { ascending: false });

    if (error) {
      console.error('음식점 메뉴 검색 실패:', error);
      throw new Error('음식점 메뉴 검색에 실패했습니다');
    }

    return data || [];
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
