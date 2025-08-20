import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setPreferences } from "../store/preferencesSlice";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const [likes, setLikes] = useState([]);       // 선호 음식 여러 개
    const [dislikes, setDislikes] = useState([]); // 비선호 음식 여러 개
    const [disease, setDisease] = useState([]);   // 지병/알레르기 여러 개
    const [status, setStatus] = useState("");     // 성공/실패 상태 표시
    const [isSaving, setIsSaving] = useState(false); // 로딩 오버레이

    const [likesEtc, setLikesEtc] = useState("");       // 기타 입력
    const [dislikesEtc, setDislikesEtc] = useState(""); // 기타 입력
    const [diseaseEtc, setDiseaseEtc] = useState("");   // 기타 입력

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 버튼 클릭 시 해당 섹션의 체크박스 표시/접기 토글
    const [open, setOpen] = useState({ likes: true, dislikes: true, disease: true });

    const handleSave = async () => {
        const likesFinal = likes.concat(likesEtc ? [likesEtc] : []);
        const dislikesFinal = dislikes.concat(dislikesEtc ? [dislikesEtc] : []);
        const diseaseFinal = disease.concat(diseaseEtc ? [diseaseEtc] : []);

        // 간단 유효성 검사: 최소 1개는 선택
        if (likesFinal.length === 0 && dislikesFinal.length === 0 && diseaseFinal.length === 0) {
            setStatus("최소 한 항목 이상 선택하거나 입력해주세요.");
            return;
        }

        try {
            setStatus("");
            setIsSaving(true);
            // 실제 백엔드 연동 시 이 부분을 Supabase 또는 사내 API로 교체합니다.
            // 예: await supabase.from('user_preferences').insert({...})
            // 아래의 fetch는 임시 더미 API입니다. 실서비스에서는 제거됩니다.
            const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    likes: likesFinal,
                    dislikes: dislikesFinal,
                    disease: diseaseFinal
                }) // 백엔드에 보낼 데이터
            });
            if (!response.ok) throw new Error("네트워크 오류");
            await response.json();
            // 글로벌 상태 업데이트 (비회원 기반, 클라이언트 상태만 유지)
            dispatch(setPreferences({
                likes: likesFinal,
                dislikes: dislikesFinal,
                allergies: diseaseFinal,
            }));
            setStatus("");
            // 저장 완료 후 추천 식단 페이지로 이동
            navigate("/diet");
        } catch (err) { 
            console.error(err);
            setStatus("저장 실패: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const foodOptions = ["아보카도", "치즈", "닭가슴살", "연어", "샐러드", "기타"];
    const diseaseOptions = ["없음", "견과류", "유제품", "갑각류", "글루텐", "기타"];

    // 체크박스 선택 처리 함수
    const handleCheck = (value, stateArray, setState) => {
        if (stateArray.includes(value)) {
            setState(stateArray.filter((v) => v !== value));
        } else {
            setState([...stateArray, value]);
        }
    };

    return (
        <div className="kb-form">
            <div className="kb-hero">
                <img src="/images/keto/kito4.jpg.png" alt="hero" />
                <div className="title">맞춤형 키토식단 찾기</div>
            </div>
            <div className="kb-space"></div>

            {/* 선호 음식 */}
            <button className="kb-big-input" type="button" onClick={()=>setOpen({...open, likes:!open.likes})}>선호하는 음식 선택</button>
            {open.likes && (
            <div className="kb-checks">
                {foodOptions.map((food) => (
                    <label key={food}>
                        <input
                            type="checkbox"
                            checked={likes.includes(food)}
                            onChange={() => handleCheck(food, likes, setLikes)}
                        />
                        {food}
                    </label>
                ))}
                {likes.includes("기타") && (
                    <input
                        type="text"
                        placeholder="기타 입력"
                        maxLength={20}
                        value={likesEtc}
                        onChange={(e) => setLikesEtc(e.target.value)}
                    />
                )}
            </div>
            )}

            {/* 비선호 음식 */}
            <button className="kb-big-input" type="button" onClick={()=>setOpen({...open, dislikes:!open.dislikes})}>선호하지 않는 음식 선택</button>
            {open.dislikes && (
            <div className="kb-checks">
                {foodOptions.map((food) => (
                    <label key={food + "dis"}>
                        <input
                            type="checkbox"
                            checked={dislikes.includes(food)}
                            onChange={() => handleCheck(food, dislikes, setDislikes)}
                        />
                        {food}
                    </label>
                ))}
                {dislikes.includes("기타") && (
                    <input
                        type="text"
                        placeholder="기타 입력"
                        maxLength={20}
                        value={dislikesEtc}
                        onChange={(e) => setDislikesEtc(e.target.value)}
                    />
                )}
            </div>
            )}

            {/* 지병/알레르기 */}
            <button className="kb-big-input" type="button" onClick={()=>setOpen({...open, disease:!open.disease})}>지병 및 알레르기 선택</button>
            {open.disease && (
            <div className="kb-checks">
                {diseaseOptions.map((d) => (
                    <label key={d}>
                        <input
                            type="checkbox"
                            checked={disease.includes(d)}
                            onChange={() => handleCheck(d, disease, setDisease)}
                        />
                        {d}
                    </label>
                ))}
                {disease.includes("기타") && (
                    <input
                        type="text"
                        placeholder="기타 입력"
                        maxLength={20}
                        value={diseaseEtc}
                        onChange={(e) => setDiseaseEtc(e.target.value)}
                    />
                )}
            </div>
            )}

            <br />
            <button className="kb-cta" onClick={handleSave}>나에게 딱 맞는 키토식단은?</button>
            {status && <p>{status}</p>}

            {isSaving && (
                <div className="kb-loading-overlay">
                    <div className="kb-loading">
                        <div className="kb-loader-hero">
                            {/* 로딩 일러스트는 아래 파일로 대체 가능합니다: /public/images/ui/bowl.png, /public/images/ui/avocado.png */}
                            <img className="kb-bowl" src="/images/keto/kito6.jpg.png" alt="bowl" />
                            <img className="kb-avocado" src="/images/keto/kito7.jpg.png" alt="avocado" />
                        </div>
                        <div className="kb-progress"><div className="kb-progress-bar" /></div>
                        <div className="kb-tip">TIP! 물을 자주 마시면 포만감이 늘어요 💧</div>
                    </div>
                </div>
            )}
        </div>
    );
}
