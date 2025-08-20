# 키토 식단 추천 백엔드 PRD (간소화 버전)

## 1. 프로젝트 개요

### 1.1 목적
사용자 정보에 개인화된 키토 식단을 생성해주고 강남역 주변 식당의 키토 친화적 메뉴를 추천하는 간단한 데모 시스템

### 1.2 핵심 기능
- 식당 목록 조회 (키토 점수 순 정렬)
- 식당별 메뉴 조회 (키토 점수 포함)
- GPT 기반 키토 점수 자동 계산
- **GPT 기반 개인맞춤 키토 식단 추천** (선호/비선호/알레르기 고려)
- **메인/사이드 메뉴 구분** (GPT 판단, 사이드 메뉴 추천 제외)
- **키토 점수 필터링** (60점 이상, 랜덤으로 6개 출력)

### 1.3 기술 스택
- **백엔드**: Python, FastAPI
- **데이터베이스**: Supabase (PostgreSQL)
- **AI API**: GPT API
- **기타**: SQLAlchemy, Pydantic, Uvicorn

## 2. 백엔드 아키텍처

### 2.1 간단한 시스템 구조
```
backend/
├── app/
│   ├── main.py              # FastAPI 앱 엔트리포인트
│   ├── database.py          # DB 연결 및 모델
│   ├── routers.py           # API 엔드포인트
│   └── gpt_service.py       # GPT API 연동
├── data/
│   ├── restaurants.csv      # 식당 시드 데이터
│   ├── menus.csv           # 메뉴 시드 데이터
│   └── seed_data.py        # 데이터 적재 및 GPT 처리
└── requirements.txt
```

## 3. API 엔드포인트 (간소화)

### 3.1 핵심 API 3개

#### `/restaurants` - 식당 목록 조회
- **Method**: GET
- **Response**: 키토 점수 높은 순으로 정렬된 식당 리스트

#### `/restaurants/{restaurant_id}/menus` - 식당별 메뉴 조회  
- **Method**: GET
- **Path Parameters**: `restaurant_id` (식당 ID)
- **Query Parameters**: 
  - `min_keto_score`: 최소 키토 점수 (기본값: 60)
  - `limit`: 최대 출력 개수 (기본값: 6)
- **Response**: 키토 점수 60점 이상 메인 메뉴만 최대 6개 (키토 점수 순 정렬)

#### `/recommend-meal` - GPT 기반 키토 식단 추천
- **Method**: POST
- **Body**: 사용자 선호도 정보 (선호/비선호/알레르기)
- **Response**: GPT가 추천하는 키토 식단 (저장하지 않음)

## 4. 데이터베이스 스키마 (초간단)

### 4.1 테이블 2개만

#### `restaurants` 테이블
```sql
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    link VARCHAR(500),
    phone TEXT,
    address TEXT
);
```

#### `menus` 테이블
```sql
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id),
    name VARCHAR(200) NOT NULL,
    keto_score INTEGER DEFAULT 0,
    is_main BOOLEAN DEFAULT TRUE  -- TRUE: 메인메뉴, FALSE: 사이드메뉴
);
```

## 5. GPT 활용 기능

### 5.1 키토 점수 계산
- 메뉴명을 GPT에게 전달하여 키토 점수 (0-100점) 자동 계산
- GPT가 메뉴의 탄수화물, 지방, 단백질 비율을 분석하여 점수 산정
- 한 번 계산된 점수는 DB에 저장하여 재사용

### 5.2 메인/사이드 메뉴 구분
- 메뉴명을 GPT에게 전달하여 메인메뉴/사이드메뉴 자동 판단
- GPT가 메뉴의 성격을 분석하여 is_main 필드에 저장
- 사이드메뉴는 추천에서 자동 제외

### 5.3 개인맞춤 키토 식단 추천
- 사용자의 선호/비선호/알레르기 정보를 GPT에 전달
- GPT가 키토 원칙에 맞는 하루 식단(아침/점심/저녁) 추천
- 실시간 생성, 별도 저장하지 않음

### 5.4 GPT 프롬프트 예시

#### 키토 점수 계산 + 메인/사이드 구분용
```
메뉴명: "{menu_name}"

다음 두 가지를 판단해주세요:
1. 키토 친화도를 0-100점으로 평가 (탄수화물 적을수록, 지방 많을수록 높은 점수)
2. 메인메뉴인지 사이드메뉴인지 구분 (main/side)

JSON 형태로 응답해주세요:
{
  "keto_score": 점수,
  "menu_type": "main" 또는 "side"
}
```

