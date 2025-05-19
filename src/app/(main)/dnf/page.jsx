"use client";

import { useState } from "react";
import axios from "axios";

export default function Page() {
  const [serverId, setServerId] = useState("all");
  const [characterName, setCharacterName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // 서버 옵션 (백엔드와 일치)
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
      setError("검색 중 오류가 발생했습니다: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 상세 정보 조회
  const handleShowDetails = async (serverId, characterId) => {
    setModalLoading(true);
    setModalError(null);
    setSelectedCharacter(null);

    try {
      const response = await axios.get("http://localhost:8080/api/df/character", {
        params: {
          server: serverId,
          characterId,
        },
      });

      if (response.data) {
        setSelectedCharacter(response.data);
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

  return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6">던전앤파이터 캐릭터 조회</h1>

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
              placeholder="캐릭터 이름 또는 모험단명"
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

        {/* 에러 메시지 */}
        {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
        )}

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">검색 결과</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((character) => (
                    <li
                        key={`${character.serverId}-${character.characterId}`}
                        className="border rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                        onClick={() => handleShowDetails(character.serverId, character.characterId)}
                    >
                        <div className="relative aspect-square max-h-64 overflow-hidden rounded-lg mb-4 bg-gray-50">
                            <img
                                src={character.imageUrl}
                                alt={character.characterName}
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-800 truncate">
                                {character.characterName}
                            </h3>
                            <div className="flex items-center text-gray-600">
                                <span className="w-20 font-medium">서버</span>
                                <span className="text-gray-800">{character.serverId}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <span className="w-20 font-medium">레벨</span>
                                <span className="text-gray-800">{character.level}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <span className="w-20 font-medium">직업</span>
                                <span className="text-gray-800">{character.jobName} ({character.jobGrowName})</span>
                            </div>
                        </div>
                    </li>
                ))}
              </ul>
            </div>
        )}

        {/* 상세 정보 모달 */}
        {selectedCharacter && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 navigation-overlay"
                onClick={closeModal}
            >
                <div 
                    className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    {modalLoading ? (
                        <div className="text-center">로딩 중...</div>
                    ) : modalError ? (
                        <div className="text-red-700">{modalError}</div>
                    ) : (
                        <>
                          <h2 className="text-2xl font-bold mb-4">{selectedCharacter.characterName}</h2>
                          <div className="relative aspect-square max-h-48 overflow-hidden rounded-md mb-4">
                            <img
                                src={selectedCharacter.imageUrl}
                                alt={selectedCharacter.characterName}
                                className="w-full h-full object-contain"
                            />
                          </div>
                          <p>
                            <strong>서버:</strong> {selectedCharacter.serverId}
                          </p>
                          <p>
                            <strong>레벨:</strong> {selectedCharacter.level}
                          </p>
                          <p>
                            <strong>직업:</strong> {selectedCharacter.jobName} ({selectedCharacter.jobGrowName})
                          </p>
                          <p>
                            <strong>명성:</strong> {selectedCharacter.fame}
                          </p>
                          <p>
                            <strong>모험단:</strong> {selectedCharacter.adventureName || "없음"}
                          </p>
                          <p>
                            <strong>길드:</strong> {selectedCharacter.guildName || "없음"}
                          </p>
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