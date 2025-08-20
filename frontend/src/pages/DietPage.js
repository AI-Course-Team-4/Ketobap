import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DietPage() {
    const { likes, dislikes, allergies } = useSelector((s) => s.preferences);
    // 1️⃣ 상태 변수 선언
    const [diet, setDiet] = useState({
        breakfast: "",
        lunch: "",
        dinner: ""
    });

    const [loading, setLoading] = useState(true);  // 데이터 로딩 상태
    const [error, setError] = useState(null);      // 에러 상태
    // 메타 정보 훅은 조건부 렌더보다 위에서 선언 (Hook 규칙 준수)
    const [meta, setMeta] = useState({ breakfast: null, lunch: null, dinner: null });

    // 2️⃣ API 호출 useEffect
    useEffect(() => {
        // 실제 구현 시: Supabase foods 테이블에서 음식 조회 후, Hugging Face로 keto_score 산정
        // 1) const { data } = await supabase.from('foods').select('*')
        // 2) const scored = await fetch(HF_API, { body: JSON.stringify({ name, ingredients }) })
        // 3) 사용자 조건(likes/dislikes/allergies)로 필터링 후 아침/점심/저녁 1개씩 추천

        // 아래는 임시 클라이언트 로직으로 동작하는 목업 데이터입니다. 실서비스에서 제거/교체됩니다.
        const mockFoods = [
            { name: "아보카도 샐러드", carbs: 10, protein: 8, fat: 20, calories: 280, keto_score: 92, tags: ["아보카도", "샐러드"] },
            { name: "닭가슴살 샐러드", carbs: 9, protein: 30, fat: 10, calories: 260, keto_score: 88, tags: ["닭가슴살", "샐러드"] },
            { name: "연어 구이", carbs: 0, protein: 25, fat: 18, calories: 300, keto_score: 95, tags: ["연어", "생선"] },
            { name: "버터 커피", carbs: 1, protein: 1, fat: 15, calories: 150, keto_score: 80, tags: ["버터", "커피"] },
        ];

        // 간단 필터링: dislikes나 allergies에 포함된 태그 제거
        const blocked = new Set([...(dislikes || []), ...(allergies || [])]);
        const filtered = mockFoods.filter((f) => !f.tags.some((t) => blocked.has(t)));

        const pick = (arr, idx) => arr[idx % arr.length];
        const b = pick(filtered, 0);
        const l = pick(filtered, 1);
        const d = pick(filtered, 2);
        setDiet({ breakfast: b?.name || "아보카도 샐러드", lunch: l?.name || "닭가슴살 샐러드", dinner: d?.name || "연어 구이" });
        setMeta({
            breakfast: b || mockFoods[0],
            lunch: l || mockFoods[1],
            dinner: d || mockFoods[2],
        });
        setLoading(false);
    }, [likes, dislikes, allergies]);

    // 3️⃣ 렌더링
    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;

    const MealCard = ({ title, food, img }) => (
        <div className="card">
            <h3>{title}</h3>
            {/* 이미지 경로 안내: 아래 이미지는 frontend/public/images/keto/ 폴더에 복사 후 사용하세요. */}
            <img src={img} alt={food?.name} style={{ width: "100%", borderRadius: 8, marginBottom: 8 }} />
            <p><strong>{food?.name}</strong></p>
            <p className="muted">탄수 {food?.carbs}g · 단백 {food?.protein}g · 지방 {food?.fat}g · {food?.calories}kcal</p>
            <p>키토 점수: <strong>{food?.keto_score}</strong></p>
        </div>
    );

    return (
        <div>
            <div className="kb-hero">
                <img src="/images/keto/kito7.jpg.png" alt="hero" />
                <div className="title">맞춤형 키토식단 찾기</div>
            </div>
            <div className="kb-row">
                <MealCard title="아침" food={meta.breakfast} img="/images/keto/kito3.jpg.png" />
                <MealCard title="점심" food={meta.lunch} img="/images/keto/kito3.jpg.png" />
                <MealCard title="저녁" food={meta.dinner} img="/images/keto/kito3.jpg.png" />
            </div>
            <Link to="/restaurants" className="kb-footer-cta">
                식단을 실천하기 어렵다면?  근처 음식점에서 키토식단 찾기
            </Link>
        </div>
    );
}
