"use client"; // 클라이언트 컴포넌트로 전환

import React, { useState, useEffect } from 'react'; // useState, useEffect 추가
import Link from 'next/link'; // Link 임포트 추가
import DnfCharacterCard from '@/components/dnf/DnfCharacterCard';
import useAuthStore from '@/lib/store/authStore'; // useAuthStore 임포트
// import axios from 'axios'; // 현재 사용하지 않으므로 주석 처리 또는 삭제

// 메인 페이지에서 사용하는 serverOptions와 동일하게 정의
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
  { id: "adven", name: "모험단" },
];

// 컴포넌트 이름을 MyPage로 변경 (기존 파일명과 일치)
export default function MyPage() { 
  const { user } = useAuthStore(); // 사용자 정보 가져오기
  const [characters, setCharacters] = useState([]); // 등록된 캐릭터 목록 (초기엔 빈 배열)
  const [loading, setLoading] = useState(true); // 로딩 상태는 유지 (향후 API 호출 시 사용)
  const [error, setError] = useState(null); // 에러 상태는 유지

  useEffect(() => {
    // TODO: 백엔드에서 현재 로그인된 사용자의 등록된 캐릭터 목록을 가져오는 API 호출 로직 필요
    // 예시: const fetchMyCharacters = async () => { ... }
    // fetchMyCharacters();
    
    // 현재는 API가 없으므로, 로딩 상태만 false로 변경하고 빈 캐릭터 목록을 표시
    setCharacters([]); // API 연동 전까지는 빈 배열
    setLoading(false);
    // setError("등록된 캐릭터를 불러오는 중 오류가 발생했습니다."); // 테스트용 에러 메시지

  }, [user]); // user가 변경될 때 (로그인/로그아웃 시) 다시 실행될 수 있도록 user를 의존성 배열에 추가

  const handleShowDetailsOnMypage = (serverId, characterId) => {
    console.log(`Details for ${characterId} on ${serverId} - Mypage (no navigation)`);
    // 필요시 router.push 사용 (useRouter 훅 필요)
  };

  if (loading && !user) { // 사용자 정보가 로드되기 전까지 로딩 표시 (선택 사항)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">사용자 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 로그인하지 않은 사용자는 로그인 페이지로 유도하거나 다른 처리를 할 수 있음
  // 이 부분은 Navigation 컴포넌트나 상위 레이아웃에서 처리될 수도 있음
  if (!user) {
      return (
          <div className="container mx-auto px-4 py-8 text-center">
              <p className="text-gray-400 mb-4">로그인이 필요한 서비스입니다.</p>
              <Link href="/login">
                  <button className="mypage-button px-6 py-2">
                      로그인 하러 가기
                  </button>
              </Link>
          </div>
      );
  }

  // 실제 API 로딩 상태 (캐릭터 목록 로딩)
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">등록된 캐릭터 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mypage-title">
          {user?.nickname || '사용자'}님의 대표 캐릭터
        </h1>
        <Link href="/mypage/register-character">
          <button className="mypage-button">
            내 캐릭터 등록하기
          </button>
        </Link>
      </div>

      {characters.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {characters.map((character) => (
            <li key={`${character.serverId}-${character.characterId}`}>
              <DnfCharacterCard 
                character={character}
                serverOptions={serverOptionsForMypage}
                onShowDetails={handleShowDetailsOnMypage}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10">
            <p className="text-gray-400 text-lg mb-4">아직 등록된 캐릭터가 없습니다.</p>
            <p className="text-gray-500">
                '내 캐릭터 등록하기' 버튼을 눌러 당신의 멋진 캐릭터들을 추가해보세요!
            </p>
        </div>
      )}
    </div>
  );
} 