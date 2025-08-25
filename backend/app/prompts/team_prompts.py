"""
팀원별 프롬프트 실험 파일들
각자 이 파일을 복사해서 individual_prompts/팀원명_prompts.py로 작업
"""

from .base_prompts import MenuAnalysisPrompt, MealPlanPrompt
from typing import Dict, Any
from .individual_prompts.prompts_jch import JCHMenuAnalysisPrompt, JCHMealPlanPrompt


class ImprovedMenuAnalysisPrompt(MenuAnalysisPrompt):
    """개선된 메뉴 분석 프롬프트 - 예시용"""
    
    def get_system_message(self) -> str:
        return """당신은 키토 다이어트 전문가이며 한국 음식에 특화된 영양 분석가입니다.

키토 점수 계산법:
1. 기본 점수 = 100
2. 탄수화물 1g당 -2점
3. 설탕/전분 포함시 추가 -20점
4. 고지방(견과류, 기름) 포함시 +10점

한국 음식 특별 고려사항:
- 김치: 발효식품으로 +5점 보너스
- 고추장/된장: 발효 +3점, 설탕 -10점
- 나물류: 기본 70점
- 구이류: 양념 제외하고 90점 이상"""

    def format_user_message(self, menu_name: str) -> str:
        return f"""메뉴: "{menu_name}"

단계별 분석:
1. 주재료 식별
2. 조리법 분석 
3. 숨은 탄수화물 확인
4. 키토 점수 계산
5. 메뉴 타입 분류

Few-shot 예시:
"제육볶음": 돼지고기(+90) + 고추장(-10) + 양파(-5) = 75점, main
"멸치볶음": 멸치(+85) + 견과류(+10) + 조금 설탕(-5) = 90점, side

JSON 응답:
{{"keto_score": 점수, "menu_type": "main"또는"side", "reasoning": "간단한 이유"}}"""

class ImprovedMealPlanPrompt(MealPlanPrompt):
    """개선된 식단 추천 프롬프트 - 예시용"""
    
    def format_user_message(self, preferences: Dict) -> str:
        base_message = super().format_user_message(preferences)
        
        # 개선된 부분: 더 구체적인 가이드라인 추가
        improvements = """
추가 고려사항:
- 한끼당 탄수화물 7g 이하 유지
- 포만감을 위해 충분한 지방 포함
- 조리 시간 20분 이내
- 한국인 입맛에 맞는 양념 활용
- 실제 구하기 쉬운 재료 사용

영양소 계산 예시:
계란 2개 + 아보카도 1/2개 + 올리브오일 1큰술
= 탄수화물 4g + 지방 28g + 단백질 14g"""
        
        return base_message + improvements

# 팀원별 프롬프트 등록 시스템
TEAM_PROMPTS = {
    "default": {
        "menu_analysis": MenuAnalysisPrompt(),
        "meal_plan": MealPlanPrompt()
    },
    "improved": {
        "menu_analysis": ImprovedMenuAnalysisPrompt(), 
        "meal_plan": ImprovedMealPlanPrompt()
    }
    # 팀원들이 여기에 추가: "김철수": {...}, "이영희": {...}
}
TEAM_PROMPTS["jch"] = {
    "menu_analysis": JCHMenuAnalysisPrompt(),
    "meal_plan": JCHMealPlanPrompt()
}


# 웹서버 테스트용 프롬프트 (실제 테스트할 때 사용)
try:
    from .individual_prompts.실험용_테스트_prompts import 실험용MenuAnalysisPrompt, 실험용MealPlanPrompt
    TEAM_PROMPTS["실험용_테스트"] = {
        "menu_analysis": 실험용MenuAnalysisPrompt(),
        "meal_plan": 실험용MealPlanPrompt()
    }
except ImportError:
    pass  # 실험용 파일이 없으면 무시

def get_prompt_set(team_member: str = "default"):
    """팀원별 프롬프트 세트 반환"""
    return TEAM_PROMPTS.get(team_member, TEAM_PROMPTS["default"])
