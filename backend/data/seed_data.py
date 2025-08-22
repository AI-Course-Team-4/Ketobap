"""
시드 데이터 적재 및 GPT 처리 스크립트
CSV 파일을 읽어서 GPT로 분석한 후 데이터베이스에 저장
"""
import asyncio
import pandas as pd
import sys
import os
from pathlib import Path

# 상위 디렉토리를 Python 경로에 추가
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal, Restaurant, Menu, create_tables
from app.gpt_service import GPTService

class SeedDataProcessor:
    """시드 데이터 처리 클래스"""
    
    def __init__(self):
        self.db = SessionLocal()
        self.gpt_service = GPTService()
        self.data_dir = Path(__file__).parent
        
    def __del__(self):
        if hasattr(self, 'db'):
            self.db.close()
    
    async def load_restaurants(self):
        """restaurants.csv 파일을 읽어서 DB에 저장"""
        print("📋 식당 데이터를 로딩 중...")
        
        try:
            # CSV 파일 읽기
            restaurants_df = pd.read_csv(self.data_dir / "restaurants.csv")
            print(f"✅ {len(restaurants_df)}개의 식당 데이터를 발견했습니다!")
            
            # 기존 데이터 삭제 (재실행 시)
            self.db.query(Menu).delete()
            self.db.query(Restaurant).delete()
            self.db.commit()
            
            # 식당 데이터 삽입
            for _, row in restaurants_df.iterrows():
                restaurant = Restaurant(
                    id=row['id'],
                    name=row['식당명'],  # 한국어 컬럼명
                    link=row.get('링크', ''),  # 한국어 컬럼명
                    phone=row.get('전화번호', ''),
                    address=row.get('주소', '')
                )
                self.db.add(restaurant)
            
            self.db.commit()
            print("✅ 식당 데이터 저장 완료!")
            
        except Exception as e:
            print(f"❌ 식당 데이터 로딩 실패: {e}")
            self.db.rollback()
            raise
    
    async def load_menus_with_gpt(self):
        """menus.csv 파일을 읽어서 GPT로 분석 후 DB에 저장"""
        print("📋 메뉴 데이터를 로딩하고 GPT 분석 중...")
        
        try:
            # CSV 파일 읽기
            menus_df = pd.read_csv(self.data_dir / "menus.csv")
            print(f"✅ {len(menus_df)}개의 메뉴 데이터를 발견했습니다!")
            
            # 진행률 추적
            total_menus = len(menus_df)
            processed = 0
            
            # 각 메뉴에 대해 GPT 분석 수행
            for _, row in menus_df.iterrows():
                try:
                    menu_name = row['name']
                    restaurant_id = row['restaurant_id']
                    
                    # GPT로 키토 점수 및 메인/사이드 구분
                    print(f"🤖 GPT 분석 중: {menu_name}")
                    gpt_result = await self.gpt_service.analyze_menu(menu_name)
                    
                    # 메뉴 데이터 생성
                    menu = Menu(
                        id=row['id'],
                        restaurant_id=restaurant_id,
                        name=menu_name,
                        keto_score=gpt_result['keto_score'],
                        is_main=gpt_result['is_main']
                    )
                    
                    self.db.add(menu)
                    processed += 1
                    
                    # 진행률 출력
                    if processed % 10 == 0 or processed == total_menus:
                        print(f"📊 진행률: {processed}/{total_menus} ({processed/total_menus*100:.1f}%)")
                    
                    # API 호출 제한을 위한 딜레이 (선택사항)
                    await asyncio.sleep(0.5)  # 0.5초 대기
                    
                except Exception as e:
                    print(f"⚠️  메뉴 '{menu_name}' 처리 실패: {e}")
                    # 기본값으로 저장
                    menu = Menu(
                        id=row['id'],
                        restaurant_id=restaurant_id,
                        name=menu_name,
                        keto_score=50,  # 기본값
                        is_main=True    # 기본값
                    )
                    self.db.add(menu)
                    processed += 1
            
            # 데이터베이스에 커밋
            self.db.commit()
            print("✅ 메뉴 데이터 저장 완료!")
            
        except Exception as e:
            print(f"❌ 메뉴 데이터 로딩 실패: {e}")
            self.db.rollback()
            raise
    
    async def run_seed_process(self):
        """전체 시드 데이터 처리 실행"""
        print("🚀 시드 데이터 처리를 시작합니다...")
        
        try:
            # 1. 데이터베이스 테이블 생성
            create_tables()
            
            # 2. 식당 데이터 로딩
            await self.load_restaurants()
            
            # 3. 메뉴 데이터 로딩 (GPT 분석 포함)
            await self.load_menus_with_gpt()
            
            # 4. 결과 통계 출력
            await self.print_statistics()
            
            print("🎉 시드 데이터 처리가 완료되었습니다!")
            
        except Exception as e:
            print(f"❌ 시드 데이터 처리 실패: {e}")
            raise
    
    async def print_statistics(self):
        """처리된 데이터 통계 출력"""
        print("\n📊 데이터 통계:")
        
        # 식당 수
        restaurant_count = self.db.query(Restaurant).count()
        print(f"   총 식당 수: {restaurant_count}개")
        
        # 메뉴 수
        menu_count = self.db.query(Menu).count()
        print(f"   총 메뉴 수: {menu_count}개")
        
        # 메인 메뉴 수
        main_menu_count = self.db.query(Menu).filter(Menu.is_main == True).count()
        print(f"   메인 메뉴 수: {main_menu_count}개")
        
        # 키토 점수 60점 이상 메뉴 수
        high_keto_count = self.db.query(Menu).filter(Menu.keto_score >= 60).count()
        print(f"   키토 점수 60점 이상: {high_keto_count}개 ({high_keto_count/menu_count*100:.1f}%)")
        
        # 평균 키토 점수
        from sqlalchemy import func
        avg_score = self.db.query(func.avg(Menu.keto_score)).scalar()
        print(f"   평균 키토 점수: {avg_score:.1f}점")

# 스크립트 실행 부분
async def main():
    """메인 실행 함수"""
    print("=" * 50)
    print("🥑 키토 식단 추천 시스템 - 시드 데이터 처리")
    print("=" * 50)
    
    # OpenAI API 키 확인
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️  경고: OPENAI_API_KEY 환경변수가 설정되지 않았습니다!")
        print("   GPT 분석 대신 기본값을 사용합니다.")
    
    processor = SeedDataProcessor()
    await processor.run_seed_process()

if __name__ == "__main__":
    asyncio.run(main())
