"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { serverNameMap } from '@/app/mypage/mockData';

const AdventureCharacterCard = ({ character }) => {
    const serverName = serverNameMap[character.serverId] || character.serverId;
    const 버튼_스타일_공통 = "w-full py-2.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50";
    const 데미지_버튼_스타일 = `${버튼_스타일_공통} bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white`;
    const 버프_버튼_스타일 = `${버튼_스타일_공통} bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white`;

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
            <div className="flex-shrink-0">
                <Image
                    src={character.characterImage}
                    alt={character.characterName}
                    width={64}
                    height={64}
                    className="rounded-full"
                />
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{character.characterName}</h3>
                <p className="text-gray-400">레벨: {character.level}</p>
                <p className="text-gray-400">직업: {character.jobGrowName}</p>
                <p className="text-gray-400">서버: {serverName}</p>
                <p className="text-gray-400">모험단: {character.adventureName}</p>
                {/* // TODO: API 연동 시 실제 전투력 또는 관련 정보 표시 */}
                {/* <p className="text-gray-400">전투력: {character.buffPower}</p> */}
            </div>
        </div>
    );
};

export default AdventureCharacterCard; 