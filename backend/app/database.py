"""
데이터베이스 연결 및 모델 정의
SQLAlchemy를 사용한 ORM 설정 (Supabase PostgreSQL)
"""
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from dotenv import load_dotenv

# .env 파일에서 환경변수 로드 (에러 무시)
try:
    load_dotenv()
except UnicodeDecodeError:
    print("⚠️  .env 파일 인코딩 오류 - 환경변수를 직접 설정해주세요")
except Exception as e:
    print(f"⚠️  .env 파일 로딩 실패: {e}")

# Supabase PostgreSQL 데이터베이스 URL
# 환경변수에서 가져오거나 직접 설정
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL", "")

if not SUPABASE_DB_URL:
    # 기본값으로 SQLite 사용 (Supabase URL이 없을 때)
    DATABASE_URL = "sqlite:///./keto_app.db"
    print("⚠️  SUPABASE_DB_URL이 설정되지 않았습니다. SQLite를 사용합니다.")
    # SQLite용 엔진 생성
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    DATABASE_URL = SUPABASE_DB_URL
    print("✅ Supabase PostgreSQL에 연결합니다.")
    # PostgreSQL용 엔진 생성
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성
Base = declarative_base()

# 데이터베이스 모델 정의

class Restaurant(Base):
    """식당 테이블"""
    __tablename__ = "restaurants"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    link = Column(String(500))
    phone = Column(Text)
    address = Column(Text)
    
    # 메뉴와의 관계 설정 (1:N)
    menus = relationship("Menu", back_populates="restaurant")

class Menu(Base):
    """메뉴 테이블"""
    __tablename__ = "menus"
    
    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False, index=True)
    name = Column(String(200), nullable=False, index=True)
    keto_score = Column(Integer, default=0, index=True)
    is_main = Column(Boolean, default=True, index=True)  # TRUE: 메인메뉴, FALSE: 사이드메뉴
    
    # 식당과의 관계 설정 (N:1)
    restaurant = relationship("Restaurant", back_populates="menus")

# 데이터베이스 테이블 생성
def create_tables():
    """데이터베이스 테이블을 생성합니다"""
    Base.metadata.create_all(bind=engine)
    print("✅ 데이터베이스 테이블이 생성되었습니다!")

# 데이터베이스 세션 의존성
def get_db():
    """데이터베이스 세션을 생성하고 반환합니다"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 앱 시작 시 테이블 생성
if __name__ == "__main__":
    create_tables()
