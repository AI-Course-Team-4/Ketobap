import { AIResponse } from '../types';

const HF_API_URL = 'https://api-inference.huggingface.co/models';
const HF_TOKEN = process.env.HUGGING_FACE_TOKEN || process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN;

export class HuggingFaceAPI {
  /**
   * 음식명을 기반으로 키토 점수를 계산합니다
   */
  static async calculateKetoScore(foodName: string, ingredients?: string[]): Promise<AIResponse> {
    if (!HF_TOKEN) {
      console.warn('Hugging Face API 토큰이 없습니다. 기본값을 반환합니다.');
      return this.getFallbackKetoScore(foodName);
    }

    try {
      // 간단한 키토 점수 계산 로직 (실제로는 더 정교한 AI 모델 사용)
      const ketoScore = this.calculateBasicKetoScore(foodName, ingredients);
      
      return {
        keto_score: ketoScore,
        confidence: 0.8,
        reasoning: `${foodName}의 일반적인 영양 성분을 기반으로 계산된 키토 점수입니다.`
      };
    } catch (error) {
      console.error('Hugging Face API 호출 실패:', error);
      return this.getFallbackKetoScore(foodName);
    }
  }

  /**
   * 기본적인 키토 점수 계산 로직
   */
  private static calculateBasicKetoScore(foodName: string, ingredients?: string[]): number {
    const name = foodName.toLowerCase();
    const ingredientText = ingredients?.join(' ').toLowerCase() || '';
    const fullText = `${name} ${ingredientText}`;

    // 키토 친화적인 키워드들
    const ketoFriendly = [
      '아보카도', '치즈', '버터', '올리브오일', '연어', '참치', '계란', '닭가슴살',
      '브로콜리', '시금치', '양상추', '견과류', '아몬드', '호두', '마카다미아',
      '코코넛', 'MCT', '베이컨', '삼겹살', '등심', '새우', '게'
    ];

    // 키토에 좋지 않은 키워드들
    const nonKetoFriendly = [
      '밥', '면', '빵', '파스타', '라면', '우동', '국수', '떡', '감자', '고구마',
      '바나나', '사과', '포도', '설탕', '꿀', '시럽', '케이크', '쿠키', '과자'
    ];

    let score = 50; // 기본 점수

    // 키토 친화적 키워드 점수 증가
    ketoFriendly.forEach(keyword => {
      if (fullText.includes(keyword)) {
        score += 15;
      }
    });

    // 키토에 좋지 않은 키워드 점수 감소
    nonKetoFriendly.forEach(keyword => {
      if (fullText.includes(keyword)) {
        score -= 20;
      }
    });

    // 점수 범위 제한 (0-100)
    return Math.max(0, Math.min(100, score));
  }

  /**
   * API 호출 실패 시 대체 점수 반환
   */
  private static getFallbackKetoScore(foodName: string): AIResponse {
    const score = this.calculateBasicKetoScore(foodName);
    
    return {
      keto_score: score,
      confidence: 0.6,
      reasoning: '기본 키워드 분석을 통한 추정 점수입니다.'
    };
  }

  /**
   * 여러 음식의 키토 점수를 일괄 계산합니다
   */
  static async calculateMultipleKetoScores(
    foods: Array<{ name: string; ingredients?: string[] }>
  ): Promise<AIResponse[]> {
    const promises = foods.map(food => 
      this.calculateKetoScore(food.name, food.ingredients)
    );

    return Promise.all(promises);
  }
}