#### 키토 식단 추천용
```
사용자 정보:
- 선호 음식: {preferred_foods}
- 비선호 음식: {disliked_foods}
- 알레르기: {allergies}

위 정보를 바탕으로 키토 다이어트에 적합한 하루 식단을 추천해주세요.
- 아침, 점심, 저녁으로 구분
- 탄수화물 20g 이하, 지방 70% 이상
- 간단한 조리법 포함
- JSON 형태로 응답
```

## 6. 데이터 처리 플로우

### 6.1 시드 데이터 처리 과정
1. **CSV 파일 읽기**: `restaurants.csv`, `menus.csv` 파일 로드
2. **식당 데이터 삽입**: restaurants 테이블에 식당 정보 저장
3. **GPT API 호출**: 각 메뉴명을 GPT에 전달하여 키토 점수 + 메인/사이드 구분
4. **메뉴 데이터 삽입**: 키토 점수, is_main 값과 함께 menus 테이블에 저장

### 6.2 API 응답 예시

#### 식당 목록 응답
```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "요멘야 고에몬 강남점",
      "link": "https://place.map.kakao.com/18356174"
    }
  ]
}
```

#### 메뉴 목록 응답 (필터링 적용)
```json
{
  "menus": [
    {
      "id": 10,
      "name": "고에몬 미니 샐러드",
      "keto_score": 85,
      "is_main": true
    },
    {
      "id": 15,
      "name": "치킨 아보카도 샐러드",
      "keto_score": 78,
      "is_main": true
    },
    {
      "id": 22,
      "name": "연어 스테이크",
      "keto_score": 72,
      "is_main": true
    }
  ],
  "total_filtered": 3,
  "filter_applied": {
    "min_keto_score": 60,
    "only_main_menus": true,
    "limit": 6
  }
}
```

#### 키토 식단 추천 요청
```json
{
  "preferred_foods": ["계란", "아보카도", "연어", "치즈"],
  "disliked_foods": ["브로콜리", "버섯"],
  "allergies": ["견과류", "새우"]
}
```

#### 키토 식단 추천 응답
```json
{
  "meal_plan": {
    "breakfast": {
      "name": "아보카도 스크램블 에그",
      "ingredients": ["계란 2개", "아보카도 1/2개", "버터", "치즈"],
      "cooking_method": "버터에 계란을 스크램블하고 아보카도와 치즈 토핑",
      "carbs": "5g",
      "fat": "28g",
      "protein": "15g"
    },
    "lunch": {
      "name": "연어 샐러드",
      "ingredients": ["훈제연어 100g", "올리브오일", "상추", "치즈"],
      "cooking_method": "신선한 채소 위에 연어와 치즈, 올리브오일 드레싱",
      "carbs": "8g",
      "fat": "25g",
      "protein": "22g"
    },
    "dinner": {
      "name": "치즈 오믈렛",
      "ingredients": ["계란 3개", "체다치즈", "버터"],
      "cooking_method": "버터에 오믈렛을 만들고 치즈 넣어 접기",
      "carbs": "3g",
      "fat": "30g",
      "protein": "20g"
    }
  }
}
```

## 7. 개발 단계

### 7.1 단계별 개발 계획
1. **1단계**: FastAPI 기본 구조 + DB 연결
2. **2단계**: 시드 데이터 로딩 + GPT 키토 점수 계산 + 메인/사이드 구분
3. **3단계**: 식당/메뉴 조회 API 구현 (필터링 포함)
4. **4단계**: GPT 키토 식단 추천 API 구현
5. **5단계**: 프론트엔드 연동 테스트

## 8. 완료 기준
- [ ] 식당 목록 API 동작 확인
- [ ] **메뉴 목록 API 필터링 동작 확인** (키토 점수 60점 이상, 메인 메뉴만, 랜덤으로 6개)
- [ ] 모든 메뉴에 GPT 기반 키토 점수 + 메인/사이드 구분 완료
- [ ] **GPT 키토 식단 추천 API 동작 확인**
- [ ] **사용자 선호도 기반 개인맞춤 추천 확인**
- [ ] 프론트엔드에서 모든 기능 정상 동작
