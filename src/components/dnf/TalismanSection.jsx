"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function TalismanSection({ talismans }) {
  if (!talismans || talismans.length === 0) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">탈리스만</h2>
        <p className="text-neutral-500 dark:text-neutral-400">장착된 탈리스만이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-6 text-[var(--link-accent-color)]">탈리스만 & 룬</h2>
      <ul className="space-y-5">
        {talismans.map((talismanEntry, index) => {
          const mainTalisman = talismanEntry.talisman;
          const runes = talismanEntry.runes;

          if (!mainTalisman || !mainTalisman.itemName) return null; 

          // dd.txt의 talisman 객체에는 itemRarity 필드가 없음. runeTypes 배열은 존재.
          // 탈리스만 자체의 등급 표시가 필요하다면 API 응답 확인 필요.
          // 여기서는 임의로 기본 색상을 사용하거나, runeTypes 유무로 스타일을 다르게 할 수 있음.
          const talismanNameClass = mainTalisman.runeTypes ? 'text-sky-600 dark:text-sky-400' : 'text-neutral-800 dark:text-neutral-100';

          return (
            <li key={`talisman-${index}-${mainTalisman.itemName}`} className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-600">
              <div className="mb-3 pb-3 border-b border-neutral-200 dark:border-neutral-600">
                <h3 className={`text-lg font-semibold ${talismanNameClass}`}>
                  {mainTalisman.itemName}
                </h3>
                {mainTalisman.runeTypes && mainTalisman.runeTypes.length > 0 && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    룬 슬롯 타입: {mainTalisman.runeTypes.join(', ')}
                  </p>
                )}
              </div>
              
              {runes && runes.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">장착 룬:</p>
                  <ul className="space-y-1.5">
                    {runes.map((rune, runeIndex) => {
                      // dd.txt의 rune 객체에는 itemRarity 필드가 없음.
                      // 룬 등급별 색상 적용을 위해서는 API 응답에 해당 필드 필요.
                      const runeNameClass = 'text-neutral-700 dark:text-neutral-200'; // 임시 기본 색상
                      return (
                        <li key={`rune-${runeIndex}-${rune.itemName}`} className="p-2 bg-neutral-100 dark:bg-neutral-600 rounded text-sm">
                          <span className={`font-medium ${runeNameClass}`}>
                            {/* API 응답에서 rune.slotNo로 룬 슬롯 번호 표시 가능 */}
                            {rune.slotNo && <span className="mr-1.5 text-neutral-500 dark:text-neutral-400">[{rune.slotNo}]</span>}
                            {rune.itemName}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">장착된 룬이 없습니다.</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
} 