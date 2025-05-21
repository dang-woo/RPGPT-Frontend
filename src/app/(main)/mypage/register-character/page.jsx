"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import axios from "axios"; // apiClient를 사용하므로 주석 처리 또는 삭제
import apiClient from "@/lib/apiClient"; // apiClient 임포트
// import DnfCharacterCard from "@/components/dnf/DnfCharacterCard"; // 직접 등록 방식으로 변경되므로 주석 처리
// import SearchForm from "@/components/search/SearchForm"; // 직접 등록 방식으로 변경되므로 주석 처리

// 서버 목록 (기존 MainPage 또는 MyPage에서 가져오거나 동일하게 정의)
const serverOptions = [
    { id: "cain", name: "카인" },
    { id: "diregie", name: "디레지에" },
    { id: "siroco", name: "시로코" },
    { id: "prey", name: "프레이" },
    { id: "casillas", name: "카시야스" },
    { id: "hilder", name: "힐더" },
    { id: "anton", name: "안톤" },
    { id: "bakal", name: "바칼" },
    // 모험단 검색은 캐릭터 등록 시 적합하지 않으므로 'all' 또는 'adven' 서버는 제외하거나,
    // 백엔드 API가 'adven'을 serverId로 받고 adventureName으로 모험단 검색 후 캐릭터를 특정하는 로직이라면 포함 가능
];

export default function RegisterCharacterPage() {
    const [serverId, setServerId] = useState("cain");
    const [adventureName, setAdventureName] = useState("");
    const [characterName, setCharacterName] = useState("");
    // const [searchResults, setSearchResults] = useState([]); // 직접 등록으로 변경되어 검색 결과 상태 불필요
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const router = useRouter();

    // 직접 등록 방식으로 변경되어 기존 handleSearch 함수 불필요

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!serverId || !adventureName.trim() || !characterName.trim()) {
            setError("서버, 모험단명, 캐릭터명을 모두 입력해주세요.");
            setSuccessMessage(null);
            return;
        }
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const payload = {
                serverId,
                adventureName,
                characterName,
            };
            // API 요청 시 CharacterRegistRequestDto에 맞게 데이터 전달
            const response = await apiClient.post("/characters", payload);

            if (response.data && response.data.success) {
                setSuccessMessage(response.data.message || "캐릭터가 성공적으로 등록되었습니다.");
                // 성공 후 폼 초기화 또는 페이지 이동
                setServerId("cain");
                setAdventureName("");
                setCharacterName("");
                // alert(response.data.message || "캐릭터가 성공적으로 등록되었습니다.");
                // router.push("/mypage"); // 마이페이지로 이동하거나, 현재 페이지에 메시지 표시
            } else {
                setError(response.data?.message || "캐릭터 등록에 실패했습니다.");
            }
        } catch (err) {
            setError("캐릭터 등록 중 오류가 발생했습니다: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col min-h-screen pt-16 w-full">
            <div className="container mx-auto px-4 py-8 flex flex-col flex-grow mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h1 className="text-3xl font-bold mypage-title mb-4 sm:mb-0">
                        내 캐릭터 등록
                    </h1>
                    <button
                        onClick={() => router.back()}
                        className="mypage-button text-sm px-4 py-2 self-start sm:self-center mt-2 sm:mt-0 whitespace-nowrap"
                    >
                        &larr; 마이페이지로 돌아가기
                    </button>
                </div>

                <div className="w-full max-w-lg mx-auto bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700">
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="server-id" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">서버</label>
                            <select
                                id="server-id"
                                value={serverId}
                                onChange={(e) => setServerId(e.target.value)}
                                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                required
                            >
                                {serverOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="adventure-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">모험단명</label>
                            <input
                                type="text"
                                id="adventure-name"
                                value={adventureName}
                                onChange={(e) => setAdventureName(e.target.value)}
                                placeholder="모험단명을 입력하세요"
                                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="character-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">캐릭터명</label>
                            <input
                                type="text"
                                id="character-name"
                                value={characterName}
                                onChange={(e) => setCharacterName(e.target.value)}
                                placeholder="캐릭터명을 입력하세요"
                                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mypage-button py-3 text-base"
                            >
                                {loading ? "등록 중..." : "캐릭터 등록하기"}
                            </button>
                        </div>
                    </form>
                </div>

                {error && (
                    <div className="mt-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-md text-center text-sm w-full max-w-lg mx-auto">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mt-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-md text-center text-sm w-full max-w-lg mx-auto">
                        {successMessage} (캐릭터 ID: {response.data?.characterId}) {/* 백엔드 응답에 따라 characterId 등을 표시할 수 있습니다. */}
                    </div>
                )}

                {/* 기존 검색 결과 표시는 직접 등록 방식으로 변경되어 제거 */}
            </div>
        </div>
    );
} 