# 📌 PRD – AI 기반 키토 식단 & 외식 추천 크로스플랫폼 서비스 (Supabase + Hugging Face 활용)

## 🧭 프로젝트 개요

**프로젝트명**: Ketobap  
**목표**: 사용자의 선호/비선호/알레르기 정보를 기반으로 키토 식단을 추천하고, 식단 유지가 어려운 경우 강남역 근처 키토 친화 음식점 메뉴를 추천하는 AI 기반 크로스플랫폼 서비스

**특징**:
- 사용자 정보 저장 없음 (비회원 기반)
- 웹 + 모바일 앱 통합 서비스
- Supabase를 통한 음식/음식점 데이터 관리
- Hugging Face 모델을 활용한 키토 점수 자동 산정
- 네이버 검색 링크 자동 생성으로 외식 연결

## 🧩 주요 기능 및 페이지 구성

### 1️⃣ 개인정보 입력 페이지

**목적**: 사용자의 식단 추천을 위한 조건 수집

**기능 설명**:
- Select Input 기반으로 선호 식품, 비선호 식품, 알레르기 재료 선택
- "기타" 선택 시 텍스트 입력 필드 활성화
- 유효성 검사: 필수 항목 누락 방지, 텍스트 길이 제한
- **모바일 최적화**: 드롭다운 대신 모달 선택기, 터치 친화적 UI

**데이터 처리 방식**:
- 입력값은 클라이언트 상태로만 유지 (DB 저장 없음)
- 이후 식단 추천 시 필터링 조건으로 활용

### 2️⃣ 오늘의 추천 식단 페이지

**목적**: 사용자 조건에 맞는 아침/점심/저녁 키토 식단 추천

**기능 설명**:
- Supabase foods 테이블에서 음식 조회
- Hugging Face 모델을 통해 각 음식의 키토 점수 산정
- 사용자 조건에 따라 음식 필터링
- 각 끼니별 추천 메뉴 1개 표시
- 탄단지 비율 및 칼로리 정보 제공
- "먹기 어려워요" 버튼 → 외식 추천 페이지로 이동
- **모바일 최적화**: 스와이프 네비게이션, 카드 기반 레이아웃

### 3️⃣ 외식 추천 페이지

**목적**: 식단 유지가 어려운 경우, 강남역 근처 키토 친화 음식 추천

**기능 설명**:
- Supabase restaurant_menus 테이블에서 키토 점수 높은 음식 5개 추천
- 사용자 조건에 따라 필터링
- 각 음식 클릭 시 → 네이버 검색 링크 자동 생성
- **모바일 최적화**: 지도 연동 고려, 전화 걸기 기능

## 🤖 AI 활용 방식

| 단계 | AI 역할 | 사용 기술 |
|------|---------|-----------|
| 음식 키토 점수 산정 | 음식명/재료 기반 점수 계산 | Hugging Face 모델 (text classification or custom scoring) |
| 식단 구성 | 사용자 조건 기반 필터링 및 추천 | 클라이언트 로직 + AI 보조 |
| 외식 대안 추천 | 키토 점수 기반 음식 추천 | Supabase DB + AI 점수 필터링 |

## 🛠 기술 스택

### 웹 서비스
| 항목 | 기술 |
|------|------|
| 프론트엔드 | React (Next.js) |
| 스타일링 | Tailwind CSS |
| 상태관리 | Zustand |
| 배포 | Vercel |

### 모바일 앱
| 항목 | 기술 |
|------|------|
| 프레임워크 | React Native (Expo) |
| 네비게이션 | React Navigation |
| 스타일링 | NativeWind (Tailwind for RN) |
| 상태관리 | Zustand |
| 배포 | EAS Build (iOS/Android) |

### 공통 (웹 + 모바일)
| 항목 | 기술 |
|------|------|
| 백엔드 | 없음 (클라이언트 중심) |
| DB | Supabase PostgreSQL |
| AI | Hugging Face API (JavaScript SDK) |
| 외부 연동 | 네이버 검색 링크 생성 |

## 🏗 프로젝트 구조

```
Ketobap/
├── packages/
│   ├── shared/           # 웹/앱 공통 로직
│   │   ├── api/         # Supabase API
│   │   ├── ai/          # Hugging Face 연동
│   │   ├── types/       # TypeScript 타입
│   │   └── utils/       # 공통 유틸리티
│   ├── web/             # Next.js 웹 앱
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── mobile/          # React Native 앱
│       ├── src/
│       │   ├── screens/
│       │   ├── components/
│       │   └── navigation/
│       └── app.json
├── supabase/            # DB 스키마 및 설정
└── package.json
```

## 🧬 Supabase 테이블 구조

```sql
-- 음식 정보 테이블
create table foods (
  id serial primary key,
  name text not null,
  carbs int,
  protein int,
  fat int,
  calories int,
  keto_score int,
  tags text[], -- 예: ['아보카도', '치즈']
  created_at timestamp default now()
);

-- 음식점 메뉴 테이블
create table restaurant_menus (
  id serial primary key,
  restaurant_name text not null,
  menu_name text not null,
  description text,
  keto_score int,
  address text,
  phone text, -- 모바일 앱에서 전화 걸기 기능용
  latitude decimal(10,8), -- 지도 연동용
  longitude decimal(11,8), -- 지도 연동용
  naver_search_keyword text generated always as (
    '강남 ' || restaurant_name || ' ' || menu_name
  ) stored,
  created_at timestamp default now()
);

-- 키토 점수 기준 인덱스
create index idx_foods_keto_score on foods(keto_score desc);
create index idx_restaurant_menus_keto_score on restaurant_menus(keto_score desc);
```

## 📱 플랫폼별 차별화 기능

### 웹 버전
- 데스크톱 최적화된 넓은 레이아웃
- 키보드 네비게이션 지원
- 상세한 영양 정보 차트

### 모바일 앱 버전
- 푸시 알림 (식사 시간 리마인더)
- 오프라인 캐시 (최근 추천 식단)
- 카메라 연동 (음식 사진 촬영 후 키토 점수 예측)
- 위치 기반 근처 키토 음식점 추천
- 전화 걸기 및 지도 앱 연동

## 🚀 개발 로드맵

### Phase 1: MVP 웹 버전 (4주)
1. Supabase 설정 및 기본 테이블 생성
2. Next.js 프로젝트 세팅
3. 개인정보 입력 페이지 구현
4. 식단 추천 기본 로직 구현
5. Hugging Face API 연동

### Phase 2: 웹 버전 완성 (2주)
1. 외식 추천 페이지 구현
2. UI/UX 개선 및 반응형 디자인
3. 배포 및 테스트

### Phase 3: 모바일 앱 개발 (6주)
1. React Native 프로젝트 세팅
2. 공통 로직을 shared 패키지로 분리
3. 모바일 UI 컴포넌트 구현
4. 플랫폼별 차별화 기능 개발
5. 앱 스토어 배포

### Phase 4: 고도화 (4주)
1. AI 모델 성능 개선
2. 사용자 피드백 반영
3. 추가 기능 개발 (카메라, 위치 기반 등)

## 📊 성공 지표

- **웹**: 주간 활성 사용자 1,000명
- **모바일**: 앱 다운로드 5,000회, 주간 활성 사용자 500명
- **만족도**: 추천 식단 만족도 80% 이상
- **전환율**: 외식 추천 → 네이버 검색 클릭률 30% 이상
