"use client";

import Image from 'next/image'; // Next.js Image 컴포넌트 사용 고려

export default function DnfCharacterCard({ character, serverOptions, onShowDetails, onRegister }) {
  const serverName = serverOptions.find(s => s.id === character.serverId)?.name || character.serverId;
  // API 응답에 imageUrl이 있으면 사용, 없으면 기존 방식으로 구성
  const characterImageUrl = character.imageUrl || `https://img-api.neople.co.kr/df/servers/${character.serverId}/characters/${character.characterId}?zoom=1`;

  // Fallback 이미지 URL (라이트/다크 모드에 따라 적절히 선택하거나, 단일 placeholder 사용)
  const fallbackImageUrl = "https://via.placeholder.com/150/E5E7EB/9CA3AF?Text=DNF"; 

  const handleCardClick = () => {
    if (onShowDetails) {
      onShowDetails(character.serverId, character.characterId);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer border border-neutral-200 dark:border-neutral-700 flex flex-col h-full"
      onClick={handleCardClick}
    >
      <div className="aspect-w-1 aspect-h-1 bg-neutral-200 dark:bg-neutral-700 relative min-h-32 md:min-h-40">
        <Image 
          src={characterImageUrl}
          alt={character.characterName || '캐릭터 이미지'}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            e.currentTarget.srcset = fallbackImageUrl;
            e.currentTarget.src = fallbackImageUrl;
          }}
          priority={true}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-[var(--link-accent-color)] dark:text-yellow-400 truncate">
          {character.characterName}
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          {character.jobGrowName}
        </p>
        <div className="mt-3 flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-300">
          <span>Lv.{character.level}</span>
          <span>{serverName}</span>
        </div>
      </div>
      {onRegister && (
        <button 
          onClick={(e) => { 
            e.stopPropagation();
            onRegister(character); 
          }}
          className="w-full text-center bg-green-600 dark:bg-green-500 text-white py-2.5 hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium mt-auto"
        >
          이 캐릭터 등록하기
        </button>
      )}
    </div>
  );
} 