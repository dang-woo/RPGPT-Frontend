"use client";

import { useState } from "react";
import axios from "axios";

export default function Page() {
    const [serverId, setServerId] = useState("all");
    const [characterName, setCharacterName] = useState("");
    const [itemLevelMin, setItemLevelMin] = useState("");
    const [itemLevelMax, setItemLevelMax] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    // 로스트아크 서버 목록
    const serverOptions = [
        { id: "all", name: "전체" },
        { id: "lupeon", name: "루페온" },
        { id: "abrelshud", name: "아브렐슈드" },
        { id: "kazeroth", name: "카제로스" },
        { id: "aman", name: "아만" },
        { id: "kadan", name: "카던" },
    ];

    // 검색 처리
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!characterName.trim()) {
            setError("캐릭터 이름을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError(null);
        setSearchResults([]);

        try {
            const response = await axios.get("http://localhost:8080/api/loa/character", {
                params: {
                    characterName,
                    server: serverId !== "all" ? serverId : undefined,
                },
            });

            let results = response.data ? [response.data] : [];
            // 아이템 레벨 필터링
            results = results.filter((char) => {
                const itemLevel = parseFloat(char.ArmoryProfile?.ItemAvgLevel?.replace(",", "") || 0);
                const minLevel = itemLevelMin ? parseFloat(itemLevelMin) : -Infinity;
                const maxLevel = itemLevelMax ? parseFloat(itemLevelMax) : Infinity;
                return itemLevel >= minLevel && itemLevel <= maxLevel;
            });

            if (results.length === 0) {
                setError("일치하는 캐릭터가 없습니다.");
            } else {
                setSearchResults(results);
            }
        } catch (err) {
            setError("검색 중 오류가 발생했습니다: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 상세 정보 조회
    const handleShowDetails = async (characterName) => {
        setModalLoading(true);
        setModalError(null);
        setSelectedCharacter(null);

        try {
            const response = await axios.get("http://localhost:8080/api/loa/character", {
                params: { characterName },
            });

            if (response.data) {
                setSelectedCharacter(response.data);
                setActiveTab("profile");
            } else {
                setModalError("캐릭터 정보를 불러오지 못했습니다.");
            }
        } catch (err) {
            setModalError("캐릭터 정보를 불러오지 못했습니다: " + err.message);
        } finally {
            setModalLoading(false);
        }
    };

    // 모달 닫기
    const closeModal = () => {
        setSelectedCharacter(null);
        setModalError(null);
    };

    // 대체 이미지
    const fallbackImage = "https://via.placeholder.com/150?text=No+Image";

    return (
        <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">로스트아크 캐릭터 조회</h1>

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
                <select
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    className="h-10 rounded-md border px-3 text-sm navigation-search"
                >
                    {serverOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="캐릭터 이름 입력"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="h-10 rounded-md border px-3 text-sm navigation-search"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="h-10 rounded-md bg-gray-800 text-white px-4 hover:bg-gray-700 transition-colors"
                >
                    {loading ? "검색 중..." : "검색"}
                </button>
            </form>

            {/* 필터링 창 */}
            <div className="mb-8 p-4 bg-gray-100 rounded-md">
                <h2 className="text-lg font-semibold mb-2">필터</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="number"
                        placeholder="최소 아이템 레벨"
                        value={itemLevelMin}
                        onChange={(e) => setItemLevelMin(e.target.value)}
                        className="h-10 rounded-md border px-3 text-sm navigation-search"
                    />
                    <input
                        type="number"
                        placeholder="최대 아이템 레벨"
                        value={itemLevelMax}
                        onChange={(e) => setItemLevelMax(e.target.value)}
                        className="h-10 rounded-md border px-3 text-sm navigation-search"
                    />
                </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
            )}

            {/* 검색 결과 */}
            {searchResults.length > 0 && (
                <div className="grid gap-4">
                    <h2 className="text-xl font-semibold">검색 결과</h2>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {searchResults.map((character) => (
                            <li
                                key={character.ArmoryProfile?.CharacterName || Math.random()}
                                className="border rounded-md p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleShowDetails(character.ArmoryProfile?.CharacterName)}
                            >
                                <div className="relative aspect-square max-h-64 overflow-hidden rounded-md mb-4">
                                    <img
                                        src={character.ArmoryProfile?.CharacterImage || fallbackImage}
                                        alt={character.ArmoryProfile?.CharacterName || "캐릭터"}
                                        className="w-full h-full object-contain"
                                        onError={(e) => (e.target.src = fallbackImage)}
                                    />
                                </div>
                                <p className="text-base">
                                    <strong>이름:</strong> {character.ArmoryProfile?.CharacterName || "없음"}
                                </p>
                                <p className="text-base">
                                    <strong>서버:</strong> {character.ArmoryProfile?.ServerName || "없음"}
                                </p>
                                <p className="text-base">
                                    <strong>레벨:</strong> {character.ArmoryProfile?.CharacterLevel || "없음"}
                                </p>
                                <p className="text-base">
                                    <strong>직업:</strong> {character.ArmoryProfile?.CharacterClassName || "없음"}
                                </p>
                                <p className="text-base">
                                    <strong>아이템 레벨:</strong> {character.ArmoryProfile?.ItemAvgLevel || "없음"}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 상세 정보 모달 */}
            {selectedCharacter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 navigation-overlay">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {modalLoading ? (
                            <div className="text-center">로딩 중...</div>
                        ) : modalError ? (
                            <div className="text-red-700">{modalError}</div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold mb-4">
                                    {selectedCharacter.ArmoryProfile?.CharacterName || "알 수 없는 캐릭터"}
                                </h2>

                                {/* 탭 네비게이션 */}
                                <div className="flex border-b mb-4">
                                    {["profile", "stats", "tendencies", "equipment", "collectibles"].map((tab) => (
                                        <button
                                            key={tab}
                                            className={`px-4 py-2 ${
                                                activeTab === tab ? "border-b-2 border-gray-800 font-semibold" : ""
                                            }`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab === "profile"
                                                ? "프로필"
                                                : tab === "stats"
                                                    ? "스탯"
                                                    : tab === "tendencies"
                                                        ? "성향"
                                                        : tab === "equipment"
                                                            ? "장비"
                                                            : "수집품"}
                                        </button>
                                    ))}
                                </div>

                                {/* 탭 컨텐츠 */}
                                {activeTab === "profile" && (
                                    <div>
                                        <div className="relative aspect-square max-h-48 overflow-hidden rounded-md mb-4">
                                            <img
                                                src={
                                                    selectedCharacter.ArmoryProfile?.CharacterImage || fallbackImage
                                                }
                                                alt={selectedCharacter.ArmoryProfile?.CharacterName || "캐릭터"}
                                                className="w-full h-full object-contain"
                                                onError={(e) => (e.target.src = fallbackImage)}
                                            />
                                        </div>
                                        <p>
                                            <strong>서버:</strong> {selectedCharacter.ArmoryProfile?.ServerName || "없음"}
                                        </p>
                                        <p>
                                            <strong>레벨:</strong> {selectedCharacter.ArmoryProfile?.CharacterLevel || "없음"}
                                        </p>
                                        <p>
                                            <strong>직업:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.CharacterClassName || "없음"}
                                        </p>
                                        <p>
                                            <strong>아이템 레벨:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.ItemAvgLevel || "없음"}
                                        </p>
                                        <p>
                                            <strong>원정대 레벨:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.ExpeditionLevel || "없음"}
                                        </p>
                                        <p>
                                            <strong>PvP 등급:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.PvpGradeName || "없음"}
                                        </p>
                                        <p>
                                            <strong>마을 레벨:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.TownLevel || "없음"}
                                        </p>
                                        <p>
                                            <strong>마을 이름:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.TownName || "없음"}
                                        </p>
                                        <p>
                                            <strong>타이틀:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.Title || "없음"}
                                        </p>
                                        <p>
                                            <strong>길드:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.GuildName || "없음"} (
                                            {selectedCharacter.ArmoryProfile?.GuildMemberGrade || "없음"})
                                        </p>
                                        <p>
                                            <strong>스킬 포인트:</strong>{" "}
                                            {selectedCharacter.ArmoryProfile?.UsingSkillPoint || "0"} /{" "}
                                            {selectedCharacter.ArmoryProfile?.TotalSkillPoint || "0"}
                                        </p>
                                    </div>
                                )}

                                {activeTab === "stats" && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">스탯</h3>
                                        <table className="w-full border-collapse">
                                            <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border p-2">타입</th>
                                                <th className="border p-2">값</th>
                                                <th className="border p-2">설명</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {selectedCharacter.ArmoryProfile?.Stats?.map((stat, index) => (
                                                <tr key={index}>
                                                    <td className="border p-2">{stat.Type}</td>
                                                    <td className="border p-2">{stat.Value}</td>
                                                    <td className="border p-2">
                                                        {stat.Tooltip?.map((tip, i) => (
                                                            <div
                                                                key={i}
                                                                dangerouslySetInnerHTML={{ __html: tip }}
                                                            />
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === "tendencies" && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">성향</h3>
                                        <table className="w-full border-collapse">
                                            <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border p-2">타입</th>
                                                <th className="border p-2">포인트</th>
                                                <th className="border p-2">최대 포인트</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {selectedCharacter.ArmoryProfile?.Tendencies?.map((tend, index) => (
                                                <tr key={index}>
                                                    <td className="border p-2">{tend.Type}</td>
                                                    <td className="border p-2">{tend.Point}</td>
                                                    <td className="border p-2">{tend.MaxPoint}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === "equipment" && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">장비</h3>
                                        <ul className="grid gap-4">
                                            {selectedCharacter.ArmoryEquipment?.map((equip, index) => (
                                                <li key={index} className="border rounded-md p-4 bg-gray-50">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={equip.Icon || fallbackImage}
                                                            alt={equip.Name || "장비"}
                                                            className="w-16 h-16 object-contain"
                                                            onError={(e) => (e.target.src = fallbackImage)}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">{equip.Name || "알 수 없는 장비"}</p>
                                                            <p>타입: {equip.Type || "없음"}</p>
                                                            <p>등급: {equip.Grade || "없음"}</p>
                                                            {equip.Tooltip && (
                                                                <div className="text-sm text-gray-600">
                                                                    <p>
                                                                        <strong>기본 효과:</strong>{" "}
                                                                        {equip.Tooltip?.match(/기본 효과<\/FONT>\",\"Element_001\":\"([^<]+)<BR>/i)?.[1] || "없음"}
                                                                    </p>
                                                                    <p>
                                                                        <strong>추가 효과:</strong>{" "}
                                                                        {equip.Tooltip?.match(/추가 효과<\/FONT>\",\"Element_001\":\"([^<]+)<BR>/i)?.[1] || "없음"}
                                                                    </p>
                                                                    <p>
                                                                        <strong>슬롯 효과:</strong>{" "}
                                                                        {equip.Tooltip?.match(/슬롯 효과<\/FONT><BR><FONT[^>]+>([^<]+)<img/i)?.[1] || "없음"}
                                                                    </p>
                                                                    <p>
                                                                        <strong>엘릭서:</strong>{" "}
                                                                        {equip.Tooltip?.match(/엘릭서<\/FONT><br><font[^>]+><FONT[^>]+>([^<]+)<\/FONT>/i)?.[1] || "없음"}
                                                                    </p>
                                                                    <p>
                                                                        <strong>초월 단계:</strong>{" "}
                                                                        {equip.Tooltip?.match(/초월\]<\/FONT> <FONT[^>]+>(\d+)<\/FONT>단계/i)?.[1] || "없음"}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === "collectibles" && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">수집품</h3>
                                        <ul className="grid gap-4">
                                            {selectedCharacter.Collectibles?.map((collect, index) => (
                                                <li key={index} className="border rounded-md p-4 bg-gray-50">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={collect.Icon || fallbackImage}
                                                            alt={collect.Type || "수집품"}
                                                            className="w-16 h-16 object-contain"
                                                            onError={(e) => (e.target.src = fallbackImage)}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">{collect.Type || "알 수 없는 수집품"}</p>
                                                            <p>
                                                                포인트: {collect.Point || "0"} / {collect.MaxPoint || "0"}
                                                            </p>
                                                            <ul className="text-sm">
                                                                {collect.CollectiblePoints?.map((point, i) => (
                                                                    <li key={i}>
                                                                        {point.PointName}: {point.Point || "0"} / {point.MaxPoint || "0"}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button
                                    onClick={closeModal}
                                    className="mt-4 w-full h-10 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                                >
                                    닫기
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}