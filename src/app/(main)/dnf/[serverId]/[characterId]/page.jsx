"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import apiClient from "@/lib/apiClient";
import useAuthStore from "@/lib/store/authStore";
import CharacterProfileCard from "@/components/dnf/CharacterProfileCard";
import EquipmentSection from "@/components/dnf/EquipmentSection";
import SetItemEffectSection from "@/components/dnf/SetItemEffectSection";
import AvatarSection from "@/components/dnf/AvatarSection";
import CreatureSection from "@/components/dnf/CreatureSection";
import FlagSection from "@/components/dnf/FlagSection";
import TalismanSection from "@/components/dnf/TalismanSection";
import SkillSection from "@/components/dnf/SkillSection";
import BuffSkillSection from "@/components/dnf/BuffSkillSection";
import FloatingChatButton from "@/components/chat/FloatingChatButton";
import ChatInterface from "@/components/chat/ChatInterface";
import { BookmarkPlus, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

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
        // initialCharacterName = parsedDetails.characterName; // 더 이상 초기 이름에 의존하지 않음
        // 초기 상태 설정은 유지하되, API 호출 후 덮어쓰여질 것임
        setCharacterDetails(prevDetails => ({
             ...prevDetails, 
             characterName: parsedDetails.characterName,
             level: parsedDetails.level,
             jobGrowName: parsedDetails.jobGrowName,
             serverId: parsedDetails.serverId,
             characterId: parsedDetails.characterId,
             imageUrl: parsedDetails.imageUrl,
             // adventureName 등 다른 주요 기본 정보도 여기서 초기 설정 가능
             adventureName: parsedDetails.adventureName, 
             guildName: parsedDetails.guildName,
             fame: parsedDetails.fame,
        }));
      } catch (e) {
        console.error("Error parsing initial character details from query params:", e);
      }
    }

    if (serverId && characterId) {
      const fetchAllCharacterData = async () => {
        setLoading(true);
        setError(null);
        try {
          // 1. /api/df/character API 호출하여 기본 정보 및 characterName 가져오기
          const detailResponse = await apiClient.get('/df/character', {
            params: { server: serverId, characterId: characterId }
          });

          let finalDetails = detailResponse.data;
          const characterNameFromDetail = finalDetails?.characterName;

          if (characterNameFromDetail) {
            // 2. 얻어온 characterName으로 /api/df/search API 호출
            try {
              const searchResponse = await apiClient.get('/df/search', {
                params: { server: serverId, name: characterNameFromDetail, limit: 1 }
              });

              if (searchResponse && searchResponse.data && searchResponse.data.rows && searchResponse.data.rows.length > 0) {
                const searchedInfo = searchResponse.data.rows[0];
                // 검색 결과를 상세 정보에 병합 (imageUrl 등)
                finalDetails = {
                  ...finalDetails,
                  ...searchedInfo,
                  imageUrl: searchedInfo.imageUrl || finalDetails.imageUrl,
                };
              } else {
                console.warn(`/df/search API에서 ${characterNameFromDetail} (${serverId}) 에 대한 정보를 찾지 못했습니다.`);
              }
            } catch (searchError) {
              // 검색 API 호출 실패는 전체를 중단시키지 않고, 콘솔에 오류만 기록할 수 있습니다.
              // 또는 사용자에게 부분적인 정보만 로드되었음을 알릴 수도 있습니다.
              console.error(`/df/search API 호출 오류 (${characterNameFromDetail}):`, searchError);
              // 필요하다면 setError를 통해 사용자에게 알릴 수 있지만, 여기서는 일단 콘솔 로그만 남깁니다.
            }
          } else {
            console.warn(`/df/character API 응답에서 characterName을 찾을 수 없습니다. (${serverId}/${characterId})`);
            // characterName이 없으면 검색 API를 호출할 수 없으므로, 여기서 추가적인 에러 처리를 할 수 있습니다.
            // 예를 들어, setError("캐릭터 이름을 가져올 수 없어 추가 정보를 로드할 수 없습니다.");
          }
          
          setCharacterDetails(finalDetails);

        } catch (err) {
          console.error("캐릭터 정보 API 통합 호출 오류:", err);
          setError(
            "캐릭터 정보를 불러오는 중 오류가 발생했습니다. " +
              (err.response?.data?.message || err.message)
          );
        } finally {
          setLoading(false);
        }
      };
      fetchAllCharacterData();
    }
  }, [serverId, characterId, searchParams]);

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
      const payload = {
        serverId: characterDetails.serverId,
        characterName: characterDetails.characterName,
        adventureName: characterDetails.adventureName,
      };

      if (!payload.adventureName) {
        setRegistrationStatus({
          loading: false,
          message: "캐릭터의 모험단 정보를 가져올 수 없습니다. 등록을 진행할 수 없습니다.",
          type: "error",
        });
        return;
      }
      
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
    if (loading && !characterDetails) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)] text-neutral-500 dark:text-neutral-300">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          캐릭터 정보 로딩 중...
        </div>
      );
    }

    if (error && !characterDetails) {
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

    if (!characterDetails) {
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
      setItemInfo,
      avatar,
      creature,
      flag,
      talismans,
      skill,
    } = characterDetails;
    
    const currentServerName = serverNameMap[characterDetails.serverId] || characterDetails.serverId;
    const characterPrimaryImageUrl = characterDetails.imageUrl || `https://img-api.neople.co.kr/df/servers/${characterDetails.serverId}/characters/${characterDetails.characterId}?zoom=3`;
    const fallbackImageUrl = "https://via.placeholder.com/300x400.png?text=Image+Not+Found";

    // 사용자 등록 모험단 이름 (useAuthStore의 user 객체에서 가져옴, 실제 필드명 확인 필요)
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
            // 버튼 표시 로직 시작
            (() => {
              // 현재 조회 중인 캐릭터의 모험단 이름
              const viewingCharacterAdventureName = characterDetails?.adventureName;

              // 조건 1: 사용자가 모험단을 등록했고, 현재 캐릭터의 모험단과 다른 경우 버튼 숨김
              // (단, 현재 캐릭터의 모험단 정보가 있어야 비교 가능)
              if (userRegisteredAdventureName && 
                  viewingCharacterAdventureName && 
                  userRegisteredAdventureName !== viewingCharacterAdventureName) {
                return null; // 버튼을 렌더링하지 않음
              }

              // 조건 2: 그 외의 경우 (사용자가 모험단 등록 안 했거나, 모험단이 같거나, 캐릭터 모험단 정보 로딩 중이거나 없는 경우) 버튼 표시
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
            // 버튼 표시 로직 끝
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
                    ? 'border-[var(--link-accent-color)] text-[var(--link-accent-color)]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-500')
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
          {activeTab === 'equipment' && equipment && <EquipmentSection equipment={equipment} setItemInfo={setItemInfo} />}
          {activeTab === 'avatar' && avatar && <AvatarSection avatar={avatar} />}
          {activeTab === 'skill' && skill?.style && <SkillSection skillStyle={skill.style} />}
          {activeTab === 'buffSkill' && skill?.buff && <BuffSkillSection buffSkillInfo={skill.buff} />}
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
          className="fixed bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden flex flex-col z-40 \
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