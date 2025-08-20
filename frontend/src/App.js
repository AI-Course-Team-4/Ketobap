
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import DietPage from "./pages/DietPage";
import RestaurantPage from "./pages/RestaurantPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/diet" element={<DietPage />} />
                <Route path="/restaurants" element={<RestaurantPage />} />
            </Routes>
        </Router>
    );
}
;
