"use client"; // 클라이언트 컴포넌트로 전환

import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import Link from 'next/link'; // Link 임포트 추가 -> 모달 사용으로 주석 처리 또는 삭제
import { useRouter } from 'next/navigation'; // useRouter 임포트
// import DnfCharacterCard from '@/components/dnf/DnfCharacterCard'; // 기존 카드 주석 처리
import DnfCharacterCard from '@/components/dnf/DnfCharacterCard'; // DnfCharacterCard 임포트
import useAuthStore from '@/lib/store/authStore'; // useAuthStore 임포트
import apiClient from '@/lib/apiClient'; // apiClient 임포트
import { Users, Search, ServerCrash, PlusCircle, Loader2, Trash2, ShieldAlert, Settings, CheckSquare, Square } from 'lucide-react'; // Users 아이콘 import 추가, Loader2 아이콘 추가, Trash2 아이콘 추가, ShieldAlert 아이콘 추가, Settings 아이콘 추가, CheckSquare, Square 아이콘 추가
import RegisterCharacterModal from '@/components/mypage/RegisterCharacterModal'; // 모달 컴포넌트 임포트
import FloatingChatButton from '@/components/chat/FloatingChatButton'; // 추가
import ChatInterface from '@/components/chat/ChatInterface'; // 추가
// import axios from 'axios'; // 현재 사용하지 않으므로 주석 처리 또는 삭제

// 서버 옵션 (DnfCharacterCard에서 필요)
const serverOptionsForMypage = [
  { id: "all", name: "전체" },
  { id: "cain", name: "카인" },
  { id: "diregie", name: "디레지에" },
  { id: "siroco", name: "시로코" },
  { id: "prey", name: "프레이" },
  { id: "casillas", name: "카시야스" },
  { id: "hilder", name: "힐더" },
  { id: "anton", name: "안톤" },
  { id: "bakal", name: "바칼" },
  // { id: "adven", name: "모험단" }, // DnfCharacterCard는 모험단 직접 표시 안함
];

