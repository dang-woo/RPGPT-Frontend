/* eslint-disable react/prop-types */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { X, Search, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

// Server options for the game (홈페이지와 동일하게 복원)
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

];

// RegisterCharacterModal component for adding new characters
export default function RegisterCharacterModal({ onClose, onSuccess, currentAdventureName }) {
  const [server, setServer] = useState('all'); // 서버 상태 복원, 초기값 'all'
  const [characterName, setCharacterName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState({ type: '', message: '' });
  const [registeredCharacterId, setRegisteredCharacterId] = useState(null);

  // Use currentAdventureName prop for adventure name search
  const adventureNameToSearch = currentAdventureName;

  // Handle character search via API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!characterName.trim()) { 
      setError('검색어를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setSearchResult(null);
    setError('');
    setRegistrationStatus({ type: '', message: '' });

    try {
      const searchParams = {
        server: server,
        name: characterName.trim(),
        limit: 10, // 필요시 검색 결과 수 제한
      };
      const filteredSearchParams = Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null));
      
      const response = await apiClient.get('/df/search', { params: filteredSearchParams });

      if (response.data && response.data.rows && response.data.rows.length > 0) {
        const charactersWithDetails = await Promise.all(
          response.data.rows.map(async (char) => {
            try {
              const detailResponse = await apiClient.get('/df/character', { 
                params: { server: char.serverId, characterId: char.characterId } 
              });
              return { ...char, ...detailResponse.data }; 
            } catch (detailError) {
              console.error(`캐릭터 상세 정보 조회 오류 (${char.characterName}):`, detailError);
              return char; 
            }
          })
        );

        // 모험단 이름 필터링 로직 추가
        const isSpecificAdventureContext = adventureNameToSearch && 
                                        adventureNameToSearch !== "정보 없음" && 
                                        adventureNameToSearch !== "모험단 이름 정보 없음" &&
                                        adventureNameToSearch !== "등록된 모험단 없음"; // 기타 플레이스홀더 추가 가능

        if (isSpecificAdventureContext) {
          const filteredByAdventure = charactersWithDetails.filter(
            (char) => char.adventureName === adventureNameToSearch
          );

          if (filteredByAdventure.length > 0) {
            setSearchResult(filteredByAdventure);
            setError(''); // 이전 에러 메시지 초기화
          } else {
            setSearchResult([]);
            setError(`'${adventureNameToSearch}' 모험단 내에서 '${characterName.trim()}' (으)로 검색된 캐릭터가 없습니다.`);
          }
        } else {
          // 특정 모험단 컨텍스트가 아니면 모든 결과 표시
          setSearchResult(charactersWithDetails);
          if (charactersWithDetails.length === 0) { // 이 경우는 사실상 상단에서 먼저 걸러질 수 있음
             setError('검색 결과가 없거나 캐릭터 정보를 가져오지 못했습니다.');
          } else {
            setError('');
          }
        }
      } else {
        setError('검색 결과가 없습니다. 서버와 검색어를 확인해주세요.');
      }
    } catch (err) {
      console.error("캐릭터 검색 오류:", err);
      setError(err.response?.data?.message || '캐릭터 검색 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  // Handle character registration
  const handleRegister = async (character) => {
    setIsLoading(true);
    setError('');
    setRegistrationStatus({ type: '', message: '' });
    try {
      // 페이로드 구성: serverId, characterName, adventureName
      const payload = {
        serverId: character.serverId, // 서버 ID 다시 포함
        characterName: character.characterName,
        // character 객체에 adventureName이 있으면 사용, 없으면 currentAdventureName 사용
        adventureName: character.adventureName || currentAdventureName 
      };

      // adventureName이 payload에 없는 경우 (둘 다 null/undefined/빈 문자열 일 수 있음)
      if (!payload.adventureName) {
        setRegistrationStatus({ type: 'error', message: '캐릭터의 모험단 이름을 알 수 없어 등록할 수 없습니다. 모험단 이름을 확인해주세요.' });
        setIsLoading(false);
        return;
      }
      
      const response = await apiClient.post('/characters', payload);

      if (response.data && response.data.success) {
        setRegisteredCharacterId(response.data.characterId);
        setRegistrationStatus({ type: 'success', message: `${character.characterName}(${character.adventureName || 'N/A'}) 캐릭터가 성공적으로 등록되었습니다!` });
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        setRegistrationStatus({ type: 'error', message: response.data?.message || '캐릭터 등록에 실패했습니다.' });
      }
    } catch (err) {
      console.error("캐릭터 등록 오류:", err);
      const apiErrorMessage = err.response?.data?.message;
      if (apiErrorMessage && apiErrorMessage.includes("이미 등록된 캐릭터입니다")) {
        setRegistrationStatus({ type: 'error', message: apiErrorMessage });
      } else {
        setRegistrationStatus({ type: 'error', message: apiErrorMessage || '캐릭터 등록 중 알 수 없는 오류가 발생했습니다.' });
      }
    }
    setIsLoading(false);
  };

  return (
    // Modal overlay: Covers the entire screen with a semi-transparent background
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'var(--overlay-bg)' }} // Apply overlay background
      onClick={onClose}
    >
      {/* Modal content: Main container for the modal, styled to be non-transparent */}
      <div 
        className="modal-content-area rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header: Title and close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {currentAdventureName ? `${currentAdventureName} 모험단에 새 캐릭터 등록` : '새 캐릭터 등록'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        
        {/* Search form: Allows users to search for characters */}
        <form onSubmit={handleSearch} className="space-y-4 mb-4">
          {/* Server and Character Name Input Row */}
          <div className="flex flex-col sm:flex-row items-end space-y-3 sm:space-y-0 sm:space-x-2">
            {/* Server Selection - 복원됨 */}
            <div className="w-full sm:w-1/4">
              <label htmlFor="serverModal" className="block text-sm font-medium mb-1">서버</label>
              <select 
                id="serverModal" 
                value={server} 
                onChange={(e) => setServer(e.target.value)} 
                className="form-input h-10 py-2"
              >
                {serverOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
              </select>
            </div>
            
            {/* Character Name Input and Search Button */}
            <div className="flex-1 flex items-end space-x-2 w-full sm:w-auto">
              <div className="flex-grow">
                <label htmlFor="characterNameModal" className="block text-sm font-medium mb-1">검색어</label> {/* 레이블 변경 */}
                <input 
                  type="text"
                  id="characterNameModal"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="form-input h-10 py-2" // 높이 조정
                  placeholder="캐릭터명 또는 모험단명 입력" // 플레이스홀더 변경
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !characterName.trim()} // 비활성화 조건 수정
                className="mypage-button px-3 py-2 h-10 flex items-center justify-center flex-shrink-0" // 버튼 크기 및 정렬 조정
                title="캐릭터 검색"
              >
                <Search size={20} /> 
              </button>
            </div>
          </div>
        </form>

        {/* Error message: Displays if search fails */}
        {error && (
          <div className="my-3 p-3 rounded-md text-sm flex items-center alert-error">
            <AlertTriangle size={18} className="mr-2 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Registration status: Shows success or error after registration attempt */}
        {registrationStatus.message && (
          <div className={`my-3 p-3 rounded-md text-sm flex items-center 
            ${registrationStatus.type === 'success' ? 'alert-success' : ''}
            ${registrationStatus.type === 'error' ? 'alert-error' : ''}
          `}>
            {registrationStatus.type === 'success' && <CheckCircle size={18} className="mr-2 flex-shrink-0" />}
            {registrationStatus.type === 'error' && <AlertTriangle size={18} className="mr-2 flex-shrink-0" />}
            {registrationStatus.message}
          </div>
        )}

        {/* Search results: Displays list of found characters */}
        {searchResult && !registrationStatus.message && (
          <div className="mt-1 overflow-y-auto flex-grow">
            <h3 className="text-md font-semibold mb-2">검색 결과:</h3>
            <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {searchResult.map((char) => (
                <li key={char.characterId} className="p-3 rounded-md transition-colors search-result-item">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{char.characterName} <span className="text-xs text-gray-500 dark:text-gray-400">({char.jobGrowName})</span></p>
                      {/* 서버 이름 표시 부분은 복원된 serverOptions 사용 */}
                      <p className="text-xs text-gray-600 dark:text-gray-300">서버: {serverOptions.find(s => s.id === char.serverId)?.name || char.serverId} | 모험단: {char.adventureName || '-'}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">레벨: {char.level}</p>
                    </div>
                    <button 
                      onClick={() => handleRegister(char)} 
                      disabled={isLoading}
                      className="button-success"
                    >
                      {isLoading && registrationStatus.type === '' ? <Loader2 size={14} className="animate-spin" /> : '이 캐릭터 등록'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Loading indicator: Shows during search or registration */}
        {isLoading && searchResult && (
          <div className="mt-4 flex justify-center">
            <Loader2 size={28} className="animate-spin text-sky-600" />
          </div>
        )}
      </div>
    </div>
  );
}