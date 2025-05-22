"use client";

import Image from 'next/image';

export default function CharacterProfileCard({
  characterDetails,
  currentServerName,
  characterPrimaryImageUrl,
  fallbackImageUrl,
}) {
  if (!characterDetails) return null;

  const {
    characterName,
    adventureName,
    guildName,
    status,
    fame,
    level,
    jobGrowName,
    serverId,
    characterId,
    imageUrl,
  } = characterDetails;

  const displayLevel = level ? `Lv.${level}` : 'Lv.?';
  const displayJobGrowName = jobGrowName || '정보 없음';
  const resolvedServerName = currentServerName || serverNameMap[serverId] || serverId;

  const serverNameMap = {
    cain: "카인",
    diregie: "디레지에",
    siroco: "시로코",
    prey: "프레이",
    casillas: "카시야스",
    hilder: "힐더",
    anton: "안톤",
    bakal: "바칼",
  };

  const fallbackImageUrlOnError = "https://via.placeholder.com/200x267.png?text=No+Image";

  return (
    <div className="section-box mb-8 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 p-4 flex justify-center items-center item-image-placeholder-bg aspect-[200/267] md:aspect-auto">
          <div className="relative w-full max-w-[200px] h-full min-h-[267px] md:min-h-0 md:h-auto md:aspect-[200/267]">
            <Image
              src={imageUrl || fallbackImageUrlOnError}
              alt={characterName || '캐릭터 이미지'}
              fill
              className="rounded-md object-contain shadow-md"
              onError={(e) => {
                if (e.target.src !== fallbackImageUrlOnError) {
                  e.target.srcset = fallbackImageUrlOnError;
                  e.target.src = fallbackImageUrlOnError;
                }
              }}
              priority
            />
          </div>
        </div>

        <div className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1 section-content-title">
            {characterName || "캐릭터명 없음"}
          </h1>
          <p className="item-entry-text-secondary text-base sm:text-lg mb-4">
            {resolvedServerName} &middot; {displayLevel} &middot; {displayJobGrowName}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm">
            <div>
              <span className="font-semibold item-entry-text-label">모험단:</span>
              <span className="ml-2 item-entry-text-primary">{adventureName || "-"}</span>
            </div>
            <div>
              <span className="font-semibold item-entry-text-label">길드:</span>
              <span className="ml-2 item-entry-text-primary">{guildName || "-"}</span>
            </div>
            <div>
              <span className="font-semibold item-entry-text-label">명성:</span>
              <span className="ml-2 item-entry-text-primary">{fame?.toLocaleString() || "-"}</span>
            </div>
          </div>

          {status && status.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600">
              <h2 className="text-lg font-semibold mb-2 text-neutral-700 dark:text-neutral-200">기본 능력치</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                {status.map((s, index) => (
                  <div key={`status-${index}-${s.name}`} className="bg-neutral-50 dark:bg-neutral-700/60 p-2 rounded-md shadow-sm">
                    <span className="font-medium text-neutral-600 dark:text-neutral-300">{s.name}: </span>
                    <span className="text-neutral-800 dark:text-white font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 