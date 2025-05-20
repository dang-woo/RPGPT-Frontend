"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function CreatureSection({ creature }) {
  if (!creature || !creature.itemName) { // 크리쳐 이름이 없을 경우 표시 안 함
    return null; // 또는 "장착된 크리쳐가 없습니다." 메시지 반환
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--link-accent-color)' }}>크리쳐</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        {creature.itemImage && (
          <div className="relative w-20 h-20 mr-4 mb-2 sm:mb-0 flex-shrink-0">
            <Image
              src={creature.itemImage}
              alt={creature.itemName || '크리쳐 이미지'}
              width={80}
              height={80}
              className="rounded object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
        <div className="flex-grow">
          <p className={`text-xl font-semibold ${rarityColorMap[creature.itemRarity] || 'text-neutral-800 dark:text-neutral-100'}`}>
            {creature.itemName}
          </p>
          {/* API 응답에 크리쳐 스탯 정보가 있다면 추가 (예: creature.status) */}
          {/* <p className="text-sm text-neutral-600 dark:text-neutral-400">스탯: 힘 +50, 지능 +50</p> */}
        </div>
      </div>

      {creature.artifact && creature.artifact.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--link-accent-color)' }}>아티팩트</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {creature.artifact.map((art, index) => (
              <div key={index} className="p-2 bg-neutral-50 dark:bg-neutral-700 rounded shadow text-sm">
                <p className={`font-medium ${rarityColorMap[art.itemRarity] || 'text-neutral-700 dark:text-neutral-200'}`}>
                  {art.itemName} ({art.slotColor ? `${art.slotColor} 슬롯` : '정보 없음'})
                </p>
                {/* API 응답에 아티팩트 옵션 정보가 있다면 추가 (예: art.options) */}
                {/* <p className="text-xs text-gray-500">옵션: 공격력 증가 +5%</p> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 