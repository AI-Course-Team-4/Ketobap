import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RestaurantPage() {
    const { dislikes, allergies } = useSelector((s) => s.preferences);
    const thumbFiles = ["kito3.jpg.png", "kito4.jpg.png", "kito5.jpg.png", "kito6.jpg.png", "kito7.jpg.png"]; // 순환용 썸네일
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 실제 구현 시: Supabase restaurant_menus 테이블에서 상위 5개 조회 후 조건 필터링
        // 예: const { data } = await supabase.from('restaurant_menus').select('*').gte('keto_score', 80).limit(5)
        // const filtered = data.filter(menu => 조건)

        // 임시 데이터: 강남역 주변 키토 친화 더미 메뉴
        const mock = [
            { restaurant_name: "샐러디 강남역점", menu_name: "닭가슴살 샐러드", keto_score: 92 },
            { restaurant_name: "써브웨이 강남역점", menu_name: "로티세리 치킨 샐러드", keto_score: 88 },
            { restaurant_name: "바스버거 강남", menu_name: "번 없이 버거 패티 샐러드", keto_score: 85 },
            { restaurant_name: "도스타코스", menu_name: "볼케이노 샐러드(또르티야 제외)", keto_score: 84 },
            { restaurant_name: "폴바셋", menu_name: "버터 커피", keto_score: 80 },
        ];

        const blocked = new Set([...(dislikes || []), ...(allergies || [])]);
        const filtered = mock.filter((m) => {
            return ![m.menu_name, m.restaurant_name].some((t) => blocked.has(t));
        });

        const withUrl = filtered.map((m) => ({
            name: `${m.restaurant_name} ${m.menu_name}`,
            score: m.keto_score,
            url: "https://search.naver.com/search.naver?query=" + encodeURIComponent(`강남 ${m.restaurant_name} ${m.menu_name}`),
        }));
        setRestaurants(withUrl);
        setLoading(false);
    }, [dislikes, allergies]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;

    return (
        <div>
            <div className="kb-hero">
                <img src="/images/keto/kito4.jpg.png" alt="hero" />
                <div className="title">근처 음식점에서 키토식단을 찾아보세요!</div>
            </div>
            <div className="kb-list">
                {restaurants.map((r, idx) => (
                    <div key={idx} className="kb-item">
                        {/* 썸네일 이미지는 보유한 keto 이미지를 순환하여 사용합니다. */}
                        <img src={`/images/keto/${thumbFiles[idx % thumbFiles.length]}`} alt="thumb" />
                        <div>
                            <a href={r.url} target="_blank" rel="noreferrer">{r.name}</a>
                            <div className="kb-muted-cta">메뉴 상세정보 확인</div>
                        </div>
                        <div className="kb-score">{r.score}점</div>
                    </div>
                ))}
            </div>
            <Link to="/diet" className="kb-footer-cta">
                다른 추천이 보고 싶다면?  오늘의 추천 식단으로 돌아가기
            </Link>
            {/* 실제 서비스에서는 Supabase restaurant_menus 테이블에서 불러옵니다. */}
        </div>
    );
}
