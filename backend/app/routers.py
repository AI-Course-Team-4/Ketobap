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
from .gpt_service import GPTService

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
        
        # GPT 서비스를 통한 식단 추천
        gpt_service = GPTService()
        preferences = {
            "preferred_foods": request.preferred_foods,
            "disliked_foods": request.disliked_foods,
            "allergies": request.allergies
        }
        
        meal_plan = await gpt_service.recommend_meal_plan(preferences)
        
        # 에러 체크
        if "error" in meal_plan:
            raise HTTPException(status_code=500, detail=meal_plan["error"])
        
        return {
            "meal_plan": meal_plan,
            "user_preferences": preferences,
            "generated_at": "실시간 생성됨"
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
