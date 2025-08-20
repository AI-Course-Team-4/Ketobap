-- 음식 정보 테이블
CREATE TABLE IF NOT EXISTS foods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  carbs INTEGER NOT NULL DEFAULT 0,
  protein INTEGER NOT NULL DEFAULT 0,
  fat INTEGER NOT NULL DEFAULT 0,
  calories INTEGER NOT NULL DEFAULT 0,
  keto_score INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 음식점 메뉴 테이블
CREATE TABLE IF NOT EXISTS restaurant_menus (
  id SERIAL PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  menu_name TEXT NOT NULL,
  description TEXT,
  keto_score INTEGER NOT NULL DEFAULT 0,
  address TEXT,
  phone TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  naver_search_keyword TEXT GENERATED ALWAYS AS (
    '강남 ' || restaurant_name || ' ' || menu_name
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 키토 점수 기준 인덱스
CREATE INDEX IF NOT EXISTS idx_foods_keto_score ON foods(keto_score DESC);
CREATE INDEX IF NOT EXISTS idx_restaurant_menus_keto_score ON restaurant_menus(keto_score DESC);

-- 음식 이름 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods USING GIN(to_tsvector('korean', name));
CREATE INDEX IF NOT EXISTS idx_restaurant_menus_name ON restaurant_menus USING GIN(to_tsvector('korean', menu_name));

-- 태그 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_foods_tags ON foods USING GIN(tags);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 트리거 생성
CREATE TRIGGER update_foods_updated_at 
    BEFORE UPDATE ON foods 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_menus_updated_at 
    BEFORE UPDATE ON restaurant_menus 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
