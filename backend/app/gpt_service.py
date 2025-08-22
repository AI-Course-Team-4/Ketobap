"""
GPT API 연동 서비스
키토 점수 계산, 메인/사이드 구분, 식단 추천 기능
"""
import openai
import json
import os
from typing import Dict, List
import asyncio
from dotenv import load_dotenv

# .env 파일에서 환경변수 로드
load_dotenv()

# OpenAI API 키 확인
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("❌ OPENAI_API_KEY 환경변수가 설정되지 않았습니다!")
    print("환경변수를 확인하거나 .env 파일을 생성해주세요.")
else:
    print("✅ OPENAI_API_KEY 환경변수 로드 완료")

class GPTService:
    """GPT API를 활용한 키토 관련 서비스"""
    
    @staticmethod
    async def analyze_menu(menu_name: str) -> Dict:
        """
        메뉴명을 분석하여 키토 점수와 메인/사이드 구분을 반환
        
        Args:
            menu_name: 분석할 메뉴명
            
        Returns:
            {"keto_score": int, "is_main": bool}
        """
        prompt = f"""
메뉴명: "{menu_name}"

다음 두 가지를 판단해주세요:
1. 키토 친화도를 0-100점으로 평가 (탄수화물 적을수록, 지방 많을수록 높은 점수)
2. 메인메뉴인지 사이드메뉴인지 구분 (main/side)

평가 기준:
- 키토 점수: 쌀/면/빵/설탕 포함시 낮은 점수, 고기/생선/채소/지방 위주시 높은 점수
- 메뉴 구분: 주식이 되는 메뉴는 main, 반찬이나 간식은 side

JSON 형태로만 응답해주세요:
{{"keto_score": 점수숫자, "menu_type": "main"또는"side"}}
"""
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_API_KEY)
            
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "당신은 키토 다이어트 전문가입니다. 정확하고 일관된 평가를 해주세요."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=100,
                temperature=0.3
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # JSON 파싱 시도
            try:
                result = json.loads(result_text)
                keto_score = int(result.get("keto_score", 50))
                is_main = result.get("menu_type", "main") == "main"
                
                return {
                    "keto_score": max(0, min(100, keto_score)),  # 0-100 범위 보장
                    "is_main": is_main
                }
            except json.JSONDecodeError:
                print(f"⚠️  JSON 파싱 실패: {result_text}")
                # 기본값 반환
                return {"keto_score": 50, "is_main": True}
                
        except Exception as e:
            print(f"❌ GPT API 호출 실패: {e}")
            # 기본값 반환
            return {"keto_score": 50, "is_main": True}
    
    @staticmethod
    async def recommend_meal_plan(preferences: Dict) -> Dict:
        """
        사용자 선호도를 바탕으로 키토 식단을 추천
        
        Args:
            preferences: {"preferred_foods": [], "disliked_foods": [], "allergies": []}
            
        Returns:
            키토 식단 추천 결과
        """
        preferred = ", ".join(preferences.get("preferred_foods", []))
        disliked = ", ".join(preferences.get("disliked_foods", []))
        allergies = ", ".join(preferences.get("allergies", []))
        
        prompt = f"""
사용자 정보:
- 선호 음식: {preferred if preferred else "없음"}
- 비선호 음식: {disliked if disliked else "없음"}
- 알레르기: {allergies if allergies else "없음"}

위 정보를 바탕으로 키토 다이어트에 적합한 하루 식단을 추천해주세요.

요구사항:
- 아침, 점심, 저녁으로 구분
- 각 식사마다 탄수화물 15g 이하, 지방 비율 70% 이상
- 사용자의 알레르기 식품은 절대 포함하지 말 것
- 비선호 음식은 가능한 피할 것
- 선호 음식을 적극 활용할 것
- 간단한 조리법 포함

반드시 아래 JSON 형태로만 응답해주세요 (다른 텍스트 없이):
{{
  "breakfast": {{
    "name": "메뉴명",
    "ingredients": ["재료1", "재료2"],
    "cooking_method": "조리법",
    "carbs": "탄수화물g",
    "fat": "지방g", 
    "protein": "단백질g"
  }},
  "lunch": {{
    "name": "메뉴명",
    "ingredients": ["재료1", "재료2"],
    "cooking_method": "조리법",
    "carbs": "탄수화물g",
    "fat": "지방g", 
    "protein": "단백질g"
  }},
  "dinner": {{
    "name": "메뉴명",
    "ingredients": ["재료1", "재료2"],
    "cooking_method": "조리법",
    "carbs": "탄수화물g",
    "fat": "지방g", 
    "protein": "단백질g"
  }}
}}

중요: 반드시 breakfast, lunch, dinner 모두 포함하고, 각각 name, ingredients, cooking_method, carbs, fat, protein 필드를 모두 포함해야 합니다.
"""
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_API_KEY)
            
            response = await asyncio.to_thread(
                client.chat.completions.create,
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "당신은 키토 다이어트 전문 영양사입니다. 개인의 선호도를 고려한 맞춤 식단을 제공해주세요."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            result_text = response.choices[0].message.content.strip()
            
            try:
                # JSON 텍스트 정리 및 수정
                cleaned_text = GPTService._clean_json_response(result_text)
                parsed_result = json.loads(cleaned_text)
                
                # JSON 구조 유효성 검사
                if GPTService._validate_meal_plan_structure(parsed_result):
                    return parsed_result
                else:
                    print(f"⚠️  식단 추천 JSON 구조가 올바르지 않습니다: {cleaned_text}")
                    return GPTService._get_fallback_meal_plan()
                    
            except json.JSONDecodeError as e:
                print(f"⚠️  식단 추천 JSON 파싱 실패: {result_text}")
                print(f"파싱 오류 상세: {e}")
                return GPTService._get_fallback_meal_plan()
                
        except Exception as e:
            error_msg = str(e)
            print(f"❌ GPT 식단 추천 실패: {e}")
            
            # OpenAI API 에러 타입별 메시지 처리
            if "insufficient_quota" in error_msg or "429" in error_msg:
                return {
                    "error": "OpenAI API 할당량이 초과되었습니다. 계정의 사용량과 결제 정보를 확인해주세요."
                }
            elif "invalid_api_key" in error_msg or "401" in error_msg:
                return {
                    "error": "OpenAI API 키가 유효하지 않습니다. API 키를 확인해주세요."
                }
            else:
                return {
                    "error": f"식단 추천 서비스에 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                }
    
    @staticmethod
    def _clean_json_response(text: str) -> str:
        """
        GPT 응답에서 JSON 부분만 추출하고 정리
        """
        # JSON 코드블록 제거
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        
        # 앞뒤 공백 제거
        text = text.strip()
        
        # 불완전한 JSON 구조 수정 시도
        if text.count("{") > text.count("}"):
            # 부족한 닫는 중괄호 추가
            missing_braces = text.count("{") - text.count("}")
            text += "}" * missing_braces
        
        return text
    
    @staticmethod
    def _validate_meal_plan_structure(data: Dict) -> bool:
        """
        식단 추천 JSON 구조가 올바른지 검사
        """
        required_meals = ["breakfast", "lunch", "dinner"]
        required_fields = ["name", "ingredients", "cooking_method", "carbs", "fat", "protein"]
        
        try:
            for meal in required_meals:
                if meal not in data:
                    return False
                
                meal_data = data[meal]
                if not isinstance(meal_data, dict):
                    return False
                
                for field in required_fields:
                    if field not in meal_data:
                        return False
                    
                    # ingredients는 리스트여야 함
                    if field == "ingredients" and not isinstance(meal_data[field], list):
                        return False
            
            return True
        except:
            return False
    
    @staticmethod
    def _get_fallback_meal_plan() -> Dict:
        """
        파싱 실패시 사용할 기본 식단 계획
        """
        return {
            "breakfast": {
                "name": "아보카도 계란 샐러드",
                "ingredients": ["계란 2개", "아보카도 1개", "올리브오일 1큰술", "소금", "후추"],
                "cooking_method": "계란을 삶아 껍질을 벗기고 잘게 썹니다. 아보카도를 반으로 잘라 과육을 떠내어 계란과 섞고 올리브오일, 소금, 후추로 간합니다.",
                "carbs": "6g",
                "fat": "28g",
                "protein": "14g"
            },
            "lunch": {
                "name": "연어 구이와 시금치 샐러드",
                "ingredients": ["연어 150g", "시금치 100g", "올리브오일 2큰술", "레몬즙", "소금", "후추"],
                "cooking_method": "팬에 연어를 구워줍니다. 시금치는 살짝 데쳐서 올리브오일, 레몬즙, 소금, 후추로 무쳐줍니다.",
                "carbs": "4g",
                "fat": "32g",
                "protein": "28g"
            },
            "dinner": {
                "name": "치킨 가슴살 스테이크와 브로콜리",
                "ingredients": ["치킨 가슴살 150g", "브로콜리 100g", "버터 2큰술", "마늘 2쪽", "소금", "후추"],
                "cooking_method": "치킨 가슴살에 소금, 후추로 간하고 팬에 구워줍니다. 브로콜리는 찜기에 쪄서 버터와 마늘로 볶아줍니다.",
                "carbs": "8g",
                "fat": "26g",
                "protein": "32g"
            }
        }

# 사용 예시
if __name__ == "__main__":
    async def test():
        service = GPTService()
        
        # 메뉴 분석 테스트
        result = await service.analyze_menu("고에몬 미니 샐러드")
        print(f"메뉴 분석 결과: {result}")
        
        # 식단 추천 테스트
        preferences = {
            "preferred_foods": ["계란", "아보카도", "연어"],
            "disliked_foods": ["브로콜리"],
            "allergies": ["견과류"]
        }
        meal_plan = await service.recommend_meal_plan(preferences)
        print(f"식단 추천 결과: {meal_plan}")
    
    # asyncio.run(test())
