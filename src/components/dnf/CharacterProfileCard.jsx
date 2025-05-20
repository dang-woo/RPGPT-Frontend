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
  } = characterDetails;

  const displayLevel = characterDetails.level ? `Lv.${characterDetails.level}` : 'Lv.?';
  const displayJobGrowName = characterDetails.jobGrowName || '정보 없음';

  return (
    <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 mb-8">
      <div className="md:flex">
        <div className="md:w-1/3 bg-neutral-100 dark:bg-neutral-700 p-4 flex justify-center items-center">
          <div className="relative w-full max-w-[200px] aspect-[2/3]">
            <Image
              src={characterPrimaryImageUrl}
              alt={characterName || '캐릭터 이미지'}
              fill
              className="rounded-md object-contain shadow-md"
              onError={(e) => {
                e.currentTarget.srcset = fallbackImageUrl;
                e.currentTarget.src = fallbackImageUrl;
              }}
              priority
            />
          </div>
        </div>

        <div className="md:w-2/3 p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: 'var(--link-accent-color)' }}>
            {characterName}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg mb-4">
            {currentServerName} &middot; {displayLevel} &middot; {displayJobGrowName}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4 text-sm">
            <div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">모험단:</span>
              <span className="ml-2 text-neutral-800 dark:text-neutral-100">{adventureName || "-"}</span>
            </div>
            <div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">길드:</span>
              <span className="ml-2 text-neutral-800 dark:text-neutral-100">{guildName || "-"}</span>
            </div>
            {fame && (
                <div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">명성:</span>
                    <span className="ml-2 text-neutral-800 dark:text-neutral-100">{fame}</span>
                </div>
            )}
          </div>

          {status && status.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--link-accent-color)' }}>기본 능력치</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                {status.map((s, index) => (
                  <div key={index} className="bg-neutral-50 dark:bg-neutral-700 p-2 rounded">
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