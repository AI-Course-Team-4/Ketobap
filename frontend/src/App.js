
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import DietPage from "./pages/DietPage";
import RestaurantPage from "./pages/RestaurantPage";

export default function App() {
    return (
        <Router>
            <div className="kb-header">
                <div className="brand">
                    {/* 로고는 public/images/keto/kito5.jpg.png 사용. 클릭 시 메인으로 이동 */}
                    <Link to="/">
                        <img src="/images/keto/kito5.jpg.png" alt="KetoBap" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
                    </Link>
                    <Link to="/" style={{ color: '#2a3d1a', textDecoration: 'none' }}></Link>
                </div>
            </div>
            <div className="container">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/diet" element={<DietPage />} />
                    <Route path="/restaurants" element={<RestaurantPage />} />
                </Routes>
            </div>
        </Router>
    );
}
;
