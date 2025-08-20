import { useState, useEffect } from "react";

export default function RestaurantPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: 실제 API URL로 변경
        fetch("https://jsonplaceholder.typicode.com/users") // 더미 API 사용
            .then((response) => {
                if (!response.ok) throw new Error("네트워크 오류");
                return response.json();
            })
            .then((data) => {
                // 더미 API 데이터를 음식점 형식으로 변환
                const dummyRestaurants = data.slice(0, 5).map((item, idx) => ({
                    name: item.name,
                    score: 80 + idx * 3, // 더미 점수
                    url: "https://search.naver.com/search.naver?query=" + encodeURIComponent(item.name)
                }));
                setRestaurants(dummyRestaurants);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;

    return (
        <div>
            <h2>주변 음식점 추천 (강남역)</h2>
            <ul>
                {restaurants.map((r, idx) => (
                    <li key={idx}>
                        <a href={r.url} target="_blank" rel="noreferrer">
                            {r.name} (키토점수: {r.score})
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