// 컴포넌트 이름을 MyPage로 변경 (기존 파일명과 일치)
export default function MyPage() { 
  const { user, isLoading: authLoading } = useAuthStore(); // 사용자 정보 가져오기
  const router = useRouter(); // useRouter 인스턴스 생성
  const [characters, setCharacters] = useState([]); // 등록된 캐릭터 목록 (초기엔 빈 배열)
  const [loading, setLoading] = useState(true); // 페이지 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 상태는 유지

  // 대표 모험단 이름 상태
  const [adventureDisplayName, setAdventureDisplayName] = useState("정보 없음");
  const [selectedCharacters, setSelectedCharacters] = useState(new Set()); // 선택된 캐릭터 ID Set
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 작업 로딩 상태
  const [isManagementModeActive, setIsManagementModeActive] = useState(false); // 관리 모드 상태
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // 캐릭터 등록 모달 상태 추가
  const [isChatOpen, setIsChatOpen] = useState(false); // 채팅 모달 상태 추가
  const chatModalRef = useRef(null); // 채팅 모달 ref 추가

  // 캐릭터 목록 새로고침 함수 (모달에서 등록 성공 시 호출)
  const refreshCharacters = async () => {
    setLoading(true);
    setError(null);
    setAdventureDisplayName("정보 없음");
    try {
      const baseCharactersResponse = await apiClient.get('/characters/adventure');
      
      if (baseCharactersResponse.data && Array.isArray(baseCharactersResponse.data)) {
        const charactersWithoutExtraInfo = baseCharactersResponse.data;
        
        if (charactersWithoutExtraInfo.length === 0) {
          setCharacters([]);
          setAdventureDisplayName("등록된 모험단 없음");
          setLoading(false);
          return;
        }

        // DnfCharacterCard는 level, jobGrowName, imageUrl 등을 character 객체 내에서 직접 사용하므로
        // 해당 정보들을 API 호출을 통해 미리 채워줘야 합니다.
        const charactersWithDetailsPromises = charactersWithoutExtraInfo.map(async (char) => {
          try {
            // 1. /df/search (이미지, 레벨, 직업명)
            const searchResponse = await apiClient.get('/df/search', {
              params: { server: char.serverId, name: char.characterName, limit: 1 }
            });
            if (searchResponse.data && searchResponse.data.rows && searchResponse.data.rows.length > 0) {
              const searchedChar = searchResponse.data.rows[0];
              return { 
                ...char, // 기존 백엔드 DB 정보 (characterId, serverId, characterName, adventureName)
                imageUrl: searchedChar.imageUrl,
                level: searchedChar.level,
                jobGrowName: searchedChar.jobGrowName,
              };
            }
            // 2. /df/search 실패 시 /df/character (레벨, 직업명) + 기본 이미지 없음 처리
            try {
              const detailResponse = await apiClient.get('/df/character', { params: { server: char.serverId, characterId: char.characterId }});
              return { 
                ...char, 
                imageUrl: null, // DnfCharacterCard가 fallback 처리
                level: detailResponse.data?.level,
                jobGrowName: detailResponse.data?.jobGrowName 
              };
            } catch (detailError) {
              console.error(`캐릭터 상세 정보(fallback) 검색 오류 (${char.characterName}):`, detailError);
              return { ...char, imageUrl: null, level: null, jobGrowName: null };
            }
          } catch (searchError) {
            console.error(`캐릭터 이미지/기본정보 검색 오류 (${char.characterName}):`, searchError);
            // /df/search 최초 실패 시에도 /df/character 로 폴백
            try {
              const detailResponse = await apiClient.get('/df/character', { params: { server: char.serverId, characterId: char.characterId }});
              return { 
                ...char, 
                imageUrl: null, 
                level: detailResponse.data?.level, 
                jobGrowName: detailResponse.data?.jobGrowName 
              };
            } catch (detailError) {
              console.error(`캐릭터 상세 정보(primary fallback) 검색 오류 (${char.characterName}):`, detailError);
              return { ...char, imageUrl: null, level: null, jobGrowName: null };
            }
          }
        });

        const detailedCharacters = await Promise.all(charactersWithDetailsPromises);
        setCharacters(detailedCharacters);

        if (detailedCharacters.length > 0 && detailedCharacters[0].adventureName) {
          setAdventureDisplayName(detailedCharacters[0].adventureName);
        } else if (detailedCharacters.length > 0) {
          setAdventureDisplayName("모험단 이름 정보 없음");
        } else {
          setAdventureDisplayName("등록된 모험단 없음"); 
        }

      } else if (baseCharactersResponse.data && baseCharactersResponse.data.success === true && baseCharactersResponse.data.message === "등록된 캐릭터가 없습니다.") {
        setCharacters([]);
        setAdventureDisplayName("등록된 모험단 없음");
      } else if (baseCharactersResponse.data && baseCharactersResponse.data.success === false) {
        setError(baseCharactersResponse.data.message || "등록된 캐릭터 정보를 가져오는 데 실패했습니다.");
        setCharacters([]);
        setAdventureDisplayName("정보 조회 실패");
      }
      else {
        setCharacters([]); 
        setAdventureDisplayName("정보 없음");
      }
    } catch (err) {
      console.error("사용자 캐릭터 조회 오류:", err);
      let errorMessage = "캐릭터 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setCharacters([]);
      setAdventureDisplayName("정보 조회 오류");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }
    // 초기 로드 시 refreshCharacters 호출
    refreshCharacters(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]); // router 제거, refreshCharacters를 의존성 배열에서 제거 (내부화 또는 useCallback 필요)

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatModalRef.current && !chatModalRef.current.contains(event.target)) {
        const fabButton = event.target.closest('button');
        if (fabButton && fabButton.classList.contains('fixed')) {
            return;
        }
        setIsChatOpen(false);
      }
    }
    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleToggleSelectCharacter = (characterId) => {
    setSelectedCharacters(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(characterId)) {
        newSelected.delete(characterId);
      } else {
        newSelected.add(characterId);
      }
      return newSelected;
    });
  };

  const handleDeleteCharacter = async (characterId) => {
    if (!window.confirm("정말로 이 캐릭터를 삭제하시겠습니까?")) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/characters?characterId=${characterId}`);
      // refreshCharacters(); // 삭제 후 목록 다시 불러오기
      // 또는 로컬에서 직접 제거하여 즉각적인 UI 업데이트 (더 나은 사용자 경험)
      const updatedCharacters = characters.filter(char => char.characterId !== characterId);
      setCharacters(updatedCharacters);
      setSelectedCharacters(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(characterId);
        return newSelected;
      });
      if (updatedCharacters.length === 0) {
        setAdventureDisplayName("등록된 모험단 없음");
      }
    } catch (err) {
      console.error("캐릭터 삭제 오류:", err);
      setError(err.response?.data?.message || "캐릭터 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelectedCharacters = async () => {
    if (selectedCharacters.size === 0) {
      alert("삭제할 캐릭터를 선택해주세요.");
      return;
    }
    if (!window.confirm(`선택된 ${selectedCharacters.size}개의 캐릭터를 삭제하시겠습니까?`)) return;
    setIsDeleting(true);
    try {
      await Promise.all(Array.from(selectedCharacters).map(charId => apiClient.delete(`/characters?characterId=${charId}`)));
      // refreshCharacters(); // 삭제 후 목록 다시 불러오기
      const updatedCharacters = characters.filter(char => !selectedCharacters.has(char.characterId));
      setCharacters(updatedCharacters);
      setSelectedCharacters(new Set());
      if (updatedCharacters.length === 0) {
        setAdventureDisplayName("등록된 모험단 없음");
      }
    } catch (err) {
      console.error("선택 캐릭터 삭제 오류:", err);
      setError(err.response?.data?.message || "선택한 캐릭터 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllCharacters = async () => {
    if (characters.length === 0) return;
    if (!window.confirm("등록된 모든 캐릭터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    setIsDeleting(true);
    try {
      // 모든 캐릭터 ID를 가져와서 삭제 요청
      await Promise.all(characters.map(char => apiClient.delete(`/characters?characterId=${char.characterId}`)));
      // refreshCharacters(); // 삭제 후 목록 다시 불러오기
      setCharacters([]);
      setSelectedCharacters(new Set());
      setAdventureDisplayName("등록된 모험단 없음");
    } catch (err) {
      console.error("전체 캐릭터 삭제 오류:", err);
      setError(err.response?.data?.message || "모든 캐릭터 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDetailsOnMypage = (serverId, characterId) => {
    // DnfCharacterCard의 onClick이 관리 모드일 때도 동작하지 않도록 제어하기 위함.
    // 그러나 DnfCharacterCard 자체의 onClick을 막는 것보다, li 레벨에서 이벤트를 조건부로 처리하는게 나을 수 있음.
    // 현재 DnfCharacterCard는 onShowDetails prop을 받아 내부에서 onClick을 처리하므로, 
    // 관리 모드일 때 onShowDetails를 undefined로 넘겨주면 클릭이 방지됨.
    router.push(`/dnf/${serverId}/${characterId}`);
  };

  // Determine characters to display based on adventureDisplayName
  const isAdventureNameValidForFiltering = 
    adventureDisplayName &&
    adventureDisplayName !== "정보 없음" &&
    adventureDisplayName !== "등록된 모험단 없음" &&
    adventureDisplayName !== "모험단 이름 정보 없음" &&
    adventureDisplayName !== "정보 조회 실패" &&
    adventureDisplayName !== "정보 조회 오류";

  const displayedCharacters = isAdventureNameValidForFiltering && characters.length > 0
    ? characters.filter(char => char.adventureName === adventureDisplayName)
    : characters;

  // 인증 정보 로딩 중일 때
  if (authLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[calc(100vh-var(--header-height,10rem))]">
        <Loader2 className="w-12 h-12 animate-spin text-sky-500 mr-3" />
        사용자 정보를 확인 중입니다...
      </div>
    );
  }

  // 로그인되지 않았을 때 (authLoading 완료 후)
  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[calc(100vh-var(--header-height,10rem))]">
        <p className="text-gray-400 dark:text-gray-500 mb-4">마이페이지를 이용하려면 로그인이 필요합니다.</p>
        <Link href="/login">
          <button className="mypage-button px-6 py-2">로그인 하러 가기</button>
        </Link>
      </div>
    );
  }
  
  // 페이지 데이터 로딩 중 (사용자 정보 로딩 완료 후)
  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 min-h-[calc(100vh-var(--header-height,10rem))]">
        <Loader2 className="w-12 h-12 animate-spin text-sky-500 mr-3" />
        등록된 캐릭터 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-grow mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mypage-title mb-4 sm:mb-0">
            {user?.nickname || '사용자'}님이 등록한 모험단: <span className="text-[var(--main-button-bg)]">{adventureDisplayName}</span>
          </h1>
          <div className="flex items-center space-x-3 self-start sm:self-center mt-2 sm:mt-0">
            <button 
              onClick={() => setIsManagementModeActive(!isManagementModeActive)}
              className={`mypage-button p-2 mypage-settings-button ${isManagementModeActive ? 'management-active text-white' : ''}`}
              title={isManagementModeActive ? "관리 모드 비활성화" : "관리 모드 활성화"}
            >
              <Settings size={20} className="settings-icon" />
            </button>
            {/* <Link href="/mypage/register-character"> */}
              <button 
                onClick={() => setIsRegisterModalOpen(true)} // 모달 열기
                className="mypage-button whitespace-nowrap px-4 py-2 flex items-center"
              >
                <PlusCircle size={18} className="mr-2" /> 새 캐릭터 등록하기
              </button>
            {/* </Link> */}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg text-center text-sm flex flex-col items-center">
            <ServerCrash className="w-10 h-10 mb-2" />
            <p className="font-semibold">오류 발생</p>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-md">닫기</button>
          </div>
        )}

        {/* 삭제 버튼 영역: 항상 렌더링하여 공간을 차지하도록 하고, 버튼의 visibility를 제어 */} 
        <div className={`mb-6 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-3 ${characters.length > 0 ? 'h-auto' : 'h-0 overflow-hidden'}`}> 
          {/* 위 h-auto/h-0은 캐릭터 없을때 아예 공간차지 안하게. 항상 공간차지하려면 min-height 같은것 사용 */} 
          <button 
            onClick={handleDeleteSelectedCharacters}
            disabled={selectedCharacters.size === 0 || isDeleting}
            className={`mypage-button-danger whitespace-nowrap px-4 py-2 flex items-center text-sm 
                       ${selectedCharacters.size === 0 || isDeleting ? 'opacity-50 cursor-not-allowed' : ''} 
                       ${isManagementModeActive && characters.length > 0 ? 'visible opacity-100' : 'invisible opacity-0'}`}
            style={{transition: 'visibility 0s, opacity 0.2s linear'}} // 부드러운 전환 효과
          >
            <Trash2 size={16} className="mr-2" /> 선택 삭제 ({selectedCharacters.size}개)
          </button>
          <button 
            onClick={handleDeleteAllCharacters}
            disabled={isDeleting}
            className={`mypage-button-danger whitespace-nowrap px-4 py-2 flex items-center text-sm 
                       ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''} 
                       ${isManagementModeActive && characters.length > 0 ? 'visible opacity-100' : 'invisible opacity-0'}`}
            style={{transition: 'visibility 0s, opacity 0.2s linear'}} // 부드러운 전환 효과
          >
            <ShieldAlert size={16} className="mr-2" /> 전체 삭제
          </button>
        </div>

        {/* State 1: No characters registered for the user at all. */} 
        {!loading && !error && characters.length === 0 && (
            <div className="flex-grow flex flex-col justify-center items-center text-center py-12 md:py-16 rounded-xl shadow-sm border mypage-empty-state">
                <Users className="mx-auto h-16 w-16 mb-4 mypage-empty-state-icon" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg font-semibold mypage-empty-state-title">
                    등록된 캐릭터가 없습니다.
                </h3>
                <p className="mt-1.5 text-sm mypage-empty-state-text">
                    새로운 캐릭터를 등록하여 관리해보세요.
                </p>
                <div className="mt-6">
                    <button 
                      onClick={() => setIsRegisterModalOpen(true)} // 모달 열기
                      className="mypage-button flex items-center"
                    >
                      <PlusCircle size={18} className="mr-2" /> 캐릭터 등록하러 가기
                    </button>
                </div>
            </div>
        )}

        {/* State 2: Characters are registered, adventureDisplayName is set, but no characters match this adventure. */} 
        {!loading && !error && characters.length > 0 && isAdventureNameValidForFiltering && displayedCharacters.length === 0 && (
            <div className="flex-grow flex flex-col justify-center items-center text-center py-12 md:py-16 rounded-xl shadow-sm border mypage-empty-state">
                <Search className="mx-auto h-16 w-16 mb-4 mypage-empty-state-icon" strokeWidth={1.5} />
                <h3 className="mt-3 text-lg font-semibold mypage-empty-state-title">
                    '{adventureDisplayName}' 모험단에 등록된 캐릭터가 없습니다.
                </h3>
                <p className="mt-1.5 text-sm mypage-empty-state-text">
                    이 모험단에 캐릭터를 추가하시겠습니까?
                </p>
                <div className="mt-6">
                    <button 
                      onClick={() => setIsRegisterModalOpen(true)} // 모달 열기 (adventureDisplayName 컨텍스트 전달)
                      className="mypage-button flex items-center"
                    >
                      <PlusCircle size={18} className="mr-2" /> 이 모험단에 캐릭터 등록하기
                    </button>
                </div>
            </div>
        )}

        {/* State 3: Characters are available to be displayed (either all, or filtered). */} 
        {!loading && !error && displayedCharacters.length > 0 && (
          <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mypage-title mb-6">
              총 {displayedCharacters.length}개의 캐릭터가 등록되어 있습니다. {isManagementModeActive && "(관리 모드)"}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {displayedCharacters.map((character) => (
                <li key={`${character.serverId}-${character.characterId}`} className="relative group flex flex-col">
                  {/* 관리 모드 UI (체크박스, 삭제 버튼) */}
                  {isManagementModeActive && (
                    <div className="absolute top-1 right-1 z-20 flex items-center space-x-1 p-1 bg-black/60 rounded-md">
                      <button
                        onClick={() => handleToggleSelectCharacter(character.characterId)}
                        className="p-1.5 text-white hover:text-sky-400 transition-colors"
                        title={selectedCharacters.has(character.characterId) ? "선택 해제" : "캐릭터 선택"}
                      >
                        {selectedCharacters.has(character.characterId) ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDeleteCharacter(character.characterId)} 
                        className="p-1.5 text-white hover:text-red-500 transition-colors"
                        title="캐릭터 삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                  
                  {/* DnfCharacterCard - 관리 모드일 때는 onShowDetails를 undefined로 전달하여 클릭 방지 */}
                  <DnfCharacterCard 
                    character={character} 
                    serverOptions={serverOptionsForMypage} 
                    // 관리 모드에서는 DnfCharacterCard의 자체 클릭(상세보기 이동)을 막음
                    onShowDetails={!isManagementModeActive ? () => handleShowDetailsOnMypage(character.serverId, character.characterId) : undefined}
                    // onRegister는 마이페이지에서는 사용 안 함
                  />

                  {/* 호버 시 "캐릭터 상세보기" 버튼 (관리 모드가 아닐 때만) */}
                  {!isManagementModeActive && (
                    <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button
                        onClick={() => handleShowDetailsOnMypage(character.serverId, character.characterId)}
                        className="w-full mypage-button text-sm py-2 cursor-pointer shadow-md"
                      >
                        캐릭터 상세보기
                      </button>
                    </div>
                  )}
                   {/* 관리 모드 활성화 시에도 하단 버튼 공간 확보 (DnfCharacterCard의 onRegister 버튼이 없을 경우) */}
                  {/* {isManagementModeActive && !character.onRegister && (
                     <div className="h-[46px]"></div>
                  )} */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      {isRegisterModalOpen && (
        <RegisterCharacterModal 
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={() => {
            setIsRegisterModalOpen(false);
            refreshCharacters(); // 캐릭터 등록 성공 시 목록 새로고침
          }}
          currentAdventureName={isAdventureNameValidForFiltering ? adventureDisplayName : (characters.length > 0 ? adventureDisplayName : null)} // 모달에 현재 모험단 컨텍스트 전달 수정
        />
      )}
      {/* 채팅 인터페이스 추가 */}
      {user && !authLoading && <FloatingChatButton onClick={toggleChat} />}
      {isChatOpen && (
        <div 
          ref={chatModalRef}
          className="fixed chat-modal-main-container rounded-lg shadow-xl overflow-hidden flex flex-col z-40 \
                     bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[calc(100vh-10rem)] \
                     md:inset-auto md:right-8 md:bottom-24 md:translate-x-0 md:translate-y-0 md:w-full md:max-w-md md:h-[80vh] md:max-h-[700px]"
        >
          <div className="p-4 border-b dark:border-neutral-700 flex justify-between items-center chat-modal-header">
            <h2 className="text-lg font-semibold">AI 채팅</h2>
            <button onClick={toggleChat} className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 chat-modal-close-button">&times;</button>
          </div>
          <div className="flex-grow overflow-y-auto">
            <ChatInterface 
              initialContextText={adventureDisplayName !== "정보 없음" && adventureDisplayName !== "등록된 모험단 없음" ? `현재 마이페이지의 '${adventureDisplayName}' 모험단 정보를 보고 계십니다. 관련해서 질문해주세요.` : "마이페이지에 오신 것을 환영합니다. 무엇을 도와드릴까요?"}
              isModalMode={true}
              // myPageCharacters={characters} // 마이페이지 컨텍스트 전달 (필요시)
            />
          </div>
        </div>
      )}
    </div>
  );
} 