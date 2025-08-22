# 🥑 KetoBab - AI 기반 키토 식단 & 외식 추천 서비스

개인의 선호도, 알레르기 정보를 기반으로 맞춤형 키토 식단을 추천하고, 강남 지역의 키토 친화적인 음식점을 안내하는 AI 기반 크로스플랫폼 서비스입니다.

## ✨ 주요 기능

* **🤖 AI 맞춤 추천**: 개인 선호도와 알레르기를 고려한 키토 식단 추천
* **📊 영양 분석**: 실시간 탄단지 비율 및 키토 점수 분석
* **🗺️ 외식 가이드**: 강남 지역 키토 친화적 음식점 및 메뉴 추천
* **🔒 프라이버시**: 회원가입 없이 사용 가능한 비회원 기반 서비스
* **📱 크로스플랫폼**: 웹과 모바일 앱 지원

## 🏗️ 프로젝트 구조

```
ketobab/
├── packages/
│   ├── shared/           # 웹/앱 공통 로직
│   │   ├── api/         # SQLite API
│   │   ├── ai/          # Hugging Face 연동
│   │   ├── types/       # TypeScript 타입
│   │   └── utils/       # 공통 유틸리티
│   ├── web/             # Next.js 웹 앱
│   │   ├── app/         # App Router 페이지
│   │   ├── components/  # React 컴포넌트
│   │   └── styles/      # Tailwind CSS
│   └── mobile/          # React Native 앱 (향후 구현)
├── database/            # SQLite DB 및 설정
└── package.json
```

## 🛠️ 기술 스택

### 웹 서비스

* **프론트엔드**: Next.js 14, React 18, TypeScript
* **스타일링**: Tailwind CSS
* **상태관리**: Zustand
* **배포**: Vercel

### 데이터베이스 & API

* **DB**: SQLite
* **AI**: Hugging Face API
* **검색**: 네이버 검색 API

### 모바일 (향후 구현)

* **프레임워크**: React Native with Expo
* **네비게이션**: React Navigation
* **스타일링**: NativeWind

## 🚀 빠른 시작

### 1. 프로젝트 클론

```bash
git clone https://github.com/soohwan93/miniProject-Team4-AICourse.git
cd ketobab
```

### 2. 의존성 설치

```bash
npm install
```

### 3. SQLite 설정

1. `database/schema.sql` 파일을 실행하여 테이블 생성
2. `database/seed.sql` 파일을 실행하여 샘플 데이터 추가

```bash
# sqlite3 실행 예시
sqlite3 ketobab.db < database/schema.sql
sqlite3 ketobab.db < database/seed.sql
```

### 4. 환경 변수 설정

```bash
# packages/web/ 디렉토리에서
cp env.example .env.local
```

`.env.local` 파일을 편집하여 다음 값들을 설정:

```env
DATABASE_URL=file:../database/ketobab.db
HUGGING_FACE_TOKEN=your-hugging-face-token  # 선택사항
```

### 5. 개발 서버 실행

```bash
# 웹 앱 실행
npm run dev:web

# 또는 packages/web 디렉토리에서
cd packages/web
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📊 데이터베이스 스키마

### `foods` 테이블

```sql
CREATE TABLE foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  carbs INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  fat INTEGER NOT NULL,
  calories INTEGER NOT NULL,
  keto_score INTEGER NOT NULL,
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `restaurant_menus` 테이블

```sql
CREATE TABLE restaurant_menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_name TEXT NOT NULL,
  menu_name TEXT NOT NULL,
  description TEXT,
  keto_score INTEGER NOT NULL,
  address TEXT,
  phone TEXT,
  latitude REAL,
  longitude REAL,
  naver_search_keyword TEXT GENERATED ALWAYS AS (
    '강남 ' || restaurant_name || ' ' || menu_name
  ) VIRTUAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 주요 스크립트

```bash
# 개발
npm run dev:web          # 웹 앱 개발 서버
npm run dev:mobile       # 모바일 앱 개발 서버 (향후)

# 빌드
npm run build:web        # 웹 앱 빌드
npm run build:mobile     # 모바일 앱 빌드 (향후)

