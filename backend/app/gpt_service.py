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
from .prompts.team_prompts import get_prompt_set

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
    
    def __init__(self, team_member: str = "default"):
        """
        Args:
            team_member: 사용할 프롬프트 세트 (default, improved, 또는 팀원명)
        """
        self.prompts = get_prompt_set(team_member)
        self.team_member = team_member
    
    async def analyze_menu(self, menu_name: str) -> Dict:
        """
        메뉴명을 분석하여 키토 점수와 메인/사이드 구분을 반환
        
        Args:
            menu_name: 분석할 메뉴명
            
        Returns:
            {"keto_score": int, "is_main": bool}
        """
        menu_prompt = self.prompts["menu_analysis"]
        system_message = menu_prompt.get_system_message()
        user_message = menu_prompt.format_user_message(menu_name=menu_name)
        model_config = menu_prompt.get_model_config()
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_API_KEY)
            
            response = await asyncio.to_thread(
                client.chat.completions.create,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                **model_config
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
    
    async def recommend_meal_plan(self, preferences: Dict) -> Dict:
        """
        사용자 선호도를 바탕으로 키토 식단을 추천
        
        Args:
            preferences: {"preferred_foods": [], "disliked_foods": [], "allergies": []}
            
        Returns:
            키토 식단 추천 결과
        """
        meal_prompt = self.prompts["meal_plan"]
        system_message = meal_prompt.get_system_message()
        user_message = meal_prompt.format_user_message(preferences)
        model_config = meal_prompt.get_model_config()
        
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_API_KEY)
            
            response = await asyncio.to_thread(
                client.chat.completions.create,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                **model_config
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
        # 기본 프롬프트로 테스트
        service = GPTService("default")
        
        # 메뉴 분석 테스트
        result = await service.analyze_menu("고에몬 미니 샐러드")
        print(f"메뉴 분석 결과: {result}")
        
        # 개선된 프롬프트로 테스트
        improved_service = GPTService("improved")
        result2 = await improved_service.analyze_menu("고에몬 미니 샐러드")
        print(f"개선된 메뉴 분석 결과: {result2}")
        
        # 식단 추천 테스트
        preferences = {
            "preferred_foods": ["계란", "아보카도", "연어"],
            "disliked_foods": ["브로콜리"],
            "allergies": ["견과류"]
        }
        meal_plan = await service.recommend_meal_plan(preferences)
        print(f"식단 추천 결과: {meal_plan}")
    
    # asyncio.run(test())
