"use client"; // 클라이언트 컴포넌트로 전환

import React, { useState, useEffect } from 'react'; // useState, useEffect 추가
import Link from 'next/link'; // Link 임포트 추가
// import DnfCharacterCard from '@/components/dnf/DnfCharacterCard'; // 기존 카드 주석 처리
import AdventureCharacterCard from '@/components/mypage/AdventureCharacterCard'; // 새로운 카드 임포트
import useAuthStore from '@/lib/store/authStore'; // useAuthStore 임포트
import { Users } from 'lucide-react'; // Users 아이콘 import 추가
// import axios from 'axios'; // 현재 사용하지 않으므로 주석 처리 또는 삭제

// 메인 페이지에서 사용하는 serverOptions와 동일하게 정의
// AdventureCharacterCard 내부에서는 현재 serverOptions를 직접 사용하지 않으므로, 필요하다면 props로 넘겨주거나 내부에서 처리해야 합니다.
// const serverOptionsForMypage = [
//   { id: "all", name: "전체" },
//   { id: "cain", name: "카인" },
//   { id: "diregie", name: "디레지에" },
//   { id: "siroco", name: "시로코" },
//   { id: "prey", name: "프레이" },
//   { id: "casillas", name: "카시야스" },
//   { id: "hilder", name: "힐더" },
//   { id: "anton", name: "안톤" },
//   { id: "bakal", name: "바칼" },
//   { id: "adven", name: "모험단" },
// ];

// 컴포넌트 이름을 MyPage로 변경 (기존 파일명과 일치)
export default function MyPage() { 
  const { user } = useAuthStore(); // 사용자 정보 가져오기
  const [characters, setCharacters] = useState([]); // 등록된 캐릭터 목록 (초기엔 빈 배열)
  const [loading, setLoading] = useState(true); // 로딩 상태는 유지 (향후 API 호출 시 사용)
  const [error, setError] = useState(null); // 에러 상태는 유지

  useEffect(() => {
    // TODO: 백엔드에서 현재 로그인된 사용자의 등록된 캐릭터 목록을 가져오는 API 호출 로직 필요
    // 이 부분은 실제 API 응답에 따라 character 객체의 구조가 AdventureCharacterCard와 맞는지 확인 필요
    // 현재는 API가 없으므로, 임시 캐릭터 데이터로 테스트하거나 빈 배열로 둡니다.
    const mockCharacters = [
      {
        serverId: 'cain',
        characterId: '12345',
        characterName: '테스트캐릭1',
        level: 110,
        jobGrowName: '진각성명칭1',
        characterImage: '/images/character_placeholder_1.jpg', // 실제 이미지 경로 또는 placeholder
        adventureName: '나의모험단'
      },
      {
        serverId: 'prey',
        characterId: '67890',
        characterName: '캐릭터명이다',
        level: 110,
        jobGrowName: '진각성명칭2',
        characterImage: '/images/character_placeholder_2.jpg', // 실제 이미지 경로 또는 placeholder
        adventureName: '강한모험단'
      },
    ];
    // setCharacters(mockCharacters); // 목업 데이터 사용 시
    setCharacters([]); // API 연동 전까지는 빈 배열
    setLoading(false);
  }, [user]);

  // AdventureCharacterCard에 전달할 onShowDetails 함수
  // 이 함수는 캐릭터 상세 페이지로 이동하거나, 모달을 띄우는 등의 역할을 할 수 있습니다.
  const handleShowDetailsOnMypage = (serverId, characterId) => {
    console.log(`Show details for character: ${characterId} on server: ${serverId}`);
    // 예시: router.push(`/character/${serverId}/${characterId}`); (useRouter 훅 필요)
  };

  // 로딩 및 사용자 인증 상태에 따른 UI 렌더링
  if (loading && !user) {
    return <div className="flex-grow flex items-center justify-center p-4"><p className="text-gray-400">사용자 정보를 불러오는 중입니다...</p></div>;
  }
  if (!user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <p className="text-gray-400 mb-4">로그인이 필요한 서비스입니다.</p>
        <Link href="/login">
          <button className="mypage-button px-6 py-2">로그인 하러 가기</button>
        </Link>
      </div>
    );
  }
  if (loading) {
    return <div className="flex-grow flex items-center justify-center p-4"><p className="text-gray-400">등록된 캐릭터 정보를 불러오는 중입니다...</p></div>;
  }
  if (error) {
    return <div className="flex-grow flex items-center justify-center p-4"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-grow mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mypage-title mb-4 sm:mb-0">
            {user?.nickname || '사용자'}님의 대표 캐릭터
          </h1>
          <Link href="/mypage/register-character" className="self-start sm:self-center mt-2 sm:mt-0">
            <button className="mypage-button whitespace-nowrap px-4 py-2">
              내 캐릭터 등록하기
            </button>
          </Link>
        </div>

        {characters.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {characters.map((character) => (
              <li key={`${character.serverId}-${character.characterId}`}>
                <AdventureCharacterCard 
                  character={character}
                  onShowDetails={handleShowDetailsOnMypage}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex-grow flex flex-col justify-center items-center text-center py-12 md:py-16 rounded-xl shadow-sm border mypage-empty-state">
            <Users className="mx-auto h-16 w-16 mb-4 mypage-empty-state-icon" strokeWidth={1.5} />
            <h3 className="mt-3 text-lg font-semibold mypage-empty-state-title">등록된 캐릭터가 없습니다.</h3>
            <p className="mt-1.5 text-sm mypage-empty-state-text">
              당신의 멋진 캐릭터들을 등록하고 관리해보세요.
            </p>
            <div className="mt-6">
              <Link href="/mypage/register-character">
                <button
                  type="button"
                  className="mypage-button"
                >
                  캐릭터 등록하기
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 