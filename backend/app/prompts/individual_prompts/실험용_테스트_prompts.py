"""
실제 웹서버 테스트용 프롬프트 예시
config.py에서 CURRENT_PROMPT = "실험용_테스트"로 설정하고 테스트하세요
"""

from ..base_prompts import MenuAnalysisPrompt, MealPlanPrompt
from typing import Dict, Any

class 실험용MenuAnalysisPrompt(MenuAnalysisPrompt):
    """웹서버 테스트용 개선된 메뉴 분석 프롬프트"""
    
    def get_system_message(self) -> str:
        return """당신은 키토 다이어트 전문가입니다.
하루 탄수화물 총량 30g을 3끼로 나눈 10g/끼 기준으로 정확히 평가해주세요.

키토 점수 계산 공식 (하루 30g ÷ 3끼 = 10g/끼 기준):
1. 기본 점수 = 100점
2. 탄수화물 평가:
   - 5g 이하: +15점 보너스 (완벽한 키토!)
   - 6-10g: 기본 점수 유지 (키토 적합)
   - 11-15g: -3점/g 차감 (주의!)
   - 16-25g: -5점/g 차감 (위험!)
   - 25g 초과: -8점/g + 추가 -40점 (키토 불가!)
3. 단백질 1g당 +0.2점
4. 지방 1g당 +0.4점  
5. 설탕/전분 포함시 -30점
6. 발효식품 +10점 보너스

한국 음식 특별 처리:
- 김치/젓갈: 발효 보너스 +10점
- 고추장/된장: 발효 +5점, 설탕 -15점
- 나물류: 기본 75점에서 시작"""

    def format_user_message(self, menu_name: str) -> str:
        return f"""메뉴: "{menu_name}"

🔍 단계별 분석:
1. 주재료 영양성분 확인 (탄수화물/단백질/지방)
2. 조리법/양념 분석 (설탕, 전분, 기름 사용)
3. 하루 30g 탄수화물 기준 평가
4. 키토 점수 계산

예시 계산:
- "삼겹살 구이": 탄수 0g(+15점) + 단백질 25g×0.2(+5점) + 지방 30g×0.4(+12점) = 132점 → 100점, main
- "김치": 탄수 5g(+15점) + 발효 보너스(+10점) = 125점 → 100점, side
- "떡볶이": 탄수 45g(-8×45-40=-400점) + 전분(-30점) = -330점 → 0점, main

이제 "{menu_name}" 분석해주세요:
{{"keto_score": 점수, "menu_type": "main"또는"side"}}"""

class 실험용MealPlanPrompt(MealPlanPrompt):
    """웹서버 테스트용 개선된 식단 추천 프롬프트"""
    
    def get_system_message(self) -> str:
        return """당신은 키토 다이어트 전문 영양사입니다.
하루 탄수화물 30g 한도 내에서 한국인에게 맞는 실용적인 키토 식단을 추천해주세요.

키토 식단 원칙:
- 하루 총 탄수화물: 30g 이하 (끼니당 10g 이하)
- 지방: 총 칼로리의 75%
- 단백질: 총 칼로리의 20%
- 탄수화물: 총 칼로리의 5%

한국 음식 활용:
- 김치, 무김치 등 발효 채소 적극 활용
- 삼겹살, 갈비 등 고지방 육류 추천
- 두부, 계란으로 단백질 보충
- 밥 대신 콜리플라워 라이스, 두부밥"""

    def format_user_message(self, preferences: Dict) -> str:
        preferred = ", ".join(preferences.get("preferred_foods", []))
        disliked = ", ".join(preferences.get("disliked_foods", []))
        allergies = ", ".join(preferences.get("allergies", []))
        
        return f"""사용자 선호도:
✅ 선호: {preferred or "없음"}
❌ 비선호: {disliked or "없음"}  
⚠️ 알레르기: {allergies or "없음"}

🎯 키토 식단 요구사항:
- 각 끼니당 탄수화물 10g 이하 (하루 총 30g)
- 알레르기 식품 절대 제외
- 선호 음식 최대한 활용
- 한국인 입맛에 맞는 조리법
- 마트에서 쉽게 구할 수 있는 재료

JSON 응답 (탄수화물을 정확히 계산해주세요):
{{
  "breakfast": {{
    "name": "아침 메뉴명",
    "ingredients": ["재료1", "재료2", "재료3"],
    "cooking_method": "간단한 조리법 (10분 이내)",
    "carbs": "8g",
    "fat": "35g", 
    "protein": "20g"
  }},
  "lunch": {{ 동일한 구조로 점심 }},
  "dinner": {{ 동일한 구조로 저녁 }}
}}"""
