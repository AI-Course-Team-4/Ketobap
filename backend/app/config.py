"""
프롬프트 설정 파일
웹서버에서 사용할 프롬프트를 쉽게 변경할 수 있습니다.
"""
import os

# 환경변수나 설정으로 프롬프트 선택
PROMPT_VERSION = os.getenv("PROMPT_VERSION", "default")

# 개발 중 빠른 프롬프트 변경을 위한 설정
# 이 값을 바꾸고 서버를 재시작하면 다른 프롬프트로 테스트 가능
CURRENT_PROMPT = "jch"  # "default", "improved", "jch", "김철수", "이영희" 등
print("현재 사용 중인 프롬프트 :::", CURRENT_PROMPT)
def get_current_prompt():
    """현재 사용 중인 프롬프트 버전 반환"""
    return CURRENT_PROMPT
