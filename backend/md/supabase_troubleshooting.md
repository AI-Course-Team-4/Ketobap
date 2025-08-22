# Supabase 연결 문제 해결 가이드

## 현재 상황
- **오류**: `'utf-8' codec can't decode byte 0xbe in position 80: invalid start byte`
- **원인**: Supabase 서버 응답의 인코딩 문제 또는 네트워크 이슈
- **시도한 방법들**:
  - psycopg2 드라이버
  - asyncpg 드라이버  
  - SSL 옵션 추가
  - 인코딩 옵션 추가

## 가능한 해결 방법

### 1. Supabase 프로젝트 재확인
- Supabase 대시보드에서 프로젝트 상태 확인
- 데이터베이스가 정상적으로 실행 중인지 확인
- 연결 문자열을 다시 복사해서 확인

### 2. 네트워크 환경 확인
```bash
# Supabase 서버에 ping 테스트
ping db.qrxmkzrjbqmumzzpgdqr.supabase.co

# 포트 연결 테스트
telnet db.qrxmkzrjbqmumzzpgdqr.supabase.co 5432
```

### 3. 방화벽/보안 소프트웨어
- 회사 네트워크나 방화벽에서 PostgreSQL 포트(5432) 차단 여부 확인
- 안티바이러스 소프트웨어의 네트워크 보호 기능 확인

### 4. 다른 PostgreSQL 클라이언트로 테스트
- DBeaver, pgAdmin 등으로 직접 연결 테스트
- 같은 연결 문자열로 연결이 되는지 확인

### 5. 대안: SQLite 계속 사용
현재 SQLite로 개발을 완료하고, 나중에 Supabase로 마이그레이션

## 당장 권장하는 방법

**SQLite를 사용해서 개발을 완료**한 후, 배포 시점에 Supabase 연결 문제를 해결하는 것을 권장합니다.

현재 SQLite로도 모든 기능이 정상 작동하고 있으므로:

1. 프론트엔드 개발 진행
2. 전체 시스템 완성
3. 배포 전에 Supabase 연결 문제 해결

## 연결 정보 (참고용)
```
Host: db.qrxmkzrjbqmumzzpgdqr.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: ketobap_db
```
