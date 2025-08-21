# Supabase 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름과 비밀번호 설정
4. 데이터베이스 지역 선택 (Seoul 추천)
5. 프로젝트 생성 완료 대기

## 2. 데이터베이스 연결 정보 확인

1. Supabase 대시보드에서 **Settings** → **Database** 이동
2. **Connection string** 섹션에서 **URI** 복사
3. 형식: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

## 3. 환경변수 설정

### Windows (PowerShell)
```powershell
$env:SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Windows (Command Prompt)
```cmd
set SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### macOS/Linux
```bash
export SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## 4. 연결 테스트

```bash
python -c "from app.database import engine; print('✅ 데이터베이스 연결 성공!' if engine else '❌ 연결 실패')"
```

## 5. 테이블 생성

```bash
python -m app.database
```

## 6. 시드 데이터 적재

```bash
python data/seed_data_simple.py
```

## 주의사항

- 비밀번호에 특수문자가 있으면 URL 인코딩 필요
- 방화벽이나 네트워크 제한 확인
- Supabase 프로젝트가 활성 상태인지 확인

## 문제 해결

### 연결 오류 시
1. 비밀번호 확인
2. 프로젝트 REF 확인
3. 네트워크 연결 확인
4. Supabase 서비스 상태 확인

### 권한 오류 시
1. 데이터베이스 사용자 권한 확인
2. RLS (Row Level Security) 설정 확인
