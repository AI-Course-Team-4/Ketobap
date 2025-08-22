# 🚀 프롬프트 개별 실험 완벽 가이드

## 📁 폴더 구조
```
backend/app/prompts/
├── __init__.py                           # 프롬프트 모듈
├── base_prompts.py                      # 기본 프롬프트 템플릿 (수정금지)
├── team_prompts.py                      # 팀 공용 프롬프트 관리 (조심스럽게 수정)
├── individual_prompts/                  # 개별 실험 폴더 (각자 자유롭게 작업)
│   ├── .gitkeep
│   ├── example_member_prompts.py       # 예시 파일
│   ├── 실험용_테스트_prompts.py        # 웹서버 테스트용
│   ├── 김철수_prompts.py               # 개별 실험 파일
│   └── 이영희_prompts.py               # 개별 실험 파일
├── README.md                           # 이 파일
└── ../config.py                        # 웹서버 프롬프트 선택 설정
```

## 🎯 **STEP 1: 개별 프롬프트 파일 생성**

### 1️⃣ 본인 프롬프트 파일 생성
```bash
# 예시 파일을 복사해서 본인 이름으로 변경
cd backend/app/prompts/individual_prompts/
cp example_member_prompts.py 김철수_prompts.py
```

### 2️⃣ 본인 프롬프트 파일 수정
`김철수_prompts.py` 파일을 열어서:
```python
# 클래스 이름을 본인 이름으로 변경
class 김철수MenuAnalysisPrompt(MenuAnalysisPrompt):
class 김철수MealPlanPrompt(MealPlanPrompt):

# 프롬프트 내용을 본인 아이디어로 수정
def get_system_message(self) -> str:
    return """여기에 본인만의 프롬프트 작성..."""
```

## 🎯 **STEP 2: 프롬프트 등록하기**

### 1️⃣ team_prompts.py에 본인 프롬프트 등록
`backend/app/prompts/team_prompts.py` 파일 하단에 추가:
```python
# 본인 프롬프트 import
from .individual_prompts.김철수_prompts import 김철수MenuAnalysisPrompt, 김철수MealPlanPrompt

# TEAM_PROMPTS 딕셔너리에 추가
TEAM_PROMPTS["김철수"] = {
    "menu_analysis": 김철수MenuAnalysisPrompt(),
    "meal_plan": 김철수MealPlanPrompt()
}
```

## 🎯 **STEP 3: 프롬프트 테스트 방법**

### 방법 1: 터미널에서 직접 테스트 (개발 중 빠른 테스트)
```python
# backend 폴더에서 실행
python -c "
import asyncio
from app.gpt_service import GPTService

async def test():
    service = GPTService('김철수')  # 본인 이름 입력
    result = await service.analyze_menu('김치찌개')
    print(result)

asyncio.run(test())
"
```

### 방법 2: 웹서버에서 실제 테스트 (실제 사용 환경 테스트)

#### 2-1. config.py에서 프롬프트 설정
`backend/app/config.py` 파일 수정:
```python
# 이 값을 바꿔서 다른 프롬프트로 테스트
CURRENT_PROMPT = "김철수"  # 본인 이름으로 변경
```

#### 2-2. 백엔드 서버 재시작
```bash
cd backend
python -m uvicorn app.main:app --reload
```

#### 2-3. 웹브라우저에서 테스트
1. `http://localhost:3000` 접속
2. 식단 추천 페이지로 이동
3. 선호도 입력 후 식단 추천 버튼 클릭
4. 본인 프롬프트로 생성된 결과 확인

## 🎯 **STEP 4: 프롬프트 비교 테스트**

### 여러 프롬프트 버전 비교하기
```python
async def compare_prompts():
    # 기본, 개선, 본인 프롬프트 비교
    basic = GPTService("default")
    improved = GPTService("improved") 
    mine = GPTService("김철수")
    
    menu = "삼겹살 구이"
    result1 = await basic.analyze_menu(menu)
    result2 = await improved.analyze_menu(menu)
    result3 = await mine.analyze_menu(menu)
    
    print(f"기본 프롬프트: {result1}")
    print(f"개선 프롬프트: {result2}")
    print(f"내 프롬프트: {result3}")
```

## 🎯 **사용 가능한 프롬프트 버전들**

| 프롬프트명 | 설명 | 사용법 |
|-----------|------|--------|
| `"default"` | 기본 프롬프트 | `GPTService("default")` |
| `"improved"` | 개선된 프롬프트 (하루 탄수 30g 고려) | `GPTService("improved")` |
| `"실험용_테스트"` | 웹서버 테스트용 | `CURRENT_PROMPT = "실험용_테스트"` |
| `"김철수"` | 개별 프롬프트 | `GPTService("김철수")` |

## 🎨 **프롬프트 개선 아이디어**

