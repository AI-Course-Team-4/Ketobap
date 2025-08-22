"""
기본 프롬프트 템플릿들
각 팀원이 개별적으로 수정할 수 있도록 구조화
"""
from abc import ABC, abstractmethod
from typing import Dict, Any

class BasePromptTemplate(ABC):
    """프롬프트 템플릿 기본 클래스"""
    
    @abstractmethod
    def get_system_message(self) -> str:
        """시스템 메시지 반환"""
        pass
    
    @abstractmethod
    def format_user_message(self, **kwargs) -> str:
        """사용자 메시지 포맷팅"""
        pass
    
    @abstractmethod
    def get_model_config(self) -> Dict[str, Any]:
        """모델 설정 반환"""
        pass

class MenuAnalysisPrompt(BasePromptTemplate):
    """메뉴 분석용 프롬프트 - 기본 버전"""
    
    def get_system_message(self) -> str:
        return """당신은 키토 다이어트 전문가입니다. 
음식의 키토 친화도를 정확하고 일관되게 평가해주세요.

키토 점수 계산 공식 (하루 탄수화물 총량 고려):
1. 기본 점수 = 100점
2. 키토 한끼 탄수화물 기준: 하루 30g ÷ 3끼 = 10g/끼
3. 탄수화물 평가:
   - 5g 이하: +10점 보너스 (키토 완벽)
   - 6-10g: 기본 점수 유지 (키토 적합)
   - 11-15g: -2점/g 차감 (주의 구간)
   - 16-25g: -4점/g 차감 (키토 위험)
   - 25g 초과: -6점/g 차감 + 추가 -30점 (키토 불가)
4. 단백질 1g당 +0.2점 추가  
5. 지방 1g당 +0.3점 추가
6. 설탕/전분/밀가루 포함시 -25점 차감
7. 발효식품(김치, 된장) +5점 보너스

키토 끼니별 점수 기준표 (하루 30g 3등분 기준):
- 100점+: 완벽한 키토 (5g 이하) - 아보카도+계란, 삼겹살 구이
- 90-99점: 우수한 키토 (6-10g) - 연어+시금치, 치킨+브로콜리  
- 70-89점: 적합한 키토 (11-15g) - 견과류 샐러드, 치즈+채소
- 40-69점: 주의 구간 (16-25g) - 과일 포함 요리, 뿌리채소
- 0-39점: 키토 불가 (25g+) - 밥/면/빵 포함 요리

하루 탄수화물 관리 관점:
- 이 끼니가 하루 30g 한도의 1/3인 10g 이하인가?
- 나머지 두 끼니에서 키토 유지 여유분이 있는가?
- 키토시스(지방연소모드) 유지에 도움이 되는가?
- 하루 총 탄수화물이 50g를 넘지 않도록 도와주는가?

메뉴 구분:
- main: 주식이 되는 메뉴 (한끼 식사의 중심, 300kcal 이상)
- side: 반찬, 간식, 음료류 (보조적 역할, 300kcal 미만)"""

    def format_user_message(self, menu_name: str) -> str:
        return f"""메뉴명: "{menu_name}"

단계별 분석 과정:
1. 주재료의 영양성분 확인 (탄수화물, 단백질, 지방)
2. 조리법 분석 (기름 사용, 설탕 첨가 등)
3. 숨은 탄수화물 체크 (소스, 양념, 코팅 등)
4. 키토 점수 계산 공식 적용
5. 메뉴 타입 분류 (칼로리와 역할 기준)

구체적 계산 예시 (하루 30g 탄수 기준):
- "삼겹살 구이": 100점 + 0g탄수(+10점 보너스) + 25g단백질×0.2 + 30g지방×0.3 = 100 + 10 + 5 + 9 = 124점 → 100점(최대치), main
- "김치": 100점 + 5g탄수(+10점 보너스) + 발효식품 보너스 +5 = 100 + 10 + 5 = 115점 → 100점(최대치), side  
- "아몬드 30g": 100점 + 6g탄수(기본 유지) + 6g단백질×0.2 + 14g지방×0.3 = 100 + 0 + 1.2 + 4.2 = 105.4점 → 100점, side
- "사과 1개": 100점 + 25g탄수(-6×25-30=-180점) = 100-180 = -80점 → 0점(최소치), side
- "떡볶이": 100점 + 45g탄수(-6×45-30=-300점) + 전분 페널티(-25점) = 100-300-25 = -225점 → 0점(최소치), main

메뉴: "{menu_name}"의 분석 결과를 JSON으로:
{{"keto_score": 점수, "menu_type": "main"또는"side"}}"""

    def get_model_config(self) -> Dict[str, Any]:
        return {
            "model": "gpt-4o-mini",
            "max_tokens": 100,
            "temperature": 0.1  # 일관성을 위해 낮은 temperature
        }

class MealPlanPrompt(BasePromptTemplate):
    """식단 추천용 프롬프트 - 기본 버전"""
    
    def get_system_message(self) -> str:
        return """당신은 키토 다이어트 전문 영양사입니다.
한국인의 식습관을 고려한 실용적인 키토 식단을 추천해주세요.

키토 다이어트 원칙:
- 탄수화물: 총 칼로리의 5-10% (하루 20-50g)
- 지방: 총 칼로리의 70-80%
- 단백질: 총 칼로리의 15-25%

한국 음식 활용:
- 밥/면/떡 → 두부, 콜리플라워 라이스로 대체
- 김치, 나물 등 발효 채소 적극 활용
- 한국식 구이, 찌개류 (설탕 제외) 추천"""

    def format_user_message(self, preferences: Dict) -> str:
        preferred = ", ".join(preferences.get("preferred_foods", []))
        disliked = ", ".join(preferences.get("disliked_foods", []))
        allergies = ", ".join(preferences.get("allergies", []))
        
        return f"""사용자 정보:
- 선호: {preferred or "없음"}
- 비선호: {disliked or "없음"}  
- 알레르기: {allergies or "없음"}

키토 하루 식단을 추천해주세요.

JSON 형태로만 응답:
{{
  "breakfast": {{
    "name": "메뉴명",
    "ingredients": ["재료1", "재료2"],
    "cooking_method": "간단한 조리법",
    "carbs": "5g",
    "fat": "25g", 
    "protein": "15g"
  }},
  "lunch": {{ 동일 구조 }},
  "dinner": {{ 동일 구조 }}
}}

알레르기 식품은 절대 제외하고, 선호 음식을 최대한 활용해주세요."""

    def get_model_config(self) -> Dict[str, Any]:
        return {
            "model": "gpt-4o-mini",
            "max_tokens": 600,
            "temperature": 0.7
        }
