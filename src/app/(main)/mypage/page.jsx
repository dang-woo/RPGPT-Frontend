"use client"; // 클라이언트 컴포넌트로 전환

import React, { useState, useEffect } from 'react'; // useState, useEffect 추가
import Link from 'next/link'; // Link 임포트 추가
import { useRouter } from 'next/navigation'; // useRouter 임포트
// import DnfCharacterCard from '@/components/dnf/DnfCharacterCard'; // 기존 카드 주석 처리
import AdventureCharacterCard from '@/components/mypage/AdventureCharacterCard'; // 새로운 카드 임포트
import useAuthStore from '@/lib/store/authStore'; // useAuthStore 임포트
import apiClient from '@/lib/apiClient'; // apiClient 임포트
import { Users, Search, ServerCrash, PlusCircle, Loader2 } from 'lucide-react'; // Users 아이콘 import 추가, Loader2 아이콘 추가
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
  const { user, isLoading: authLoading } = useAuthStore(); // 사용자 정보 가져오기
  const router = useRouter(); // useRouter 인스턴스 생성
  const [characters, setCharacters] = useState([]); // 등록된 캐릭터 목록 (초기엔 빈 배열)
  const [loading, setLoading] = useState(true); // 페이지 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 상태는 유지

  useEffect(() => {
    if (authLoading) {
      // 사용자 정보 로딩 중에는 아무것도 하지 않음
      return;
    }

    if (!user) {
      // 사용자가 로그인하지 않았고, 인증 로딩이 끝난 경우 로그인 페이지 등으로 리디렉션
      // router.push('/login'); 
      setLoading(false); // 이 경우 데이터 로딩은 시도하지 않음
      return;
    }

    // 사용자가 로그인한 경우, 등록된 모든 캐릭터를 가져오는 함수 호출
    const fetchUserCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        // "현재 사용자가 등록한 모든 캐릭터 조회" API가 없으므로, 
        // 일단 API 호출을 시도하지 않고 빈 배열로 처리하여 에러를 방지합니다.
        // 백엔드 API가 준비되면 아래 주석을 해제하고 실제 API를 호출해야 합니다.
        /* 
        const response = await apiClient.get('/characters/my-characters'); 
        if (response.data && response.data.success) {
          setCharacters(response.data.data || []); 
        } else {
          setError(response.data?.message || "등록된 캐릭터 정보를 가져오는 데 실패했습니다.");
          setCharacters([]);
        }
        */
        // 임시로 빈 배열 설정 및 로딩 종료
        setCharacters([]);
        setLoading(false); 
        // 만약 백엔드 API 없이 테스트하고 싶다면, 아래와 같이 목업 데이터를 사용할 수 있습니다.
        /*
        setCharacters([
          { serverId: 'cain', characterId: 'test1', characterName: '테스트용캐릭1', jobGrowName: '딜러', level: 110, adventureName: '테스트모험단' },
          { serverId: 'prey', characterId: 'test2', characterName: '임시캐릭터2', jobGrowName: '버퍼', level: 110, adventureName: '테스트모험단' },
        ]);
        setLoading(false);
        */

      } catch (err) {
        // 위에서 API 호출을 주석처리했으므로, 이 catch 블록은 현재 실행되지 않음
        console.error("사용자 캐릭터 조회 오류:", err);
        setError("캐릭터 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setCharacters([]);
        setLoading(false);
      }
    };

    // API가 없으므로 fetchUserCharacters 호출 대신 직접 로딩 상태를 false로 설정
    // fetchUserCharacters(); 
    setLoading(false); // API 호출을 안 하므로, 사용자 정보 로딩 후 바로 데이터 로딩 완료 처리

  }, [user, authLoading, router]);

  const handleShowDetailsOnMypage = (serverId, characterId) => {
    router.push(`/dnf/${serverId}/${characterId}`);
  };

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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-grow mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mypage-title mb-4 sm:mb-0">
            {user?.nickname || '사용자'}님이 등록한 캐릭터
          </h1>
          <Link href="/mypage/register-character" className="self-start sm:self-center mt-2 sm:mt-0">
            <button className="mypage-button whitespace-nowrap px-4 py-2 flex items-center">
              <PlusCircle size={18} className="mr-2" /> 새 캐릭터 등록하기
            </button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg text-center text-sm flex flex-col items-center">
            <ServerCrash className="w-10 h-10 mb-2" />
            <p className="font-semibold">오류 발생</p>
            <p>{error}</p>
          </div>
        )}

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
                  <Link href="/mypage/register-character">
                    <button className="mypage-button flex items-center">
                      <PlusCircle size={18} className="mr-2" /> 캐릭터 등록하러 가기
                    </button>
                  </Link>
                </div>
            </div>
        )}

        {!loading && !error && characters.length > 0 && (
          <>
            <h2 className="text-xl sm:text-2xl font-semibold mypage-title mb-6">
              총 {characters.length}개의 캐릭터가 등록되어 있습니다.
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {characters.map((character) => (
                <li key={`${character.serverId}-${character.characterId}`}>
                  <AdventureCharacterCard 
                    character={character}
                    onShowDetails={() => handleShowDetailsOnMypage(character.serverId, character.characterId)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
} 