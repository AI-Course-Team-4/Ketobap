# miniProject-Team4-AICourse
심화_생성형 AI활용 인재양성 과정 미니 프로젝트

# 팀원
- 김수환
- 김성은
- 김찬종[팀장]
- 조수빈
- 지창현

# 관련자료
- [Miro 보드 링크](https://miro.com/app/board/uXjVJTcI3Vo=/)
- [Notion 링크](https://www.notion.so/AI-X-9-4-244e5ada13da80bfb568d9e5b2eb8a12?p=253e5ada13da800aada4e10cbb5f08fa&pm=s)


# 📌 PRD – AI 기반 키토 식단 & 외식 추천 웹 서비스 (Supabase + Hugging Face 활용)
🧭 프로젝트 개요
- 프로젝트명: KetoBab
- 목표: 사용자의 선호/비선호/알레르기 정보를 기반으로 키토 식단을 추천하고, 식단 유지가 어려운 경우 강남역 근처 키토 친화 음식점 메뉴를 추천하는 AI 기반 웹 서비스
- 특징:
  1. 사용자 정보 저장 없음 (비회원 기반)
  2. Supabase를 통한 음식/음식점 데이터 관리
  3. Hugging Face 모델을 활용한 키토 점수 자동 산정
  4. 네이버 검색 링크 자동 생성으로 외식 연결

🧩 주요 기능 및 페이지 구성
1️⃣ 개인정보 입력 페이지
- 목적:
사용자의 식단 추천을 위한 조건 수집

- 기능 설명:
  1. Select Input 기반으로 선호 식품, 비선호 식품, 알레르기 재료 선택
  2. “기타” 선택 시 텍스트 입력 필드 활성화
  3. 유효성 검사: 필수 항목 누락 방지, 텍스트 길이 제한
- 데이터 처리 방식:
  1. 입력값은 클라이언트 상태로만 유지 (DB 저장 없음)
  2. 이후 식단 추천 시 필터링 조건으로 활용

2️⃣ 오늘의 추천 식단 페이지
- 목적
  1. 사용자 조건에 맞는 아침/점심/저녁 키토 식단 추천
-기능 설명
  1. Supabase foods 테이블에서 음식 조회
  2. Hugging Face 모델을 통해 각 음식의 키토 점수 산정
  3. 사용자 조건에 따라 음식 필터링
  4. 각 끼니별 추천 메뉴 1개 표시
  5. 탄단지 비율 및 칼로리 정보 제공
  6. “먹기 어려워요” 버튼 → 외식 추천 페이지로 이동

3️⃣ 외식 추천 페이지
- 목적
  1. 식단 유지가 어려운 경우, 강남역 근처 키토 친화 음식 추천
- 기능 설명
  1. Supabase restaurant_menus 테이블에서 키토 점수 높은 음식 5개 추천
  2. 사용자 조건에 따라 필터링
  3. 각 음식 클릭 시 → 네이버 검색 링크 자동 생성 (예: https://search.naver.com/search.naver?query=강남+샐러디+닭가슴살샐러드)

🤖 AI 활용 방식

| 단계             | AI 역할                     | 사용 기술                                       |
| ---------------- | ---------------------------- | ----------------------------------------------- |
| 음식 키토 점수 산정 | 음식명/재료 기반 점수 계산   | Hugging Face 모델 (text classification or custom scoring) |
| 식단 구성         | 사용자 조건 기반 필터링 및 추천 | 클라이언트 로직 + AI 보조                        |
| 외식 대안 추천    | 키토 점수 기반 음식 추천     | Supabase DB + AI 점수 필터링                    |

🛠 기술 스택

| 항목        | 기술                               |
| ----------- | ---------------------------------- |
| 프론트엔드   | React (Next.js)                   |
| 백엔드      | 없음 (클라이언트 중심)             |
| DB          | Supabase PostgreSQL                |
| AI          | Hugging Face API (Python or JS SDK) |
| 배포        | Vercel                             |
| 외부 연동    | 네이버 검색 링크 생성 (URL 조합)   |

🧬 Supabase 테이블 구조

```sql
create table foods (
  id serial primary key,
  name text not null,
  carbs int,
  protein int,
  fat int,
  calories int,
  keto_score int,
  tags text[] -- 예: ['아보카도', '치즈']
);

create table restaurant_menus (
  id serial primary key,
  restaurant_name text not null,
  menu_name text not null,
  description text,
  keto_score int,
  address text,
  naver_search_keyword text generated always as (
    '강남 ' || restaurant_name || ' ' || menu_name
  ) stored
);

📅 개발 일정 (7일 기준)
| 날짜 | 작업 내용 | 
| Day 1 | 프로젝트 셋업, Supabase 테이블 생성 | 
| Day 2 | 개인정보 입력 페이지 개발 | 
| Day 3 | Hugging Face 모델 연동 및 음식 점수 산정 | 
| Day 4 | 식단 추천 페이지 개발 | 
| Day 5 | 외식 추천 페이지 개발 및 링크 생성 | 
| Day 6 | UI 개선, 반응형 적용 | 
| Day 7 | 최종 테스트, 배포 | 



✅ 성공 지표
- 식단 추천 정확도 및 만족도 > 80%
- 외식 추천 클릭률 > 60%
- 네이버 링크 정상 연결률 100%
- 페이지 로딩 시간 < 3초
