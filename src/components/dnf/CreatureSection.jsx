"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function CreatureSection({ creature }) {
  if (!creature || !creature.itemName) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">크리쳐</h2>
        <p className="text-neutral-500 dark:text-neutral-400">장착된 크리쳐가 없습니다.</p>
      </div>
    );
  }

  const creatureRarityClass = rarityColorMap[creature.itemRarity] || 'text-neutral-800 dark:text-neutral-100';

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">크리쳐 정보</h2>
      <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-600">
        <div className="mb-3">
          <h3 className={`text-xl font-semibold ${creatureRarityClass}`}>
            {creature.itemName}
          </h3>
          {/* API 응답에 크리쳐 스탯 정보가 있다면 여기에 추가 (예: creature.status) */}
          {/* <p className="text-sm text-neutral-600 dark:text-neutral-400">스탯: 힘 +50, 지능 +50</p> */}
        </div>

        {creature.artifact && creature.artifact.length > 0 ? (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600">
            <h4 className="text-lg font-semibold mb-3 text-neutral-700 dark:text-neutral-200">아티팩트</h4>
            <ul className="space-y-2">
              {creature.artifact.map((art, index) => {
                const artifactRarityClass = rarityColorMap[art.itemRarity] || 'text-neutral-700 dark:text-neutral-300';
                return (
                  <li key={index} className="p-2.5 bg-neutral-100 dark:bg-neutral-600 rounded shadow-sm text-sm">
                    <p className={`font-medium ${artifactRarityClass}`}>
                      {art.itemName}
                    </p>
                    {/* API 응답에 아티팩트 옵션 정보가 있다면 추가 (예: art.options) */}
                    {/* <p className="text-xs text-gray-500">옵션: 공격력 증가 +5%</p> */}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">장착된 아티팩트가 없습니다.</p>
        )}
      </div>
    </div>
  );
} 