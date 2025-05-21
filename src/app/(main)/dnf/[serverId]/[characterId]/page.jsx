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
  { id: "setItemEffect", label: "세트 아이템 효과" },
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
        initialCharacterName = parsedDetails.characterName; // 검색 API 호출에 사용
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
          // 두 API를 동시에 호출
          const [detailResponse, searchResponse] = await Promise.all([
            axios.get(
              `http://localhost:8080/api/df/character`,
              { params: { server: serverId, characterId: characterId } }
            ),
            // 검색 API는 characterName으로 검색해야 하므로, 초기 정보에서 가져오거나 상세 API 응답 후 설정
            // 여기서는 초기 쿼리 파라미터의 characterName을 사용하고, 없다면 characterId를 이름처럼 사용 (백엔드 지원 여부 확인 필요)
            // 또는, 첫 API 응답 후 characterName을 얻어서 두 번째 호출을 하는 방법도 있으나, 동시 호출이 어려워짐
            // 일단 initialCharacterName이 있다고 가정하고 진행
            initialCharacterName ? 
              axios.get(
                `http://localhost:8080/api/df/search`,
                { params: { server: serverId, name: initialCharacterName } }
              ) : 
              Promise.resolve(null) // initialCharacterName 없으면 search API 호출 안함 (또는 다른 대체 로직)
          ]);

          let finalDetails = detailResponse.data; // 상세 API 결과를 기본으로

          if (searchResponse && searchResponse.data && searchResponse.data.rows) {
            const searchedCharacter = searchResponse.data.rows.find(
              (char) => char.characterId === characterId
            );

            if (searchedCharacter) {
              // 상세 API 결과에 없는 정보만 검색 API 결과에서 가져와 병합
              // (예시: 만약 상세 API에 level이 없다면 searchedCharacter.level 사용)
              // 현재는 대부분의 정보가 상세 API에 있으므로, 필요한 경우 아래와 같이 특정 필드를 선택적으로 병합
              finalDetails = {
                ...searchedCharacter, // 검색 API 결과를 기본으로 깔고
                ...finalDetails,      // 상세 API 결과로 덮어쓰기 (상세 정보 우선)
                                      // 또는 특정 필드만 선택적 병합:
                                      // level: finalDetails.level || searchedCharacter.level,
                                      // jobGrowName: finalDetails.jobGrowName || searchedCharacter.jobGrowName,
              };
            }
          }
          
          // 최종 병합된 데이터로 상태 업데이트
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
            <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
              <button
                onClick={handleRegisterCharacter}
                disabled={registrationStatus.loading || registrationStatus.type === 'success'}
                className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md shadow transition-colors text-white 
                          ${registrationStatus.loading ? 'bg-gray-400 cursor-not-allowed' : 
                           registrationStatus.type === 'success' ? 'bg-green-500 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
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
          {activeTab === 'equipment' && equipment && <EquipmentSection equipment={equipment} />}
          {activeTab === 'avatar' && avatar && <AvatarSection avatar={avatar} />}
          {activeTab === 'skill' && skill?.style && <SkillSection skillStyle={skill.style} />}
          {activeTab === 'buffSkill' && skill?.buff && <BuffSkillSection buffSkillInfo={skill.buff} />}
          {activeTab === 'creature' && creature && <CreatureSection creature={creature} />}
          {activeTab === 'talisman' && talismans && <TalismanSection talismans={talismans} />}
          {activeTab === 'flag' && flag && <FlagSection flag={flag} />}
          {activeTab === 'setItemEffect' && setItemInfo && <SetItemEffectSection setItemInfo={setItemInfo} />}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 text-sm font-semibold rounded-md shadow transition-colors text-white bg-sky-600 hover:bg-sky-700 mypage-button"
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
          <div className="p-4 border-b dark:border-neutral-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">AI 채팅</h2>
            <button onClick={toggleChat} className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">&times;</button>
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