### 메뉴 분석 프롬프트 개선
- ✅ **Few-shot Learning**: 구체적인 예시 추가
- ✅ **Chain-of-Thought**: 단계별 분석 과정
- ✅ **한국 음식 특화**: 김치, 나물, 구이류 등 특별 처리
- ✅ **하루 탄수화물 고려**: 30g/3끼 = 10g/끼 기준
- 🔥 **영양성분 정확도**: 더 정확한 영양성분 계산
- 🔥 **지역별 음식**: 강남/홍대/명동 등 지역 특색
- 🔥 **시간대별**: 아침/점심/저녁/간식 시간 고려

### 식단 추천 프롬프트 개선  
- ✅ **영양소 정확도**: 더 정확한 계산 가이드라인
- ✅ **한국인 맞춤**: 한국 식재료, 조리법 활용
- ✅ **실용성**: 구하기 쉬운 재료, 간단한 조리법
- 🔥 **계절성**: 계절별 식재료 고려
- 🔥 **예산 고려**: 가격대별 식재료 추천
- 🔥 **조리 시간**: 바쁜 직장인용 5분 요리
- 🔥 **운동량 고려**: 운동 강도에 따른 식단 조절

## 🔧 **고급 실험 기법**

### A/B 테스트로 프롬프트 성능 비교
```python
import time

async def performance_test():
    prompts = ["default", "improved", "김철수"]
    test_menus = ["김치찌개", "삼겹살구이", "아보카도샐러드", "떡볶이"]
    
    for prompt in prompts:
        service = GPTService(prompt)
        start_time = time.time()
        
        for menu in test_menus:
            result = await service.analyze_menu(menu)
            print(f"{prompt} - {menu}: {result['keto_score']}점")
        
        end_time = time.time()
        print(f"{prompt} 프롬프트 총 처리시간: {end_time - start_time:.2f}초\n")
```

### 프롬프트 정확도 평가
```python
# 정답 데이터 (영양사가 평가한 실제 키토 점수)
ground_truth = {
    "삼겹살구이": 95,
    "김치": 80,
    "떡볶이": 15,
    "아보카도": 90
}

async def accuracy_test():
    service = GPTService("김철수")
    correct = 0
    total = len(ground_truth)
    
    for menu, true_score in ground_truth.items():
        result = await service.analyze_menu(menu)
        predicted_score = result['keto_score']
        
        # 오차 ±10점 이내면 정답으로 인정
        if abs(predicted_score - true_score) <= 10:
            correct += 1
        
        print(f"{menu}: 정답 {true_score}, 예측 {predicted_score}")
    
    accuracy = correct / total * 100
    print(f"정확도: {accuracy:.1f}%")
```

## ⚠️ **중요한 주의사항**

### 🚨 Conflict 방지 규칙
1. **절대 수정 금지**: `base_prompts.py`
2. **조심스럽게 수정**: `team_prompts.py` (등록 부분만)
3. **자유롭게 수정**: `individual_prompts/본인이름_prompts.py`
4. **웹서버 테스트**: `config.py`의 `CURRENT_PROMPT`만 변경

### 💡 개발 워크플로우
```
1. individual_prompts/본인이름_prompts.py 생성
     ↓
2. team_prompts.py에 등록
     ↓  
3. 터미널에서 빠른 테스트
     ↓
4. config.py 수정 → 웹서버 재시작
     ↓
5. 웹브라우저에서 실제 테스트
     ↓
6. 성능 비교 및 개선
```

## 📊 **성능 평가 기준**

### 메뉴 분석 평가
- **정확도**: 실제 키토 점수와 얼마나 비슷한가?
- **일관성**: 같은 음식을 여러 번 분석해도 비슷한 결과가 나오는가?
- **속도**: 응답 시간이 빠른가?
- **한국 음식 특화**: 김치, 나물 등을 잘 평가하는가?

### 식단 추천 평가
- **영양소 정확도**: 탄단지 비율이 키토에 적합한가?
- **실용성**: 실제로 만들어 먹을 수 있는 요리인가?
- **선호도 반영**: 사용자 취향을 잘 반영했는가?
- **다양성**: 매번 다른 메뉴를 추천하는가?

## 🏆 **성공적인 프롬프트 실험 사례**

### 예시 1: 탄수화물 정확도 개선
```
문제: 기본 프롬프트가 김치의 탄수화물을 과대평가
해결: 발효식품 보너스와 정확한 영양성분 데이터 추가
결과: 김치 점수 60점 → 80점으로 개선, 더 현실적
```

### 예시 2: 한국 음식 특화
```
문제: 나물류, 젓갈류를 잘못 평가
해결: 한국 음식 특별 처리 로직 추가
결과: 시금치나물, 멸치젓 등의 평가 정확도 30% 향상
```

## 🎉 **마무리: 나만의 키토 전문가 만들기**

이제 여러분만의 키토 다이어트 전문가 AI를 만들 수 있습니다!

1. **관찰**: 기본 프롬프트의 부족한 점 찾기
2. **가설**: "이렇게 하면 더 좋아질 것 같다"
3. **실험**: 본인만의 프롬프트 작성
4. **검증**: 웹서버에서 실제 테스트
5. **개선**: 결과를 보고 지속적으로 개선

**목표: GPT가 영양사보다 더 정확하고 실용적인 키토 조언을 하도록 만들기!** 🥑
