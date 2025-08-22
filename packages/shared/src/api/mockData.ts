import { Food, RestaurantMenu } from '../types';

// 로컬 개발용 모의 음식 데이터
export const MOCK_FOODS: Food[] = [
  {
    id: 1,
    name: '아보카도 샐러드',
    carbs: 8,
    protein: 4,
    fat: 22,
    calories: 250,
    keto_score: 53,
    tags: ['아보카도', '샐러드', '채소']
  },
  {
    id: 2,
    name: '연어 스테이크',
    carbs: 0,
    protein: 25,
    fat: 18,
    calories: 280,
    keto_score: 55,
    tags: ['연어', '생선', '오메가3']
  },
  {
    id: 3,
    name: '치즈 오믈렛',
    carbs: 2,
    protein: 15,
    fat: 20,
    calories: 260,
    keto_score: 80,
    tags: ['계란', '치즈', '유제품']
  },
  {
    id: 4,
    name: '삼겹살 구이',
    carbs: 0,
    protein: 20,
    fat: 35,
    calories: 380,
    keto_score: 85,
    tags: ['돼지고기', '구이']
  },
  {
    id: 5,
    name: '마카다미아 너트',
    carbs: 4,
    protein: 2,
    fat: 21,
    calories: 200,
    keto_score: 70,
    tags: ['견과류', '마카다미아']
  },
  {
    id: 6,
    name: '코코넛 오일 볶음 브로콜리',
    carbs: 6,
    protein: 3,
    fat: 14,
    calories: 150,
    keto_score: 83,
    tags: ['브로콜리', '코코넛오일', '채소']
  },
  {
    id: 7,
    name: '버터 구운 새우',
    carbs: 1,
    protein: 18,
    fat: 12,
    calories: 180,
    keto_score: 55,
    tags: ['새우', '버터', '해산물']
  },
  {
    id: 8,
    name: '치킨 윙 바베큐',
    carbs: 2,
    protein: 22,
    fat: 16,
    calories: 240,
    keto_score: 82,
    tags: ['닭고기', '바베큐']
  },
  {
    id: 9,
    name: '그릭 요거트 베리',
    carbs: 12,
    protein: 10,
    fat: 5,
    calories: 120,
    keto_score: 60,
    tags: ['요거트', '베리', '유제품']
  },
  {
    id: 10,
    name: '아몬드 버터 셀러리',
    carbs: 6,
    protein: 4,
    fat: 8,
    calories: 100,
    keto_score: 65,
    tags: ['아몬드', '셀러리', '견과류']
  }
];

// 로컬 개발용 모의 음식점 데이터
export const MOCK_RESTAURANTS: RestaurantMenu[] = [
  {
    id: 1,
    restaurant_name: '샐러디',
    menu_name: '아보카도 치킨 샐러드',
    description: '신선한 아보카도와 구운 치킨이 들어간 저탄수 샐러드',
    keto_score: 88,
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    latitude: 37.5665,
    longitude: 126.9780,
    naver_search_keyword: '강남 샐러디 아보카도 치킨 샐러드'
  },
  {
    id: 2,
    restaurant_name: '키토 키친',
    menu_name: '연어 버터 구이',
    description: '노르웨이 연어를 버터에 구운 키토 전문 요리',
    keto_score: 92,
    address: '서울시 강남구 논현로 456',
    phone: '02-2345-6789',
    latitude: 37.5172,
    longitude: 127.0286,
    naver_search_keyword: '강남 키토 키친 연어 버터 구이'
  },
  {
    id: 3,
    restaurant_name: '로카보 카페',
    menu_name: '코코넛 오일 커피',
    description: '신선한 코코넛 오일을 넣은 저탄수 커피',
    keto_score: 85,
    address: '서울시 강남구 강남대로 789',
    phone: '02-3456-7890',
    latitude: 37.4979,
    longitude: 127.0276,
    naver_search_keyword: '강남 로카보 카페 코코넛 오일 커피'
  },
  {
    id: 4,
    restaurant_name: '비건 델리',
    menu_name: '견과류 치즈 플래터',
    description: '다양한 견과류와 자연 치즈 조합',
    keto_score: 86,
    address: '서울시 강남구 선릉로 321',
    phone: '02-4567-8901',
    latitude: 37.5044,
    longitude: 127.0489,
    naver_search_keyword: '강남 비건 델리 견과류 치즈 플래터'
  },
  {
    id: 5,
    restaurant_name: '헬시 밸런스',
    menu_name: '브로콜리 베이컨 볶음',
    description: '신선한 브로콜리와 베이컨을 올리브오일로 볶은 요리',
    keto_score: 84,
    address: '서울시 강남구 역삼로 654',
    phone: '02-5678-9012',
    latitude: 37.5004,
    longitude: 127.0374,
    naver_search_keyword: '강남 헬시 밸런스 브로콜리 베이컨 볶음'
  },
  {
    id: 6,
    restaurant_name: '프레시 보울',
    menu_name: '그릭 요거트 베리 보울',
    description: '무설탕 그릭 요거트에 신선한 베리 토핑',
    keto_score: 65,
    address: '서울시 강남구 삼성로 147',
    phone: '02-6789-0123',
    latitude: 37.5110,
    longitude: 127.0590,
    naver_search_keyword: '강남 프레시 보울 그릭 요거트 베리 보울'
  }
];
