"use client";

import Image from 'next/image'; // Next.js Image 컴포넌트 사용 고려

export default function DnfCharacterCard({ character, serverOptions, onShowDetails, onRegister }) {
  const serverName = serverOptions.find(s => s.id === character.serverId)?.name || character.serverId;
  // API 응답에 imageUrl이 있으면 사용, 없으면 기존 방식으로 구성
  const characterImageUrl = character.imageUrl || `https://img-api.neople.co.kr/df/servers/${character.serverId}/characters/${character.characterId}?zoom=1`;
  // Fallback 이미지 URL 정의
  const fallbackImageUrl = "https://via.placeholder.com/150/E5E7EB/9CA3AF?Text=No+Image"; 

  const handleCardClick = () => {
    if (onShowDetails) {
      onShowDetails(character.serverId, character.characterId);
    }
  };

  return (
    <div 
      className="character-card-base cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-w-4 aspect-h-3 character-card-image-bg relative min-h-32 md:min-h-40">
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
        <h3 className="text-lg font-bold truncate text-[var(--main-button-bg)]">
          {character.characterName}
        </h3>
        <p className="text-xs mt-1" style={{ color: 'var(--card-subtext-color)' }}>
          {character.jobGrowName}
        </p>
        <div className="mt-3 flex justify-between items-center text-xs" style={{ color: 'var(--card-subtext-color)' }}>
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
          className="w-full text-center py-2.5 transition-colors font-medium mt-auto button-success"
        >
          이 캐릭터 등록하기
        </button>
      )}
    </div>
  );
} 