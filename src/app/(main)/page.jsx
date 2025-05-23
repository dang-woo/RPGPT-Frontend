"use client";

import { useState, useEffect } from "react";
// import axios from "axios"; // apiClient 사용으로 주석 처리
import apiClient from "@/lib/apiClient"; // apiClient 임포트
import { useRouter } from "next/navigation";
import DnfCharacterCard from "@/components/dnf/DnfCharacterCard";
import SearchForm from "@/components/search/SearchForm";
import { XCircle, History } from "lucide-react";

const MAX_RECENT_SEARCHES = 5;
const LOCAL_STORAGE_KEY = "rpgpt_recent_searches";

export default function MainPage() {
  const [serverId, setServerId] = useState("all");
  const [characterName, setCharacterName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearchHistoryVisible, setIsSearchHistoryVisible] = useState(false);

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

  useEffect(() => {
    const storedSearches = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const saveRecentSearches = (searches) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(searches));
  };

  const addSearchToHistory = () => {
    const newSearchItem = { serverId: serverId, serverName: serverOptions.find(s => s.id === serverId)?.name || serverId, characterName: characterName, timestamp: new Date().getTime() };

    let updatedSearches = recentSearches.filter(
      item => !(item.serverId === newSearchItem.serverId && item.characterName.toLowerCase() === newSearchItem.characterName.toLowerCase())
    );
    updatedSearches = [newSearchItem, ...updatedSearches].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const removeSearchFromHistory = (indexToRemove) => {
    const updatedSearches = recentSearches.filter((_, index) => index !== indexToRemove);
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const handleRecentSearchClick = (searchItem) => {
    setServerId(searchItem.serverId);
    setCharacterName(searchItem.characterName);
    handleSearch(null, searchItem.serverId, searchItem.characterName);
  };

  const handleSearch = async (e, searchServerId = serverId, searchCharacterName = characterName) => {
    if (e) e.preventDefault();
    
    if (!searchCharacterName.trim()) {
      setError("캐릭터 이름을 입력해주세요.");
      return;
    }
    setIsSearchHistoryVisible(false);
    setLoading(true);
    setError(null);

    try {
      console.log("apiClient baseURL:", apiClient.defaults.baseURL); // apiClient의 baseURL 확인 코드 추가
      // const response = await axios.get("http://localhost:8080/api/df/search", { // 기존 코드 주석 처리
      const response = await apiClient.get("/df/search", { // apiClient 사용 및 상대 경로로 변경
        params: {
          server: searchServerId,
          name: searchCharacterName,
        },
      });
      
      const rows = response.data.rows || [];
      if (rows.length === 0) {
        setError("일치하는 캐릭터가 없습니다.");
        setSearchResults([]);
      } else {
        setSearchResults(rows);
        addSearchToHistory();
      }
    } catch (err) {
      setError("검색 중 오류가 발생했습니다: " + (err.response?.data?.error || err.message));
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (character) => {
    const characterDataString = encodeURIComponent(JSON.stringify(character));
    router.push(`/dnf/${character.serverId}/${character.characterId}?details=${characterDataString}`); 
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pt-16">
      <div className="w-full max-w-2xl mt-8">
        <h1 className="text-5xl font-bold mb-10 text-center tracking-wider text-[var(--link-accent-color)]">
          RPGPT
        </h1>

        <div 
          className="relative" 
          onMouseEnter={() => recentSearches.length > 0 && setIsSearchHistoryVisible(true)}
          onMouseLeave={() => setIsSearchHistoryVisible(false)}
        >
          <SearchForm 
            onSubmit={(e) => handleSearch(e)}
            serverOptions={serverOptions}
            selectedServer={serverId}
            onServerChange={(e) => setServerId(e.target.value)}
            characterPlaceholder="캐릭터, 모험단, 길드명 입력"
            characterName={characterName}
            onCharacterNameChange={(e) => setCharacterName(e.target.value)}
            isLoading={loading}
            buttonText="SEARCH"
          />

          {recentSearches.length > 0 && isSearchHistoryVisible && (
            <div 
              className="absolute top-full left-0 right-0 z-50 w-full border shadow-lg rounded-b-md overflow-hidden"
              style={{ backgroundColor: 'var(--search-bg)', borderColor: 'var(--search-border)' }}
              onMouseEnter={() => setIsSearchHistoryVisible(true)}
              onMouseLeave={() => setIsSearchHistoryVisible(false)}
            >
              <ul className="py-2 space-y-0.5">
                {recentSearches.map((item, index) => (
                  <li 
                    key={item.timestamp} 
                    className="flex items-center justify-between px-3 py-2 hover:bg-[var(--sidebar-hover)] transition-colors cursor-pointer"
                    onClick={() => handleRecentSearchClick(item)}
                    title={`"${item.characterName}" (${item.serverName}) 검색`}
                  >
                    <div className="flex items-center flex-grow min-w-0">
                      <History size={16} className="mr-2.5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-200 truncate">
                        <span className="font-medium">{item.characterName}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1.5">({item.serverName})</span>
                      </span>
                    </div>
                    <button 
                      onClick={(e) => { 
                          e.stopPropagation(); 
                          removeSearchFromHistory(index); 
                      }}
                      className="ml-2 p-1 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                      title="검색 기록 삭제"
                    >
                      <XCircle size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && !loading && (
          <div className="w-full mt-6 mb-4 p-3 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 rounded-md text-center text-sm">
            {error}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="w-full mt-10">
            <h2 className="text-3xl font-semibold mb-8 text-center">
              검색 결과
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
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

        {loading && (
          <div className="w-full mt-10 text-center text-neutral-500 dark:text-neutral-400">검색 중입니다...</div>
        )}

        {!loading && searchResults.length === 0 && !error && characterName && (
          <div className="w-full mt-10 text-center text-neutral-500 dark:text-neutral-400">
           
          </div>
        )}
      </div>
    </div>
  );
} 