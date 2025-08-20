import { useState } from "react";

export default function ProfilePage() {
    const [likes, setLikes] = useState("");
    const [dislikes, setDislikes] = useState("");
    const [disease, setDisease] = useState("");
    const [status, setStatus] = useState(""); // 성공/실패 상태 표시

    const handleSave = () => {
        // TODO: 실제 API URL로 변경
        fetch("https://jsonplaceholder.typicode.com/posts", { // 더미 POST API 사용
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ likes, dislikes, disease }) // 백엔드에 보낼 데이터
        })
            .then((response) => {
                if (!response.ok) throw new Error("네트워크 오류");
                return response.json();
            })
            .then((data) => {
                console.log("백엔드 응답:", data);
                setStatus("저장 성공!");
            })
            .catch((err) => {
                console.error(err);
                setStatus("저장 실패");
            });
    };

    return (
        <div>
            <h2>개인정보 입력</h2>
            <label>
                선호 음식: <input value={likes} onChange={(e) => setLikes(e.target.value)} />
            </label>
            <br />
            <label>
                비선호 음식: <input value={dislikes} onChange={(e) => setDislikes(e.target.value)} />
            </label>
            <br />
            <label>
                지병/알레르기: <input value={disease} onChange={(e) => setDisease(e.target.value)} />
            </label>
            <br />
            <button onClick={handleSave}>저장</button>
            <p>{status}</p> {/* 저장 성공/실패 메시지 표시 */}
        </div>
    );
}
