"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { serverNameMap } from '@/app/mypage/mockData';

const AdventureCharacterCard = ({ character, onShowDetails }) => {
    // const serverName = serverNameMap[character.serverId] || character.serverId;
    const serverName = character.serverId;
    const 버튼_스타일_공통 = "w-full py-2.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50";
    const 데미지_버튼_스타일 = `${버튼_스타일_공통} bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white`;
    const 버프_버튼_스타일 = `${버튼_스타일_공통} bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white`;

    // character 객체에 link 속성이 있다고 가정. 없다면 적절한 경로로 수정 필요
    // 예: `/character/${character.serverId}/${character.characterId}`
    const characterDetailLink = `/dnf/character/${character.serverId}/${character.characterName}?characterId=${character.characterId}`;

    return (
        <div className="rounded-xl shadow-lg overflow-hidden bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full">
            <div className="relative w-full aspect-[4/3]">
                <Image
                    src={character.characterImage || "/images/default_character.png"}
                    alt={character.characterName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    priority
                />
            </div>
            <div className="p-4 md:p-5 flex flex-col flex-grow">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100 truncate">
                    {character.characterName}
                </h3>
                <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 space-y-1 mb-3 flex-grow">
                    <p>서버: {serverName}</p>
                    <p>레벨: Lv.{character.level}</p>
                    <p>직업: {character.jobGrowName}</p>
                    {character.adventureName && <p>모험단: {character.adventureName}</p>}
                </div>
                <button
                    onClick={() => onShowDetails(character.serverId, character.characterId)}
                    className="block w-full text-center bg-sky-600 dark:bg-sky-500 text-white py-2.5 md:py-3 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors font-medium mt-auto text-sm md:text-base"
                >
                    캐릭터 상세보기
                </button>
            </div>
        </div>
    );
};

export default AdventureCharacterCard; 