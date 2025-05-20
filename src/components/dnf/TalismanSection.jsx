"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function TalismanSection({ talismans }) {
  if (!talismans || talismans.length === 0) {
    return null; // 또는 "장착된 탈리스만이 없습니다." 메시지 반환
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--link-accent-color)' }}>탈리스만</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {talismans.map((talisman, index) => (
          <div key={index} className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded shadow">
            <div className="flex items-center mb-3">
              {talisman.talisman?.itemImage && (
                <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                  <Image
                    src={talisman.talisman.itemImage}
                    alt={talisman.talisman.itemName || '탈리스만 이미지'}
                    width={48}
                    height={48}
                    className="rounded object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              )}
              <div>
                <p className={`text-lg font-semibold ${rarityColorMap[talisman.talisman?.itemRarity] || 'text-neutral-800 dark:text-neutral-100'}`}>
                  {talisman.talisman?.itemName || "탈리스만 정보 없음"}
                </p>
                {/* 탈리스만 스킬 설명 등 추가 정보가 있다면 여기에 표시 */}
              </div>
            </div>
            
            {talisman.runes && talisman.runes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">장착 룬:</p>
                <div className="grid grid-cols-3 gap-2">
                  {talisman.runes.map((rune, runeIndex) => (
                    <div key={runeIndex} className="p-2 bg-neutral-100 dark:bg-neutral-600 rounded text-center flex flex-col items-center">
                      {rune.itemImage && (
                         <div className="relative w-8 h-8 mb-1">
                            <Image 
                                src={rune.itemImage}
                                alt={rune.itemName || '룬 이미지'}
                                width={32}
                                height={32}
                                className="rounded object-contain"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                         </div>
                      )}
                      <p className={`text-xs font-medium ${rarityColorMap[rune.itemRarity] || 'text-neutral-700 dark:text-neutral-200'}`}>
                        {rune.itemName || "룬 정보 없음"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 