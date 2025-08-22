"""
키토 식단 추천 백엔드 API
FastAPI 애플리케이션 엔트리포인트
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import router

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title="키토 식단 추천 API",
    description="GPT 기반 키토 친화적 식당 메뉴 추천 시스템",
    version="1.0.0"
)

# CORS 미들웨어 설정 (프론트엔드 연동을 위해)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경에서는 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(router)

# 정적 파일 서빙 (프론트엔드)
# app.mount("/static", StaticFiles(directory="frontend"), name="static")

# 헬스체크 엔드포인트
@app.get("/")
async def root():
    return {
        "message": "키토 식단 추천 API 서버가 정상 작동 중입니다! 🥑",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)