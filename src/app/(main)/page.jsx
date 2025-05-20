"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DnfCharacterCard from "@/components/dnf/DnfCharacterCard";
import SearchForm from "@/components/search/SearchForm";

export default function MainPage() { // 컴포넌트 이름을 MainPage 또는 HomePage 등으로 변경하는 것이 좋음
  const [serverId, setServerId] = useState("all");
  const [characterName, setCharacterName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

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
    { id: "adven", name: "모험단" },
  ];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    console.log("Current serverId state:", serverId, "Current characterName state:", characterName);

    if (!characterName.trim()) {
      setError("캐릭터 이름을 입력해주세요.");
      return;
    }

    console.log("Search initiated with params:", { server: serverId, name: characterName });
    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const response = await axios.get("http://localhost:8080/api/df/search", {
        params: {
          server: serverId,
          name: characterName,
        },
      });

      console.log("API Response:", response);
      console.log("API Response Data:", response.data);

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

  const handleShowDetails = (character) => {
    const characterDataString = encodeURIComponent(JSON.stringify(character));
    router.push(`/dnf/${character.serverId}/${character.characterId}?details=${characterDataString}`); 
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pt-16" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold mb-10 text-center tracking-wider" style={{ color: 'var(--link-accent-color)' }}>
          RPGPT
        </h1>

        <SearchForm 
            onSubmit={handleSearch}
            serverOptions={serverOptions}
            selectedServer={serverId}
            onServerChange={(e) => setServerId(e.target.value)}
            characterPlaceholder="캐릭터, 모험단, 길드명 입력"
            characterName={characterName}
            onCharacterNameChange={(e) => setCharacterName(e.target.value)}
            isLoading={loading}
            buttonText="SEARCH"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-md text-center text-sm">
            {error}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="w-full max-w-5xl mt-10 mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center">
              검색 결과
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((character) => (
                <li key={`${character.serverId}-${character.characterId}`}>
                  <DnfCharacterCard 
                    character={character}
                    serverOptions={serverOptions}
                    onShowDetails={() => handleShowDetails(character)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 