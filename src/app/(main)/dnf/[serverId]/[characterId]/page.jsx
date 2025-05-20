"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import CharacterProfileCard from "@/components/dnf/CharacterProfileCard";
import EquipmentSection from "@/components/dnf/EquipmentSection";
import SetItemEffectSection from "@/components/dnf/SetItemEffectSection";
import AvatarSection from "@/components/dnf/AvatarSection";
import CreatureSection from "@/components/dnf/CreatureSection";
import FlagSection from "@/components/dnf/FlagSection";
import TalismanSection from "@/components/dnf/TalismanSection";

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
  { id: "creature", label: "크리쳐" },
  { id: "talisman", label: "탈리스만" },
  { id: "flag", label: "휘장" },
  { id: "setItemEffect", label: "세트 아이템 효과" },
  // 필요시 추가 탭 (예: 스킬트리, 버프강화 등)
];

export default function CharacterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { serverId, characterId } = params;
  const searchParams = useSearchParams();

  const [characterDetails, setCharacterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS[0].id); // 첫 번째 탭을 기본 활성 탭으로 설정

  useEffect(() => {
    const initialDetailsQuery = searchParams.get('details');
    if (initialDetailsQuery) {
      try {
        const parsedDetails = JSON.parse(initialDetailsQuery);
        setCharacterDetails(parsedDetails);
      } catch (e) {
        console.error("Error parsing initial character details from query params:", e);
      }
    }

    if (serverId && characterId) {
      const fetchCharacterDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/df/character`,
            { params: { server: serverId, characterId: characterId } }
          );
          console.log("캐릭터 상세 정보 API 응답:", response.data);
          setCharacterDetails(prevDetails => ({
            ...prevDetails,
            ...response.data
          }));
        } catch (err) {
          console.error("캐릭터 상세 정보 API 호출 오류:", err);
          setError(
            "캐릭터 정보를 불러오는 중 오류가 발생했습니다: " +
              (err.response?.data?.message || err.message)
          );
        } finally {
          setLoading(false);
        }
      };
      fetchCharacterDetails();
    }
  }, [serverId, characterId, searchParams]);

  const renderContent = () => {
    if (loading && !characterDetails) {
      return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] text-neutral-500 dark:text-neutral-300">
          캐릭터 정보 로딩 중...
        </div>
      );
    }

    if (error && !characterDetails) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] p-4">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4 text-center">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 font-semibold rounded-md transition-colors text-white mypage-button"
          >
            뒤로 가기
          </button>
        </div>
      );
    }

    if (!characterDetails) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] p-4">
          <p className="text-xl mb-4 text-neutral-700 dark:text-neutral-300">캐릭터 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 font-semibold rounded-md transition-colors text-white mypage-button"
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
    } = characterDetails;
    
    const currentServerName = serverNameMap[serverId] || serverId;
    const characterPrimaryImageUrl = characterDetails.characterImageFull || characterDetails.imageUrl || `https://img-api.neople.co.kr/df/servers/${serverId}/characters/${characterId}?zoom=3`;
    const fallbackImageUrl = "https://via.placeholder.com/300x400.png?text=Image+Not+Found";

    return (
      <>
        <CharacterProfileCard
          characterDetails={characterDetails}
          currentServerName={currentServerName}
          characterPrimaryImageUrl={characterPrimaryImageUrl}
          fallbackImageUrl={fallbackImageUrl}
        />

        {/* 탭 메뉴 */} 
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

        {/* 탭 패널 - 로딩 상태는 characterDetails가 있을 경우 내부 컴포넌트의 props 존재 여부로 판단 가능 */}
        {/* 각 섹션 컴포넌트는 characterDetails에서 필요한 props (예: equipment, avatar)를 받음 */}
        {/* characterDetails가 로드되기 전 (초기 로딩 중)에는 아래 섹션들이 렌더링되지 않도록 하거나, 각 섹션에서 로딩 처리 */}
        {loading && !characterDetails.equipment && <div className="py-8 text-center text-neutral-500 dark:text-neutral-300">장비 정보 로딩 중...</div>} 
        
        <div className="mt-4">
          {activeTab === 'equipment' && characterDetails.equipment && <EquipmentSection equipment={characterDetails.equipment} />}
          {activeTab === 'avatar' && characterDetails.avatar && <AvatarSection avatar={characterDetails.avatar} />}
          {activeTab === 'creature' && characterDetails.creature && <CreatureSection creature={characterDetails.creature} />}
          {activeTab === 'talisman' && characterDetails.talismans && <TalismanSection talismans={characterDetails.talismans} />}
          {activeTab === 'flag' && characterDetails.flag && <FlagSection flag={characterDetails.flag} />}
          {activeTab === 'setItemEffect' && characterDetails.setItemInfo && <SetItemEffectSection setItemInfo={characterDetails.setItemInfo} />}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 text-sm font-semibold rounded-md shadow transition-colors text-white mypage-button"
        >
            &larr; 검색 결과로 돌아가기
        </button>
        {characterDetails ? renderContent() : (
             <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] text-neutral-500 dark:text-neutral-300">
                캐릭터 정보 로딩 중...
            </div>
        )}
      </div>
    </div>
  );
} 