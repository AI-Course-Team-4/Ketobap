import { Link } from "react-router-dom";

export default function MainPage() {
    return (
        <div>
            <div className="kb-hero">
                {/* 배경 이미지는 public/images/keto/kito.jpg.png 로 설정했습니다. */}
                <img src="/images/keto/kito4.jpg.png" alt="hero" />
                <div className="title">맞춤형 키토식단 찾기</div>
            </div>

            <div style={{ marginTop: 16 }} className="kb-row">
                <Link to="/profile" className="kb-card" style={{ textDecoration: 'none' }}>
                    <img className="icon" src="/images/keto/kito4.jpg.png" alt="profile" />
                    <h3>개인정보 입력</h3>
                    <p>선호/비선호/알레르기 정보를 선택해 주세요.</p>
                </Link>
                <Link to="/diet" className="kb-card" style={{ textDecoration: 'none' }}>
                    <img className="icon" src="/images/keto/kito5.jpg.png" alt="diet" />
                    <h3>오늘의 추천 식단</h3>
                    <p>조건에 맞게 아침/점심/저녁을 추천합니다.</p>
                </Link>
                <Link to="/restaurants" className="kb-card" style={{ textDecoration: 'none' }}>
                    <img className="icon" src="/images/keto/kito6.jpg.png" alt="restaurants" />
                    <h3>근처 외식 추천</h3>
                    <p>강남역 근처 키토 친화 메뉴 5개를 확인하세요.</p>
                </Link>
            </div>
            <Link to="/restaurants" className="kb-footer-cta">
                식단을 실천하기 어렵다면?  근처 음식점에서 키토식단 찾기
            </Link>
        </div>
    );
}
