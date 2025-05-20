"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DnfCharacterCard from "@/components/dnf/DnfCharacterCard";
import SearchForm from "@/components/search/SearchForm";

// 서버 목록 (기존 MainPage 또는 MyPage에서 가져오거나 동일하게 정의)
const serverOptions = [
    { id: "all", name: "전체" },
    { id: "cain", name: "카인" },
    { id: "diregie", name: "디레지에" },
    { id: "siroco", name: "시로코" },
    { id: "prey", name: "프레이" },
    { id: "casillas", name: "카시야스" },
    { id: "hilder", name: "힐더" },
    { id: "anton", name: "안톤" },
    { id: "bakal", name: "바칼" },
    // 모험단 검색은 캐릭터 등록 시 적합하지 않을 수 있으므로 일단 제외하거나 필요시 포함
];

export default function RegisterCharacterPage() {
    const [serverId, setServerId] = useState("cain"); // 기본 서버 선택 (예: 카인)
    const [characterName, setCharacterName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!characterName.trim()) {
            setError("캐릭터 이름을 입력해주세요.");
            return;
        }
        setLoading(true);
        setError(null);
        setSearchResults([]);
        try {
            // 메인 페이지의 검색 API와 동일한 것을 사용
            const response = await axios.get("http://localhost:8080/api/df/search", {
                params: {
                    server: serverId,
                    name: characterName,
                },
            });
            const rows = response.data.rows || [];
            if (rows.length === 0) {
                setError("일치하는 캐릭터가 없습니다.");
            } else {
                setSearchResults(rows);
            }
        } catch (err) {
            setError("검색 중 오류가 발생했습니다: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterCharacter = (character) => {
        // TODO: 실제 캐릭터 등록 API 호출 로직 구현 필요
        console.log("캐릭터 등록 시도:", character);
        alert(`${character.characterName} (${serverOptions.find(s => s.id === character.serverId)?.name}) 캐릭터를 등록합니다. (API 연동 필요)`);
        // 등록 성공 후에는 예를 들어 마이페이지로 이동하거나, UI에 등록 완료 메시지를 표시할 수 있습니다.
        // router.push("/mypage"); 
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

                <div className="w-full max-w-2xl mx-auto">
                    <SearchForm 
                        onSubmit={handleSearch}
                        serverOptions={serverOptions} 
                        selectedServer={serverId}
                        onServerChange={(e) => setServerId(e.target.value)}
                        characterPlaceholder="등록할 캐릭터명 입력"
                        characterName={characterName}
                        onCharacterNameChange={(e) => setCharacterName(e.target.value)}
                        isLoading={loading}
                        buttonText="캐릭터 검색"
                    />
                </div>

                {error && (
                    <div className="mt-6 mb-4 p-3 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-md text-center text-sm w-full max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {searchResults.length > 0 && (
                    <div className="w-full mt-10 mx-auto flex flex-col flex-grow">
                        <h2 className="text-2xl font-semibold mb-6 text-center mypage-title">
                            검색 결과 - 등록할 캐릭터를 선택하세요
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchResults.map((character) => (
                                <li key={`${character.serverId}-${character.characterId}`}>
                                    <DnfCharacterCard 
                                        character={character}
                                        serverOptions={serverOptions} 
                                        onRegister={handleRegisterCharacter}
                                    />
                                </li>
                            ))}
                        </ul>
                        {searchResults.length > 0 && !loading && (
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-400">캐릭터 카드를 클릭하여 등록하세요.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 