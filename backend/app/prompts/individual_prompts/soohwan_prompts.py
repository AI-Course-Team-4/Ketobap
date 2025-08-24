"""
soohwan 팀원 프롬프트 실험 파일
각자 이 파일을 참고해서 [이름]_prompts.py 파일을 만들어주세요

사용법:
1. 이 파일을 복사해서 [본인이름]_prompts.py로 이름 변경
2. 아래 클래스들을 수정해서 프롬프트 실험
3. team_prompts.py의 TEAM_PROMPTS에 본인 이름과 프롬프트 추가
4. 테스트: GPTService("soohwan")로 사용
"""

from ..base_prompts import MenuAnalysisPrompt, MealPlanPrompt
from typing import Dict, Any

class SoohwanMenuAnalysisPrompt(MenuAnalysisPrompt):
    """soohwan이 실험하는 메뉴 분석 프롬프트"""
    
    def get_system_message(self) -> str:
        return """당신은 키토 다이어트 전문가입니다.
        
여기에 soohwan만의 시스템 메시지를 작성해보세요.
예: 한국 음식 특화, 더 정확한 점수 기준, 특별한 분석 방법 등

키토 점수 기준을 더 구체적으로 정의하거나,
한국 음식에 특화된 분석 방법을 추가해보세요."""

    def format_user_message(self, menu_name: str) -> str:
        return f"""메뉴명: "{menu_name}"

여기에 soohwan만의 분석 방법을 작성해보세요.
예: 
- 단계별 분석 과정
- Few-shot learning 예시 추가
- 더 구체적인 평가 기준
- Chain-of-thought 방식

JSON 응답:
{{"keto_score": 점수, "menu_type": "main"또는"side"}}"""

    def get_model_config(self) -> Dict[str, Any]:
        return {
            "model": "gpt-4o-mini",
            "max_tokens": 150,  # 필요에 따라 조정
            "temperature": 0.1  # soohwan이 원하는 값으로 조정
        }

class SoohwanMealPlanPrompt(MealPlanPrompt):
    """soohwan이 실험하는 식단 추천 프롬프트"""
    
    def get_system_message(self) -> str:
        return """당신은 키토 다이어트 전문 영양사입니다.

여기에 soohwan만의 시스템 메시지를 작성해보세요.
예:
- 한국인 체질에 맞는 키토 식단
- 더 정확한 영양소 계산
- 계절별 식재료 고려
- 조리 난이도별 추천"""

    def format_user_message(self, preferences: Dict) -> str:
        base_message = super().format_user_message(preferences)
        
        # 여기에 soohwan만의 개선사항 추가
        my_improvements = """
여기에 soohwan만의 개선사항을 추가해보세요:
- 더 구체적인 영양소 가이드라인
- 한국 음식 활용법
- 조리 시간 고려
- 식재료 구입 팁
- 계절별 추천사항
"""
        
        return base_message + my_improvements

    def get_model_config(self) -> Dict[str, Any]:
        return {
            "model": "gpt-4o-mini",
            "max_tokens": 700,  # 필요에 따라 조정
            "temperature": 0.6  # soohwan이 원하는 값으로 조정
        }

# 실험할 때 이 부분을 team_prompts.py에 추가하세요:
# TEAM_PROMPTS["soohwan"] = {
#     "menu_analysis": SoohwanMenuAnalysisPrompt(),
#     "meal_plan": SoohwanMealPlanPrompt()
# }
