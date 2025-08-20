import { useState, useEffect } from "react";

export default function DietPage() {
    // 1️⃣ 상태 변수 선언
    const [diet, setDiet] = useState({
        breakfast: "",
        lunch: "",
        dinner: ""
    });

    const [loading, setLoading] = useState(true);  // 데이터 로딩 상태
    const [error, setError] = useState(null);      // 에러 상태

    // 2️⃣ API 호출 useEffect
    useEffect(() => {
        // TODO: 실제 API URL로 변경
        fetch("https://jsonplaceholder.typicode.com/posts/1")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("네트워크 오류 발생");
                }
                return response.json();
            })
            .then((data) => {
                // 임시 변환: 더미 API 결과를 식단 형식으로 매핑
                setDiet({
                    breakfast: "아보카도 샐러드",       // data.title 같은 실제 API 필드 매핑 가능
                    lunch: "닭가슴살 샐러드",
                    dinner: "연어 구이"
                });
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // 3️⃣ 렌더링
    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;

    return (
        <div>
            <h2>오늘의 식단 추천</h2>
            <p>아침: {diet.breakfast}</p>
            <p>점심: {diet.lunch}</p>
            <p>저녁: {diet.dinner}</p>
            <button>레시피 추가</button>
        </div>
    );
}
