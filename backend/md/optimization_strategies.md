# GPT 추론 시간 단축 전략

## 1. 즉시 적용 가능한 방법들

### A. 데이터 양 줄이기 (가장 효과적)
```python
# 상위 인기 식당만 선택
popular_restaurants = restaurants.head(15)  # 700개 → 150개 메뉴로 축소

# 메인 메뉴만 처리
main_menus_only = menus[menus['category'] == 'main']

# 중복 제거
unique_menus = menus.drop_duplicates(subset=['name'])
```

### B. 배치 처리로 병렬화
```python
# 현재: 순차 처리 (느림)
for menu in menus:
    result = await gpt_service.analyze_menu(menu)

# 개선: 배치 병렬 처리 (빠름)
batch_size = 5
for i in range(0, len(menus), batch_size):
    batch = menus[i:i+batch_size]
    tasks = [gpt_service.analyze_menu(menu) for menu in batch]
    results = await asyncio.gather(*tasks)
```

### C. GPT 모델 설정 최적화
```python
# 현재 설정
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    max_tokens=100,
    temperature=0.3
)

# 최적화된 설정
response = client.chat.completions.create(
    model="gpt-3.5-turbo-1106",  # 더 빠른 버전
    max_tokens=50,               # 토큰 수 절반
    temperature=0.1              # 더 빠른 응답
)
```

## 2. 중급 최적화 방법들

### A. 하이브리드 접근법
```python
def hybrid_keto_score(menu_name):
    # 1단계: 룰 기반 사전 분류
    keto_friendly_keywords = ['샐러드', '스테이크', '계란', '치즈']
    keto_unfriendly_keywords = ['밥', '면', '빵', '파스타']
    
    base_score = 50
    for keyword in keto_friendly_keywords:
        if keyword in menu_name:
            base_score += 20
            break
    
    for keyword in keto_unfriendly_keywords:
        if keyword in menu_name:
            base_score -= 25
            break
    
    # 2단계: 애매한 경우만 GPT 사용
    if 30 <= base_score <= 70:  # 애매한 경우만
        return await gpt_service.analyze_menu(menu_name)
    else:
        return {"keto_score": base_score, "is_main": True}
```

### B. 캐싱 시스템
```python
import hashlib
import json

class MenuCache:
    def __init__(self):
        self.cache_file = "menu_cache.json"
        self.cache = self.load_cache()
    
    def get_cache_key(self, menu_name):
        return hashlib.md5(menu_name.encode()).hexdigest()
    
    async def get_or_analyze(self, menu_name):
        cache_key = self.get_cache_key(menu_name)
        
        if cache_key in self.cache:
            return self.cache[cache_key]  # 캐시된 결과 사용
        
        result = await gpt_service.analyze_menu(menu_name)
        self.cache[cache_key] = result
        self.save_cache()
        return result
```

## 3. 고급 최적화 방법들

### A. 점진적 처리
```python
# 전체를 한 번에 처리하지 않고 단계별로
async def incremental_processing():
    # 1단계: 상위 100개 메뉴만
    top_menus = menus.head(100)
    await process_menus(top_menus)
    
    # 2단계: 나머지는 백그라운드에서
    remaining_menus = menus.tail(-100)
    await process_menus_background(remaining_menus)
```

### B. 샘플링 기반 패턴 학습
```python
# 30% 샘플만 GPT로 분석
sample_menus = menus.sample(frac=0.3)
gpt_results = await analyze_with_gpt(sample_menus)

# 패턴 학습 후 나머지에 적용
pattern_model = train_simple_model(gpt_results)
remaining_results = pattern_model.predict(remaining_menus)
```

## 4. 추론 시간 예상 비교

| 방법 | 메뉴 수 | 예상 시간 | 정확도 |
|------|---------|-----------|--------|
| 현재 (전체 GPT) | 700개 | 15-20분 | 95% |
| 상위 식당만 | 150개 | 3-5분 | 90% |
| 하이브리드 | 700개 | 5-8분 | 85% |
| 배치 병렬 처리 | 700개 | 8-12분 | 95% |
| 샘플링 | 700개 | 2-3분 | 80% |

## 5. 권장 단계별 적용

### 1단계 (즉시 적용)
1. **상위 식당 15개만 선택** → 700개 → 150개
2. **배치 크기 5개로 병렬 처리**
3. **max_tokens를 50으로 제한**

### 2단계 (1주 후)
1. **하이브리드 룰 기반 시스템 구축**
2. **캐싱 시스템 도입**

### 3단계 (필요시)
1. **점진적 처리 시스템**
2. **샘플링 기반 패턴 학습**

## 6. 비용 최적화 효과

| 방법 | API 호출 수 | 예상 비용 절약 |
|------|-------------|----------------|
| 현재 | 700회 | - |
| 상위 식당만 | 150회 | 78% 절약 |
| 하이브리드 | 200회 | 71% 절약 |
| 캐싱 적용 | 50회 (재실행시) | 93% 절약 |