# 데이터베이스
npm run db:setup         # SQLite 스키마 적용
npm run db:seed          # 샘플 데이터 추가
```

## 🎯 사용 방법

### 1. 개인 선호도 설정

* 선호하는 음식, 비선호하는 음식, 알레르기 정보 입력
* "기타" 선택 시 직접 입력 가능

### 2. AI 식단 추천 받기

* 개인 조건에 맞는 아침/점심/저녁 키토 식단 추천
* 실시간 영양소 분석 및 키토 점수 확인
* 일일 총 영양 정보 제공

### 3. 외식 추천 이용

* 강남 지역 키토 친화적 음식점 및 메뉴 탐색
* 키토 점수 필터링 및 개인 조건 적용
* 네이버 검색 및 전화 연결 기능

## 🤖 AI 기능

### 키토 점수 계산

* 음식명과 재료를 분석하여 키토 다이어트 적합도 점수 산정
* Hugging Face API 연동 (선택사항)
* 기본 키워드 기반 분석 지원

### 맞춤 추천 알고리즘

* 사용자 선호도 + 키토 점수 조합
* 알레르기 및 비선호 음식 자동 제외
* 중복 방지 다양성 보장

## 🔐 프라이버시 & 보안

* **비회원 서비스**: 개인정보 수집 없음
* **클라이언트 저장**: 선호도는 브라우저에만 임시 저장
* **데이터 암호화**: SQLite 파일 권한 관리
* **HTTPS**: 모든 통신 암호화

## 🚧 향후 계획

### Phase 1: 웹 서비스 고도화

* [ ] 사용자 피드백 수집 및 반영
* [ ] AI 모델 성능 개선
* [ ] 더 많은 음식 및 음식점 데이터 추가

### Phase 2: 모바일 앱 개발

* [ ] React Native 앱 구현
* [ ] 푸시 알림 (식사 시간 리마인더)
* [ ] 오프라인 캐시 기능
* [ ] 카메라 연동 (음식 사진 분석)

### Phase 3: 고급 기능

* [ ] 위치 기반 근처 음식점 추천
* [ ] 개인별 키토 진행 상황 추적
* [ ] 소셜 기능 (식단 공유)
* [ ] 영양사 상담 연결

## 👥 팀 협업 가이드

### 새 팀원 온보딩

#### 1. 프로젝트 클론 및 설정

```bash
# 레포지토리 클론
git clone https://github.com/soohwan93/miniProject-Team4-AICourse.git
cd miniProject-Team4-AICourse

# dev 브랜치로 전환 (메인 개발 브랜치)
git checkout dev
git pull origin dev

# 의존성 설치
npm install

# 환경 변수 설정
cp packages/web/env.example packages/web/.env.local
# .env.local 파일을 편집하여 SQLite 설정 추가
```

#### 2. 개발 환경 실행

```bash
# 웹 개발 서버 실행
npm run dev:web
# 또는
cd packages/web && npm run dev
```

### 브랜치 전략

#### 브랜치 구조

* `main`: 프로덕션 배포용 (건드리지 않음)
* `dev`: 메인 개발 브랜치 (모든 기능 통합)
* `feature/기능명`: 새로운 기능 개발
* `fix/버그명`: 버그 수정
* `docs/문서명`: 문서 업데이트

#### 작업 플로우

```bash
# 1. dev 브랜치에서 최신 코드 받기
git checkout dev
git pull origin dev

# 2. 새 기능 브랜치 생성
git checkout -b feature/음식추천알고리즘개선

# 3. 개발 작업 수행
# ... 코딩 ...

# 4. 변경사항 커밋
git add .
git commit -m "feat: 키토 점수 계산 알고리즘 개선

- 탄수화물 비율 가중치 조정
- 섬유질 계산 로직 추가
- 키토 친화적 재료 키워드 확장"

# 5. 브랜치 푸시
git push -u origin feature/음식추천알고리즘개선

