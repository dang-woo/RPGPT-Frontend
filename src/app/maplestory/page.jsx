"use client";

import { useState } from "react";
import axios from "axios";

export default function Page() {
  const [characterName, setCharacterName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

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
      const response = await axios.get("http://localhost:8080/api/maple/search", {
        params: { name: characterName },
      });

      const results = response.data && response.data.ocid ? [response.data] : [];
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
  const handleShowDetails = async (ocid) => {
    setModalLoading(true);
    setModalError(null);
    setSelectedCharacter(null);

    try {
      const response = await axios.get("http://localhost:8080/api/maple/character", {
        params: { ocid },
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
        <h1 className="text-3xl font-bold mb-6">메이플스토리 캐릭터 조회</h1>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
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
                        key={character.ocid}
                        className="border rounded-md p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleShowDetails(character.ocid)}
                    >
                      <div className="relative aspect-square max-h-64 overflow-hidden rounded-md mb-4">
                        <img
                            src={character.characterImage}
                            alt={character.characterName}
                            className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-base">
                        <strong>이름:</strong> {character.characterName}
                      </p>
                      <p className="text-base">
                        <strong>월드:</strong> {character.worldName}
                      </p>
                      <p className="text-base">
                        <strong>레벨:</strong> {character.characterLevel}
                      </p>
                      <p className="text-base">
                        <strong>직업:</strong> {character.characterClass}
                      </p>
                    </li>
                ))}
              </ul>
            </div>
        )}

        {/* 상세 정보 모달 */}
        {selectedCharacter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 navigation-overlay">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                {modalLoading ? (
                    <div className="text-center">로딩 중...</div>
                ) : modalError ? (
                    <div className="text-red-700">{modalError}</div>
                ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-4">{selectedCharacter.character_name}</h2>
                      <div className="relative aspect-square max-h-48 overflow-hidden rounded-md mb-4">
                        <img
                            src={selectedCharacter.character_image}
                            alt={selectedCharacter.character_name}
                            className="w-full h-full object-contain"
                        />
                      </div>
                      <p>
                        <strong>월드:</strong> {selectedCharacter.world_name}
                      </p>
                      <p>
                        <strong>레벨:</strong> {selectedCharacter.character_level}
                      </p>
                      <p>
                        <strong>직업:</strong> {selectedCharacter.character_class} (레벨 {selectedCharacter.character_class_level})
                      </p>
                      <p>
                        <strong>성별:</strong> {selectedCharacter.character_gender}
                      </p>
                      <p>
                        <strong>경험치:</strong> {selectedCharacter.character_exp} ({selectedCharacter.character_exp_rate}%)
                      </p>
                      <p>
                        <strong>길드:</strong> {selectedCharacter.character_guild_name || "없음"}
                      </p>
                      <p>
                        <strong>캐릭터 생성일:</strong> {selectedCharacter.character_date_create}
                      </p>
                      <p>
                        <strong>계정 ID:</strong> {selectedCharacter.accountId || "없음"}
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