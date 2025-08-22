@echo off
echo 백엔드와 프론트엔드를 동시에 시작합니다...

REM 백엔드 실행 (새 창에서)
start "Backend Server" cmd /c "cd /d C:\Users\301\mini\pro\miniProject-Team4-AICourse\backend && python -m uvicorn app.main:app --reload --port 8000"

REM 잠시 대기
timeout /t 3 /nobreak >nul

REM 프론트엔드 실행 (새 창에서)
start "Frontend Server" cmd /c "cd /d C:\Users\301\mini\pro\miniProject-Team4-AICourse\packages\web && npm run dev"

echo 서버들이 실행 중입니다!
echo 백엔드: http://localhost:8000
echo 프론트엔드: http://localhost:3000
pause
