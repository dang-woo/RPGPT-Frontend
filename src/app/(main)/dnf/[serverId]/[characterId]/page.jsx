"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import useAuthStore from "@/lib/store/authStore";
import CharacterProfileCard from "@/components/dnf/CharacterProfileCard";
import EquipmentSection from "@/components/dnf/EquipmentSection";
import AvatarSection from "@/components/dnf/AvatarSection";
import CreatureSection from "@/components/dnf/CreatureSection";
import FlagSection from "@/components/dnf/FlagSection";
import TalismanSection from "@/components/dnf/TalismanSection";
import SkillSection from "@/components/dnf/SkillSection";
import BuffSkillSection from "@/components/dnf/BuffSkillSection";
import FloatingChatButton from "@/components/chat/FloatingChatButton";
import ChatInterface from "@/components/chat/ChatInterface";
import { BookmarkPlus, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

// 서버 ID를 한글 이름으로 매핑 (필요에 따라 추가/수정)
const serverNameMap = {
  all: "전체",
  adven: "모험단",
  cain: "카인",
  diregie: "디레지에",
  siroco: "시로코",
  prey: "프레이",
  casillas: "카시야스",
  hilder: "힐더",
  anton: "안톤",
  bakal: "바칼",
};

// 탭 정의
const TABS = [
  { id: "equipment", label: "장착 장비" },
  { id: "avatar", label: "아바타" },
  { id: "skill", label: "스킬 정보" },
  { id: "buffSkill", label: "버프 강화" },
  { id: "creature", label: "크리쳐" },
  { id: "talisman", label: "탈리스만" },
  { id: "flag", label: "휘장" },
];

export default function CharacterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { serverId, characterId } = params;
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuthStore();

  const [characterDetails, setCharacterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatModalRef = useRef(null);

  const [registrationStatus, setRegistrationStatus] = useState({
    loading: false,
    message: null,
    type: null,
  });

  useEffect(() => {
    let initialCharacterName = null;
    const initialDetailsQuery = searchParams.get('details');
    if (initialDetailsQuery) {
      try {
        const parsedDetails = JSON.parse(initialDetailsQuery);
        // 초기 로드 시 기본 정보만 임시로 설정 (이미지 깜빡임 방지 등)
        setCharacterDetails(prevDetails => ({
             ...prevDetails, 
             characterName: parsedDetails.characterName,
             level: parsedDetails.level, // 기존 레벨 정보 (API 호출 후 덮어쓰일 수 있음)
             jobGrowName: parsedDetails.jobGrowName,
             serverId: parsedDetails.serverId,
             characterId: parsedDetails.characterId,
             imageUrl: parsedDetails.imageUrl,
             adventureName: parsedDetails.adventureName, 
             guildName: parsedDetails.guildName,
             fame: parsedDetails.fame,
        }));
        initialCharacterName = parsedDetails.characterName; // /df/search에 사용할 캐릭터 이름
        console.log("[DEBUG] Initial Character Name for search:", initialCharacterName); // DEBUG
      } catch (e) {
        console.error("Error parsing initial character details from query params:", e);
      }
    }

    if (serverId && characterId) {
      const fetchAllCharacterData = async () => {
        if (!serverId || !characterId) {
          setError("서버 또는 캐릭터 ID가 유효하지 않습니다.");
          setLoading(false);
          return;
        }
        setLoading(true);
        setError(null);

        try {
          // 1. /df/character API 호출
          console.log(`[DEBUG] Calling /df/character?server=${serverId}&characterId=${characterId}`);
          const characterResponse = await apiClient.get(`/df/character?server=${serverId}&characterId=${characterId}`);
          console.log("[DEBUG] /df/character API Response (characterResponse):", characterResponse);

          if (!characterResponse.data) {
            setError("캐릭터 정보를 불러오지 못했습니다. (/df/character)");
            setLoading(false);
            return;
          }

          let finalCharacterData = { ...characterResponse.data };
          const characterNameFromDetails = characterResponse.data.characterName;

          // 2. /df/character 응답에서 얻은 characterName으로 /df/search API 호출
          if (characterNameFromDetails) {
            const searchUrl = `/df/search?server=${serverId}&name=${encodeURIComponent(characterNameFromDetails)}&limit=1`;
            console.log("[DEBUG] Calling /df/search with URL from character details:", searchUrl);
            try {
              const searchResponse = await apiClient.get(searchUrl);
              console.log("[DEBUG] /df/search API Response (searchResponse):", searchResponse);

              if (searchResponse && searchResponse.data && Array.isArray(searchResponse.data.rows) && searchResponse.data.rows.length > 0) {
                const searchResultCharacter = searchResponse.data.rows[0];
                console.log("[DEBUG] Extracted searchResultCharacter from /df/search:", searchResultCharacter);
                if (searchResultCharacter && typeof searchResultCharacter.level !== 'undefined') {
                  finalCharacterData.level = searchResultCharacter.level;
                  console.log("[DEBUG] Level updated from /df/search:", finalCharacterData.level);
                } else {
                  console.log("[DEBUG] Level not found or undefined in searchResultCharacter (from .rows).");
                }
              } else {
                console.log("[DEBUG] No results in .rows or malformed response from /df/search. searchResponse.data:", searchResponse?.data);
              }
            } catch (searchError) {
              // /df/search 호출 실패는 전체 로직을 중단시키지 않고, 레벨 정보만 누락될 수 있도록 처리
              console.error("[DEBUG] Error calling /df/search:", searchError);
              // 필요하다면 setError를 통해 사용자에게 알릴 수도 있지만, 일단은 콘솔 에러로만 남김
            }
          } else {
            console.warn("[DEBUG] Character name not available from /df/character response. Cannot call /df/search.");
          }

          
          setCharacterDetails(finalCharacterData);

        } catch (err) {
          console.error("캐릭터 상세 정보 조회 주 오류 (/df/character 또는 로직 에러):", err);
          let errorMessage = "캐릭터 정보를 불러오는 중 오류가 발생했습니다.";
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchAllCharacterData();
    }
  }, [serverId, characterId]); // searchParams 의존성 제거 (initialDetailsQuery는 참고용으로만 사용)

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

  const handleRegisterCharacter = async () => {
    if (!characterDetails || !user) {
      setRegistrationStatus({
        loading: false,
        message: "캐릭터 정보가 없거나 로그인되지 않았습니다.",
        type: "error",
      });
      return;
    }

    setRegistrationStatus({ loading: true, message: null, type: null });

    try {
      // characterDetails에서 필요한 정보를 가져옵니다.
      // /df/character 응답을 기준으로 payload를 구성해야 할 수 있습니다.
      // 예를 들어, API 응답이 characterDetails.characterInfo.adventureName 와 같은 구조라면 수정 필요
      const payload = {
        serverId: characterDetails.serverId, 
        characterId: characterDetails.characterId, // characterId도 보내야 할 수 있음 (백엔드 API 명세 확인)
        characterName: characterDetails.characterName,
        jobGrowName: characterDetails.jobGrowName,
        adventureName: characterDetails.adventureName,
        // fame: characterDetails.fame // 필요시 추가
      };
      
      // adventureName이 없을 경우의 처리 (API 응답 구조에 따라 다를 수 있음)
      if (!payload.adventureName && characterDetails.characterInfo && characterDetails.characterInfo.adventureName) {
        payload.adventureName = characterDetails.characterInfo.adventureName;
      }


      if (!payload.adventureName) {
        setRegistrationStatus({
          loading: false,
          message: "캐릭터의 모험단 정보를 가져올 수 없습니다. 등록을 진행할 수 없습니다.",
          type: "error",
        });
        return;
      }
      
      // 백엔드의 /characters 엔드포인트가 정확히 어떤 payload를 기대하는지 확인 필요
      const response = await apiClient.post("/characters", payload);


      if (response.data && response.data.success) {
        setRegistrationStatus({
          loading: false,
          message: response.data.message || "캐릭터가 마이페이지에 성공적으로 등록되었습니다.",
          type: "success",
        });
      } else {
        setRegistrationStatus({
          loading: false,
          message: response.data?.message || "캐릭터 등록에 실패했습니다.",
          type: "error",
        });
      }
    } catch (err) {
      setRegistrationStatus({
        loading: false,
        message: err.response?.data?.message || "캐릭터 등록 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  const renderContent = () => {
    if (loading && !characterDetails?.characterName) { // characterName이라도 있어야 초기 로딩 화면 스킵 가능
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)] text-neutral-500 dark:text-neutral-300">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          캐릭터 정보 로딩 중...
        </div>
      );
    }

    if (error && !characterDetails?.characterName) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)] p-4 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 font-semibold rounded-md transition-colors text-white bg-sky-600 hover:bg-sky-700"
          >
            뒤로 가기
          </button>
        </div>
      );
    }

    if (!characterDetails?.characterName) { // characterName 기준으로 최종 fallback 처리
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)] p-4 text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mb-4" />
          <p className="text-xl mb-4 text-neutral-700 dark:text-neutral-300">캐릭터 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 font-semibold rounded-md transition-colors text-white bg-sky-600 hover:bg-sky-700"
          >
            뒤로 가기
          </button>
        </div>
      );
    }

    const {
      equipment,
      setItemInfo, // 이 prop은 characterDetails에 없을 것 같음. 확인 필요.
      avatar,
      creature,
      flag,
      talismans,
      skill,
      // characterName, level, jobGrowName 등은 characterDetails에서 직접 사용
    } = characterDetails; // API 응답 구조에 따라 달라질 수 있음
    
    const currentServerName = serverNameMap[characterDetails.serverId] || characterDetails.serverId;
    const characterPrimaryImageUrl = characterDetails.imageUrl || `https://img-api.neople.co.kr/df/servers/${characterDetails.serverId}/characters/${characterDetails.characterId}?zoom=3`;
    const fallbackImageUrl = "https://via.placeholder.com/300x400.png?text=Image+Not+Found";

    const userRegisteredAdventureName = user?.adventureName;

    return (
      <>
        <div className="relative">
          <CharacterProfileCard
            characterDetails={characterDetails}
            currentServerName={currentServerName}
            characterPrimaryImageUrl={characterPrimaryImageUrl}
            fallbackImageUrl={fallbackImageUrl}
          />
          {!authLoading && user && (
            (() => {
              const viewingCharacterAdventureName = characterDetails?.adventureName;

              if (userRegisteredAdventureName && 
                  viewingCharacterAdventureName && 
                  userRegisteredAdventureName !== viewingCharacterAdventureName) {
                return null;
              }

              return (
                <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                  <button
                    onClick={handleRegisterCharacter}
                    disabled={registrationStatus.loading || registrationStatus.type === 'success'}
                    className={`mypage-button flex items-center px-4 py-2 text-sm font-semibold rounded-md shadow transition-colors text-white 
                              ${registrationStatus.loading ? 'bg-gray-400 cursor-not-allowed' : 
                               registrationStatus.type === 'success' ? 'bg-green-500 cursor-not-allowed' : 
                               registrationStatus.type === 'error' ? 'bg-red-500 cursor-not-allowed' : ''}`}
                  >
                    {registrationStatus.loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : registrationStatus.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <BookmarkPlus className="w-4 h-4 mr-2" />
                    )}
                    {registrationStatus.loading ? "등록 중..." : registrationStatus.type === 'success' ? "등록 완료" : "마이페이지에 등록"}
                  </button>
                  {registrationStatus.message && (
                    <div className={`p-2 rounded-md text-xs text-white 
                                   ${registrationStatus.type === 'success' ? 'bg-green-500' : 
                                     registrationStatus.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {registrationStatus.message}
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>

        <div className="mt-6 mb-4 border-b border-neutral-300 dark:border-neutral-700">
          <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={(
                  'whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-150 ' +
                  (activeTab === tab.id
                    ? 'border-[var(--main-button-bg)] text-[var(--main-button-bg)]'
                    : 'border-transparent text-[var(--nav-button-text)] hover:text-[var(--nav-button-hover-text)] hover:border-[var(--nav-button-hover-text)]')
                )}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {loading && (!equipment && !avatar && !skill) && 
          <div className="py-8 text-center text-neutral-500 dark:text-neutral-300">
            <Loader2 className="w-8 h-8 animate-spin inline-block mr-2" /> 상세 정보 로딩 중...
          </div>
        } 
        
        <div className="mt-4">
          {activeTab === 'equipment' && equipment && <EquipmentSection equipment={equipment} setItemInfo={setItemInfo} serverId={characterDetails.serverId} characterId={characterDetails.characterId} />}
          {activeTab === 'avatar' && avatar && <AvatarSection avatar={avatar} />}
          {activeTab === 'skill' && skill?.style && <SkillSection skillStyle={skill.style} />}
          {activeTab === 'buffSkill' && skill?.buff && <BuffSkillSection buffSkillInfo={skill.buff} fullEquipmentList={equipment} />}
          {activeTab === 'creature' && creature && <CreatureSection creature={creature} />}
          {activeTab === 'talisman' && talismans && <TalismanSection talismans={talismans} />}
          {activeTab === 'flag' && flag && <FlagSection flag={flag} />}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <button
            onClick={() => router.back()}
            className="mypage-button mb-6 px-4 py-2 text-sm font-semibold rounded-md shadow transition-colors"
        >
            &larr; 이전 페이지로 돌아가기
        </button>
        {renderContent()} 
      </div>
      {characterDetails && !loading && <FloatingChatButton onClick={toggleChat} />}
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
              initialContextText={characterDetails?.characterName ? `현재 보고 있는 캐릭터 '${characterDetails.characterName}'에 대해 질문해보세요.` : ""}
              isModalMode={true}
              currentCharacterDetails={characterDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
} 