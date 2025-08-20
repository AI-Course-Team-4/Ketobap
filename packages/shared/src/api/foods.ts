import { supabase } from '../config/supabase';
import { Food, SearchFilters } from '../types';
import { MOCK_FOODS } from './mockData';

export class FoodsAPI {
  /**
   * 모든 음식 데이터를 가져옵니다
   */
  static async getAllFoods(): Promise<Food[]> {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('keto_score', { ascending: false });

      if (error) {
        console.warn('Supabase에서 데이터 조회 실패, 로컬 데이터 사용:', error);
        return MOCK_FOODS.sort((a, b) => b.keto_score - a.keto_score);
      }

      return data || MOCK_FOODS;
    } catch (error) {
      console.warn('데이터베이스 연결 실패, 로컬 데이터 사용:', error);
      return MOCK_FOODS.sort((a, b) => b.keto_score - a.keto_score);
    }
  }

  /**
   * 필터 조건에 맞는 음식을 검색합니다
   */
  static async searchFoods(filters: SearchFilters): Promise<Food[]> {
    let query = supabase
      .from('foods')
      .select('*');

    // 키토 점수 필터
    if (filters.minKetoScore) {
      query = query.gte('keto_score', filters.minKetoScore);
    }

    // 탄수화물 필터
    if (filters.maxCarbs) {
      query = query.lte('carbs', filters.maxCarbs);
    }

    // 태그 포함 필터
    if (filters.includeTags && filters.includeTags.length > 0) {
      query = query.overlaps('tags', filters.includeTags);
    }

    // 태그 제외 필터
    if (filters.excludeTags && filters.excludeTags.length > 0) {
      query = query.not('tags', 'overlap', filters.excludeTags);
    }

    const { data, error } = await query.order('keto_score', { ascending: false });

    if (error) {
      console.error('음식 검색 실패:', error);
      throw new Error('음식 검색에 실패했습니다');
    }

    return data || [];
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
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('음식 조회 실패:', error);
      return null;
    }

    return data;
  }
}
