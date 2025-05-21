"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function FlagSection({ flag }) {
  if (!flag || !flag.itemName) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">휘장</h2>
        <p className="text-neutral-500 dark:text-neutral-400">장착된 휘장이 없습니다.</p>
      </div>
    );
  }

  const flagRarityClass = rarityColorMap[flag.itemRarity] || 'text-neutral-800 dark:text-neutral-100';

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">휘장 정보</h2>
      <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-600">
        <div className="mb-3">
          <h3 className={`text-xl font-semibold ${flagRarityClass}`}>
            {flag.itemName}
          </h3>
          {flag.reinforce > 0 && <p className="text-sm text-orange-500 dark:text-orange-400">강화: +{flag.reinforce}</p>}
          {flag.reinforceStatus && flag.reinforceStatus.length > 0 && (
            <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
              <p className="font-medium">강화 효과:</p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                {flag.reinforceStatus.map((status, idx) => (
                  <li key={idx}>{status.name}: {status.value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {flag.gems && flag.gems.length > 0 ? (
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600">
            <h4 className="text-lg font-semibold mb-3 text-neutral-700 dark:text-neutral-200">장착 젬</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {flag.gems.map((gem, index) => {
                const gemRarityClass = rarityColorMap[gem.itemRarity] || 'text-neutral-700 dark:text-neutral-300';
                return (
                  <li key={index} className="p-2.5 bg-neutral-100 dark:bg-neutral-600 rounded shadow-sm text-sm">
                    <p className={`font-medium ${gemRarityClass}`}>
                      {gem.itemName}
                    </p>
                    {/* API 응답에 젬 슬롯 번호나 옵션이 있다면 여기에 추가 */}
                    {/* 예: gem.slotNo ? `${gem.slotNo}번 슬롯: ` : '' */} 
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">장착된 젬이 없습니다.</p>
        )}
      </div>
    </div>
  );
} 