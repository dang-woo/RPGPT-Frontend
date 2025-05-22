"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function TalismanSection({ talismans }) {
  if (!talismans || talismans.length === 0) {
    return (
      <div className="section-box">
        <h2 className="section-content-title text-2xl font-bold mb-4">탈리스만 정보</h2>
        <p className="item-entry-text-secondary">장착된 탈리스만이 없습니다.</p>
      </div>
    );
  }
  const fallbackImageUrlOnError = "https://via.placeholder.com/40x40.png?text=No+Img";

  return (
    <div className="section-box">
      <h2 className="section-content-title text-2xl font-bold mb-6">탈리스만 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talismans.map((talisman, index) => {
          const talismanNameClass = rarityColorMap[talisman.talisman?.itemRarity] || 'item-name-default';

          return (
            <div key={talisman.slotNo || talisman.talisman?.itemId || `talisman-${index}`} className="item-entry p-3">
              {talisman.talisman && (
                <div className="flex items-center gap-3 mb-2">
                  {talisman.talisman.itemImage && (
                     <div className="relative w-12 h-12 item-image-placeholder rounded-md flex-shrink-0">
                        <Image 
                          // ... existing image props ...
                        />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className={`text-base font-semibold truncate ${talismanNameClass}`} title={talisman.talisman.itemName}>
                      {talisman.talisman.itemName}
                    </h3>
                    <p className="text-xs item-entry-text-secondary">슬롯 {talisman.slotNo}</p>
                  </div>
                </div>
              )}

              {talisman.runes && talisman.runes.length > 0 && (
                <div className="mt-2 pt-2 item-entry-divider-top">
                  <p className="text-sm font-medium item-entry-text-label mb-1">룬 정보:</p>
                  <ul className="space-y-1">
                    {talisman.runes.map((rune, index) => (
                      <li key={rune.itemId || rune.itemName || `rune-${index}`} className={`text-xs item-entry-text-primary p-1.5 rounded item-entry-bg-nested ${rarityColorMap[rune.itemRarity] || 'item-name-default'}`}>
                        {rune.itemName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 