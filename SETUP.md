# 🚀 Ketobap 프로젝트 설정 가이드

## 📋 사전 준비사항

- **Node.js** 18.0.0 이상
- **npm** 또는 **yarn**
- **Git**
- **Supabase** 계정 (무료)
- **Expo CLI** (모바일 앱 개발용)

## 🔧 프로젝트 설정

### 1. 프로젝트 클론 및 설치

```bash
# 프로젝트 클론
git clone https://github.com/your-username/Ketobap.git
cd Ketobap

# 루트 의존성 설치
npm install

# 각 패키지 의존성 설치
cd packages/shared && npm install
cd ../web && npm install
cd ../mobile && npm install
cd ../..
```

### 2. Supabase 설정

#### 2.1 Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름: `Ketobap`
4. 데이터베이스 비밀번호 설정
5. 지역 선택 (가급적 Seoul)

#### 2.2 데이터베이스 스키마 설정
1. Supabase 대시보드 → SQL Editor
2. `supabase/schema.sql` 파일 내용을 복사하여 실행
3. `supabase/seed.sql` 파일 내용을 복사하여 실행

#### 2.3 API 키 확인
1. Supabase 대시보드 → Settings → API
2. **Project URL** 복사
3. **anon public** 키 복사

### 3. 환경 변수 설정

#### 3.1 웹 앱 환경 변수
```bash
cd packages/web
cp env.example .env.local
```

`.env.local` 파일 편집:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
HUGGING_FACE_TOKEN=your-token  # 선택사항
```

#### 3.2 모바일 앱 환경 변수
```bash
cd packages/mobile
cp env.example .env
```

`.env` 파일 편집:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_HUGGING_FACE_TOKEN=your-token  # 선택사항
```

### 4. Hugging Face 설정 (선택사항)

1. [Hugging Face](https://huggingface.co)에 가입
2. Settings → Access Tokens
3. "New token" 생성
4. 토큰을 환경 변수에 추가

## 🚀 실행 방법

### 웹 애플리케이션

```bash
# 개발 서버 시작
npm run dev:web

# 또는 직접 실행
cd packages/web
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 모바일 애플리케이션

#### Expo 설치 (처음 실행 시)
```bash
npm install -g expo-cli
# 또는
npm install -g @expo/cli
```

#### 앱 실행
```bash
# 개발 서버 시작
npm run dev:mobile

# 또는 직접 실행
cd packages/mobile
npm start
```

#### 디바이스에서 테스트
1. **Android**: Expo Go 앱 설치 → QR 코드 스캔
2. **iOS**: Expo Go 앱 설치 → QR 코드 스캔
3. **에뮬레이터**: Android Studio 또는 iOS Simulator 사용

## 🏗️ 빌드 및 배포

### 웹 앱 배포 (Vercel)

1. [Vercel](https://vercel.com)에 로그인
2. GitHub 리포지토리 연결
3. 프로젝트 설정:
   - **Build Command**: `cd packages/web && npm run build`
   - **Output Directory**: `packages/web/.next`
   - **Install Command**: `npm install`

4. 환경 변수 설정:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 모바일 앱 빌드 (EAS Build)

#### EAS CLI 설치
```bash
npm install -g eas-cli
eas login
```

#### 프로젝트 설정
```bash
cd packages/mobile
eas build:configure
```

#### 빌드 실행
```bash
# Android APK
eas build --platform android

# iOS (Apple Developer 계정 필요)
eas build --platform ios

# 전체 플랫폼
eas build --platform all
```

## 🔍 개발 도구

### 코드 품질 검사
```bash
# 웹 앱 타입 체크
cd packages/web
npm run type-check

# 모바일 앱 타입 체크
cd packages/mobile
npm run type-check
```

### 데이터베이스 관리
```bash
# Supabase 로컬 개발 (선택사항)
npx supabase init
npx supabase start
npx supabase db reset
```

## 🐛 문제 해결

### 자주 발생하는 문제

#### 1. 모듈을 찾을 수 없음
```bash
# 모든 node_modules 삭제 후 재설치
rm -rf node_modules packages/*/node_modules
npm install
```

#### 2. Supabase 연결 실패
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- API 키가 유효한지 확인

#### 3. 빌드 오류
```bash
# 캐시 정리
cd packages/web
rm -rf .next
npm run build

cd ../mobile
expo r -c
```

#### 4. 타입 오류
```bash
# shared 패키지 빌드
cd packages/shared
npm run build
```

## 📱 개발 팁

### 효율적인 개발 워크플로우

1. **Hot Reload 활용**: 코드 변경 시 자동 새로고침
2. **브라우저 개발자 도구**: 네트워크 탭에서 API 호출 확인
3. **Expo 개발 도구**: 모바일 앱 디버깅
4. **Supabase 대시보드**: 실시간 데이터베이스 모니터링

### 추천 개발 환경

- **VS Code** + TypeScript 확장
- **Expo 확장** (모바일 개발용)
- **Tailwind CSS IntelliSense**
- **Thunder Client** (API 테스트용)

## 🆘 지원

문제가 발생하면 다음을 확인해주세요:

1. 이 문서의 설정 단계를 모두 완료했는지
2. Node.js와 npm 버전이 요구사항을 만족하는지
3. 환경 변수가 올바르게 설정되었는지
4. Supabase 프로젝트가 정상 작동하는지

추가 지원이 필요하면 GitHub Issues를 생성해주세요!
