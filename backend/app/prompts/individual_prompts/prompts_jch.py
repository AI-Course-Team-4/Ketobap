from ..base_prompts import MenuAnalysisPrompt, MealPlanPrompt
from typing import Dict, Any

class JCHMenuAnalysisPrompt(MenuAnalysisPrompt):
    """운동하는 사람을 위한 키토 분석 프롬프트"""

    def get_system_message(self) -> str:
        return """당신은 운동하는 사람들을 위한 키토 식단 전문가입니다.

[요청 사항]
- 단백질이 충분히 포함된 메뉴를 더 높게 평가해주세요.
- 탄수화물은 10g 이하일수록 좋지만, 단백질/지방 균형도 고려해주세요.
- 운동 전후 섭취에 적합한지 여부도 판단해주세요.
- 설탕, 전분, 튀김 재료는 점수를 낮춰주세요."""

    def format_user_message(self, menu_name: str) -> str:
        return f"""
메뉴명: "{menu_name}"

1. 주재료 영양 정보 확인 (탄수화물, 단백질, 지방)
2. 운동 전/후 식사로 적합한지 평가
3. 설탕/전분/튀김 여부 확인
4. 키토 점수 계산
5. 메뉴 타입 분류 (main 또는 side)

JSON 결과로만 응답:
{{"keto_score": 0~100, "menu_type": "main 또는 side"}}"""

    def get_model_config(self) -> Dict[str, Any]:
        return {
            "model": "gpt-4o-mini",
            "max_tokens": 150,
            "temperature": 0.3
        }

class JCHMealPlanPrompt(MealPlanPrompt):
    """운동하는 사람을 위한 키토 식단 추천 프롬프트"""

    def get_system_message(self) -> str:
        return """당신은 운동하는 사람을 위한 키토 영양사입니다.

[식단 설계 기준]
- 단백질 비율을 높이고, 탄수화물은 10g 이하로 유지
- 운동 전: 소화 잘되는 메뉴
- 운동 후: 회복을 위한 고단백 식단
- 지방은 에너지원으로 활용
- 한국 재료와 간단한 조리법 사용"""

    def format_user_message(self, preferences: Dict) -> str:
        preferred = ", ".join(preferences.get("preferred_foods", []))
        disliked = ", ".join(preferences.get("disliked_foods", []))
        allergies = ", ".join(preferences.get("allergies", []))

        return f"""
[사용자 정보]
- 선호: {preferred or "없음"}
- 비선호: {disliked or "없음"}
- 알레르기: {allergies or "없음"}

[요청]
- 운동 전/후로 적합한 키토 하루 식단
- 조리 간단하고 영양소 균형 고려
- 아침/점심/저녁 나눠서 제안

JSON만 응답:
{{
  "breakfast": {{
    "name": "메뉴명",
    "ingredients": ["재료1", "재료2"],
    "cooking_method": "간단한 조리법",
    "carbs": "g",
    "fat": "g",
    "protein": "g"
  }},
  "lunch": {{ ... }},
  "dinner": {{ ... }}
}}"""

    def get_model_config(self) -> Dict[str, Any]:
        return {
            "model": "gpt-4o-mini",
            "max_tokens": 700,
            "temperature": 0.5
        }
