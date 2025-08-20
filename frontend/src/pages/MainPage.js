import { Link } from "react-router-dom";

export default function MainPage() {
    return (
        <div>
            <h1>맞춤형 키토 식단 서비스</h1>
            <nav>
                <Link to="/profile">개인정보 입력</Link><br />
                <Link to="/diet">식단 추천</Link><br />
                <Link to="/restaurants">주변 음식점</Link>
            </nav>
        </div>
    );
}