# 6. GitHub에서 Pull Request 생성
# dev 브랜치로 PR 요청
```

### 커밋 메시지 규칙

#### 커밋 타입

* `feat`: 새로운 기능 추가
* `fix`: 버그 수정
* `docs`: 문서 수정
* `style`: 코드 포맷팅, 세미콜론 누락 등
* `refactor`: 코드 리팩토링
* `test`: 테스트 코드 추가/수정
* `chore`: 빌드 스크립트 수정, 패키지 매니저 설정 등

#### 커밋 메시지 형식

```
타입: 요약 (50자 이내)

상세 설명 (선택사항)
- 변경사항 1
- 변경사항 2
- 변경사항 3
```

### Pull Request 가이드

#### PR 생성 전 체크리스트

* [ ] 최신 dev 브랜치와 충돌 없는지 확인
* [ ] 로컬에서 정상 빌드 및 실행 확인
* [ ] 커밋 메시지가 규칙에 맞는지 확인
* [ ] 관련 없는 파일은 제외했는지 확인

#### PR 템플릿

```markdown
## 📋 변경사항
- 구현한 기능이나 수정한 내용 요약

## 🧪 테스트
- [ ] 로컬에서 정상 동작 확인
- [ ] 빌드 오류 없음
- [ ] 기존 기능에 영향 없음

## 📸 스크린샷 (UI 변경시)
- 변경 전/후 비교 이미지

## 📝 추가 설명
- 기타 고려사항이나 리뷰 요청사항
```

### 코드 리뷰 가이드

#### 리뷰어 체크포인트

1. **기능성**: 의도한 대로 동작하는가?
2. **코드 품질**: 읽기 쉽고 유지보수 가능한가?
3. **성능**: 불필요한 렌더링이나 API 호출은 없는가?
4. **보안**: 민감한 정보 노출은 없는가?
5. **일관성**: 프로젝트 코딩 컨벤션을 따르는가?

#### 리뷰 코멘트 예시

```
💡 제안: 이 함수를 utils로 분리하면 재사용성이 높아질 것 같습니다.
🐛 버그: null 체크가 필요할 것 같습니다.
❓ 질문: 이 로직의 의도를 설명해주실 수 있나요?
👍 좋음: 깔끔한 구현이네요!
```

### 개발 환경 설정

#### 필수 도구

* **Node.js**: v18 이상
* **npm**: v8 이상
* **Git**: 최신 버전
* **VS Code**: 권장 에디터
* **SQLite3**: 로컬 데이터베이스 관리용

#### SQLite 설치 방법

**Windows:**

1. [SQLite 다운로드](https://www.sqlite.org/download.html)
2. 실행 파일을 PATH에 추가
3. 설치 확인: `sqlite3 --version`

**Mac:**

```bash
brew install sqlite
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install sqlite3
```

#### Git 초기 설정

```bash
# 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 기본 브랜치명 설정
git config --global init.defaultBranch main

# 설정 확인
git config --list
```

#### 권장 VS Code 확장

* ES7+ React/Redux/React-Native snippets
* Tailwind CSS IntelliSense
* TypeScript Importer
* GitLens
* Prettier
* ESLint

#### 패키지 구조 이해

```
packages/
├── shared/     # 공통 로직 (API, 타입, 유틸)
├── web/        # Next.js 웹 애플리케이션
└── mobile/     # React Native 앱 (향후 구현)
```

### 트러블슈팅

#### 자주 발생하는 문제

1. **의존성 설치 오류**

   ```bash
   # node_modules 삭제 후 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **빌드 오류**

   ```bash
   # 타입 체크
   npm run type-check

   # 린트 체크
   npm run lint
   ```

3. **환경 변수 문제**

   * `.env.local` 파일 존재 확인
   * SQLite DB 파일 경로 정확성 확인
   * 서버 재시작 필요

#### 도움 요청 방법

1. GitHub Issues에 버그 리포트/질문 등록
2. 팀 채팅방에 질문
3. 코드 리뷰에서 질문 코멘트

## 🤝 기여하기

### 외부 기여자용

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 오픈

### 팀 멤버용

위의 "팀 협업 가이드" 섹션을 참고하세요.

---

**KetoBab** - 건강한 키토 라이프를 위한 똑똑한 선택 🥑✨
