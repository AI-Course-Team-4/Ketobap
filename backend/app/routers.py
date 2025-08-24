"""
API 라우터 - 모든 엔드포인트 정의
PRD에 따른 3개의 핵심 API 구현
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from pydantic import BaseModel
import random

from .database import get_db, Restaurant, Menu
# Note: foods 테이블은 아직 데이터가 없으므로 빈 응답 반환
from .gpt_service import GPTService
from .config import get_current_prompt

router = APIRouter()

# Pydantic 모델 정의 (요청/응답 스키마)

class RestaurantResponse(BaseModel):
    """식당 목록 응답 모델"""
    id: int
    name: str
    link: str = None
    
    class Config:
        from_attributes = True

class MenuResponse(BaseModel):
    """메뉴 응답 모델"""
    id: int
    name: str
    keto_score: int
    is_main: bool
    
    class Config:
        from_attributes = True

class RestaurantMenuResponse(BaseModel):
    """식당 메뉴 조합 응답 모델"""
    id: int
    menu_name: str
    keto_score: int
    is_main: bool
    restaurant_name: str
    link: str = None
    phone: str = None
    address: str = None
    
    class Config:
        from_attributes = True
        
    @classmethod
    def from_db_row(cls, row):
        """데이터베이스 row를 모델로 변환"""
        return cls(
            id=row[0],
            menu_name=row[1],
            keto_score=row[2],
            is_main=row[3],
            restaurant_name=row[4],
            link=row[5],
            phone=row[6],
            address=row[7]
        )

class MenuListResponse(BaseModel):
    """메뉴 목록 응답 모델 (필터링 정보 포함)"""
    menus: List[MenuResponse]
    total_filtered: int
    filter_applied: Dict

class MealRecommendationRequest(BaseModel):
    """식단 추천 요청 모델"""
    preferred_foods: List[str] = []
    disliked_foods: List[str] = []
    allergies: List[str] = []

# API 엔드포인트 구현

@router.get("/restaurants/top")
async def get_top_keto_menus(
    limit: int = Query(default=5, description="반환할 메뉴 개수"),
    db: Session = Depends(get_db)
):
    """
    키토 점수가 높은 메인 메뉴 목록 조회
    is_main = 1인 메뉴만 키토 점수 순으로 반환
    """
    try:
        # JOIN을 사용하여 메뉴와 식당 정보를 함께 조회
        results = db.query(
            Menu.id,
            Menu.name.label('menu_name'),
            Menu.keto_score,
            Menu.is_main,
            Restaurant.name.label('restaurant_name'),
            Restaurant.link,
            Restaurant.phone,
            Restaurant.address
        ).join(Restaurant, Menu.restaurant_id == Restaurant.id).filter(
            Menu.is_main == True  # 메인 메뉴만
        ).order_by(Menu.keto_score.desc()).limit(limit).all()
        
        # 결과를 딕셔너리로 변환
        return [
            {
                "id": result[0],
                "menu_name": result[1],
                "keto_score": result[2],
                "is_main": bool(result[3]),
                "restaurant_name": result[4],
                "link": result[5],
                "phone": result[6],
                "address": result[7]
            }
            for result in results
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")

@router.get("/restaurants", response_model=List[RestaurantResponse])
async def get_restaurants(db: Session = Depends(get_db)):
    """
    식당 목록 조회 API
    키토 점수 높은 순으로 정렬된 식당 리스트 반환
    """
    try:
        # 각 식당의 평균 키토 점수를 계산하여 정렬
        restaurants = db.query(Restaurant).join(Menu).group_by(Restaurant.id).order_by(
            func.avg(Menu.keto_score).desc()
        ).all()
        
        if not restaurants:
            raise HTTPException(status_code=404, detail="등록된 식당이 없습니다")
        
        return restaurants
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")

@router.get("/restaurants/{restaurant_id}/menus", response_model=MenuListResponse)
async def get_restaurant_menus(
    restaurant_id: int,
    min_keto_score: int = Query(default=60, description="최소 키토 점수"),
    limit: int = Query(default=100, description="최대 출력 개수"),
    db: Session = Depends(get_db)
):
    """
    식당별 메뉴 조회 API
    키토 점수 60점 이상 메인 메뉴 모두 반환
    """
    try:
        # 식당 존재 여부 확인
        restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
        if not restaurant:
            raise HTTPException(status_code=404, detail="해당 식당을 찾을 수 없습니다")
        
        # 필터링 조건에 맞는 메뉴 조회
        filtered_menus = db.query(Menu).filter(
            Menu.restaurant_id == restaurant_id,
            Menu.keto_score >= min_keto_score,
            Menu.is_main == True  # 메인 메뉴만
        ).all()
        
        # 랜덤으로 섞어서 limit 개수만큼 선택
        if len(filtered_menus) > limit:
            selected_menus = random.sample(filtered_menus, limit)
        else:
            selected_menus = filtered_menus
        
        # 키토 점수 순으로 정렬
        selected_menus.sort(key=lambda x: x.keto_score, reverse=True)
        
        return MenuListResponse(
            menus=selected_menus,
            total_filtered=len(selected_menus),
            filter_applied={
                "min_keto_score": min_keto_score,
                "only_main_menus": True,
                "limit": limit
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")

@router.post("/recommend-meal")
async def recommend_meal(request: MealRecommendationRequest):
    """
    GPT 기반 키토 식단 추천 API
    사용자 선호도를 바탕으로 개인맞춤 키토 식단 추천
    """
    try:
        # 입력값 검증
        if not any([request.preferred_foods, request.disliked_foods, request.allergies]):
            raise HTTPException(
                status_code=400, 
                detail="선호 음식, 비선호 음식, 알레르기 중 최소 하나는 입력해주세요"
            )
        
        # GPT 서비스를 통한 식단 추천 (개별 프롬프트 테스트 가능)
        # config.py에서 CURRENT_PROMPT를 바꿔서 다른 프롬프트 테스트
        current_prompt_version = get_current_prompt()
        gpt_service = GPTService(current_prompt_version)
        preferences = {
            "preferred_foods": request.preferred_foods,
            "disliked_foods": request.disliked_foods,
            "allergies": request.allergies
        }
        
        print(f"🔄 새로운 식단 요청 (프롬프트: {current_prompt_version})")
        
        # 메뉴명 다양성을 위한 랜덤 시드 추가
        import random
        import time
        
        def add_randomness_to_preferences(prefs):
            # 타임스탬프와 랜덤 요소를 추가해서 GPT가 다른 결과를 생성하도록 유도
            timestamp = str(int(time.time() * 1000))  # 밀리초까지 사용
            random_number = random.randint(100, 999)
            
            styles = [
                "창의적이고 독특한", "새롭고 혁신적인", "특별하고 다른", 
                "독창적이고 흥미로운", "매력적이고 신선한", "참신하고 유니크한",
                "이국적이고 특색있는", "정통하면서도 새로운", "실험적이고 도전적인"
            ]
            
            cooking_methods = [
                "그릴 요리", "팬프라이 요리", "로스팅 요리", "브레이징 요리",
                "스팀 요리", "스모킹 요리", "컨핏 요리", "수비드 요리"
            ]
            
            style = random.choice(styles)
            method = random.choice(cooking_methods)
            
            prefs_copy = prefs.copy()
            prefs_copy["diversity_seed"] = f"{style} {method} 스타일로 #{random_number}{timestamp[-4:]}"
            return prefs_copy
        
        # 다양성을 위한 선호도 수정
        diverse_preferences = add_randomness_to_preferences(preferences)
        print(f"🎲 다양성 시드: {diverse_preferences.get('diversity_seed', '없음')}")
        meal_plan = await gpt_service.recommend_meal_plan(diverse_preferences)
        
        # 에러 체크
        if "error" in meal_plan:
            raise HTTPException(status_code=500, detail=meal_plan["error"])
        
        print(f"✅ GPT 응답 완료:")
        if "breakfast" in meal_plan:
            print(f"   아침: {meal_plan['breakfast'].get('name', '이름없음')}")
        if "lunch" in meal_plan:
            print(f"   점심: {meal_plan['lunch'].get('name', '이름없음')}")
        if "dinner" in meal_plan:
            print(f"   저녁: {meal_plan['dinner'].get('name', '이름없음')}")
        else:
            print(f"   전체 응답: {meal_plan}")
        
        # 키토 점수 검증 (75점 미만이면 재생성)
        def calculate_keto_score(meal_item):
            try:
                # 영양소에서 숫자 추출
                carbs = float(meal_item.get("carbs", "0").replace("g", ""))
                fat = float(meal_item.get("fat", "0").replace("g", ""))  
                protein = float(meal_item.get("protein", "0").replace("g", ""))
                
                total_calories = (carbs * 4) + (fat * 9) + (protein * 4)
                if total_calories == 0:
                    return 0
                    
                fat_ratio = (fat * 9) / total_calories
                carb_ratio = (carbs * 4) / total_calories  
                protein_ratio = (protein * 4) / total_calories
                
                score = 0
                # 지방 비율 점수 (40점)
                if fat_ratio >= 0.72 and fat_ratio <= 0.78:
                    score += 40
                elif fat_ratio >= 0.68 and fat_ratio <= 0.82:
                    score += 35
                elif fat_ratio >= 0.60:
                    score += max(0, 30 - abs(fat_ratio - 0.725) * 100)
                else:
                    score += fat_ratio * 50
                
                # 탄수화물 비율 점수 (35점)
                if carb_ratio <= 0.03:
                    score += 35
                elif carb_ratio <= 0.08:
                    score += 35
                elif carb_ratio <= 0.15:
                    score += 20
                else:
                    score += max(0, 20 - (carb_ratio - 0.15) * 200)
                
                # 단백질 비율 점수 (25점)
                if protein_ratio >= 0.22 and protein_ratio <= 0.25:
                    score += 25
                elif protein_ratio >= 0.18 and protein_ratio <= 0.28:
                    score += 20
                elif protein_ratio >= 0.15 and protein_ratio <= 0.32:
                    score += 15
                elif protein_ratio < 0.15:
                    score += max(0, 15 - (0.15 - protein_ratio) * 100)
                else:
                    score += max(0, 15 - (protein_ratio - 0.3) * 100)
                
                return min(100, max(0, score))
            except:
                return 0
        
        # 각 끼니의 키토 점수 확인
        breakfast_score = calculate_keto_score(meal_plan.get("breakfast", {}))
        lunch_score = calculate_keto_score(meal_plan.get("lunch", {}))  
        dinner_score = calculate_keto_score(meal_plan.get("dinner", {}))
        
        # 키토 비율도 확인
        def check_keto_ratio(meal_item):
            try:
                carbs = float(meal_item.get("carbs", "0").replace("g", ""))
                fat = float(meal_item.get("fat", "0").replace("g", ""))
                protein = float(meal_item.get("protein", "0").replace("g", ""))
                
                total_calories = (carbs * 4) + (fat * 9) + (protein * 4)
                if total_calories == 0:
                    return False
                    
                fat_ratio = (fat * 9) / total_calories
                carb_ratio = (carbs * 4) / total_calories
                protein_ratio = (protein * 4) / total_calories
                
                # 키토 비율 기준: 지방 68%+, 탄수화물 12%-, 단백질 18-25%
                return (fat_ratio >= 0.68 and carb_ratio <= 0.12 and 
                       protein_ratio >= 0.18 and protein_ratio <= 0.25)
            except:
                return False
        
        # 비율 체크
        breakfast_ratio_ok = check_keto_ratio(meal_plan.get("breakfast", {}))
        lunch_ratio_ok = check_keto_ratio(meal_plan.get("lunch", {}))
        dinner_ratio_ok = check_keto_ratio(meal_plan.get("dinner", {}))
        
        # 선호 음식 중복 체크
        def check_ingredient_duplicates(meal_plan):
            breakfast_ingredients = meal_plan.get("breakfast", {}).get("ingredients", [])
            lunch_ingredients = meal_plan.get("lunch", {}).get("ingredients", [])
            dinner_ingredients = meal_plan.get("dinner", {}).get("ingredients", [])
            
            # 모든 재료를 소문자로 변환하여 비교
            all_ingredients = []
            for ingredients in [breakfast_ingredients, lunch_ingredients, dinner_ingredients]:
                all_ingredients.extend([ing.lower() for ing in ingredients])
            
            # 중복 재료 찾기 (2번 이상 나오는 재료)
            duplicates = []
            for ingredient in set(all_ingredients):
                if all_ingredients.count(ingredient) >= 2:
                    duplicates.append(ingredient)
            
            return len(duplicates) == 0  # 중복이 없으면 True
        
        # 평균 점수 70점 이상 AND 최소 2끼는 완벽한 키토 비율 AND 재료 중복 없음
        avg_score = (breakfast_score + lunch_score + dinner_score) / 3
        ratio_count = sum([breakfast_ratio_ok, lunch_ratio_ok, dinner_ratio_ok])
        no_duplicates = check_ingredient_duplicates(meal_plan)
        retry_count = 0
        
        # 이미 위에서 diverse_preferences 설정됨
        
        while (avg_score < 70 or ratio_count < 2 or not no_duplicates) and retry_count < 2:
            duplicate_msg = "" if no_duplicates else " (재료 중복 있음)"
            print(f"키토 기준 미달 (평균 {avg_score:.1f}점, 완벽한 비율 {ratio_count}/3끼{duplicate_msg}). 재생성 중... ({retry_count + 1}/2)")
            
            # 재생성 시에도 다양성 시드 업데이트
            diverse_preferences = add_randomness_to_preferences(preferences)
            meal_plan = await gpt_service.recommend_meal_plan(diverse_preferences)
            if "error" in meal_plan:
                break
                
            breakfast_score = calculate_keto_score(meal_plan.get("breakfast", {}))
            lunch_score = calculate_keto_score(meal_plan.get("lunch", {}))
            dinner_score = calculate_keto_score(meal_plan.get("dinner", {}))
            avg_score = (breakfast_score + lunch_score + dinner_score) / 3
            
            breakfast_ratio_ok = check_keto_ratio(meal_plan.get("breakfast", {}))
            lunch_ratio_ok = check_keto_ratio(meal_plan.get("lunch", {}))
            dinner_ratio_ok = check_keto_ratio(meal_plan.get("dinner", {}))
            ratio_count = sum([breakfast_ratio_ok, lunch_ratio_ok, dinner_ratio_ok])
            
            no_duplicates = check_ingredient_duplicates(meal_plan)
            
            retry_count += 1
        
        return {
            "meal_plan": meal_plan,
            "user_preferences": preferences,
            "generated_at": "실시간 생성됨",
            "prompt_info": {
                "used_prompt": current_prompt_version,
                "message": f"{current_prompt_version}의 프롬프트 적용중.."
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"식단 추천 실패: {str(e)}")

# 추가 유틸리티 엔드포인트

@router.get("/restaurants/{restaurant_id}")
async def get_restaurant_detail(restaurant_id: int, db: Session = Depends(get_db)):
    """식당 상세 정보 조회"""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="해당 식당을 찾을 수 없습니다")
    
    # 해당 식당의 메뉴 개수와 평균 키토 점수 계산
    menu_stats = db.query(
        func.count(Menu.id).label("total_menus"),
        func.avg(Menu.keto_score).label("avg_keto_score")
    ).filter(Menu.restaurant_id == restaurant_id).first()
    
    return {
        "restaurant": restaurant,
        "stats": {
            "total_menus": menu_stats.total_menus or 0,
            "avg_keto_score": round(menu_stats.avg_keto_score or 0, 1)
        }
    }

@router.get("/restaurants/search")
async def search_restaurant_menus(
    minKetoScore: int = Query(default=None, description="최소 키토 점수"),
    db: Session = Depends(get_db)
):
    """
    필터 조건에 맞는 메인 메뉴 검색
    """
    try:
        # 기본 쿼리 - 메인 메뉴만
        query = db.query(
            Menu.id,
            Menu.name.label('menu_name'),
            Menu.keto_score,
            Menu.is_main,
            Restaurant.name.label('restaurant_name'),
            Restaurant.link,
            Restaurant.phone,
            Restaurant.address
        ).join(Restaurant, Menu.restaurant_id == Restaurant.id).filter(
            Menu.is_main == True
        )
        
        # 키토 점수 필터 적용
        if minKetoScore is not None:
            query = query.filter(Menu.keto_score >= minKetoScore)
        
        results = query.order_by(Menu.keto_score.desc()).all()
        
        # 결과를 딕셔너리로 변환
        return [
            {
                "id": result[0],
                "menu_name": result[1],
                "keto_score": result[2],
                "is_main": bool(result[3]),
                "restaurant_name": result[4],
                "link": result[5],
                "phone": result[6],
                "address": result[7]
            }
            for result in results
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 오류: {str(e)}")

@router.get("/foods")
async def get_all_foods():
    """
    모든 음식 데이터 조회 (현재 foods 테이블이 비어있으므로 빈 배열 반환)
    """
    return []

@router.get("/foods/search")
async def search_foods():
    """
    음식 검색 (현재 foods 테이블이 비어있으므로 빈 배열 반환)
    """
    return []

@router.get("/foods/{food_id}")
async def get_food_by_id(food_id: int):
    """
    특정 음식 조회 (현재 foods 테이블이 비어있으므로 null 반환)
    """
    return None

@router.get("/stats")
async def get_system_stats(db: Session = Depends(get_db)):
    """시스템 통계 정보"""
    restaurant_count = db.query(func.count(Restaurant.id)).scalar()
    menu_count = db.query(func.count(Menu.id)).scalar()
    high_keto_menus = db.query(func.count(Menu.id)).filter(Menu.keto_score >= 70).scalar()
    
    # 평균 키토 점수 계산
    avg_keto_score = db.query(func.avg(Menu.keto_score)).scalar()
    
    return {
        "total_restaurants": restaurant_count or 0,
        "total_menus": menu_count or 0,
        "high_keto_menus": high_keto_menus or 0,
        "average_keto_score": round(float(avg_keto_score), 1) if avg_keto_score else 0.0,
        "high_keto_percentage": round((high_keto_menus / menu_count * 100) if menu_count > 0 else 0, 1)
    }
