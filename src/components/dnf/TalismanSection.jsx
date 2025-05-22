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
                    <div className="relative w-10 h-10 item-image-placeholder rounded-md flex-shrink-0">
                      <Image 
                        src={talisman.talisman.itemImage || fallbackImageUrl}
                        alt={talisman.talisman.itemName || '탈리스만 이미지'}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                        onError={(e) => { e.currentTarget.src = fallbackImageUrl; }}
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className={`text-base font-semibold truncate ${talismanNameClass}`} title={talisman.talisman.itemName}>
                      {talisman.talisman.itemName}
                    </h3>
                    <p className="text-xs item-entry-text-secondary">슬롯 {talisman.talisman.slotNo || talisman.slotNo}</p>
                  </div>
                </div>
              )}

              {talisman.runes && talisman.runes.length > 0 && (
                <div className="mt-2 pt-2 item-entry-divider-top">
                  <p className="text-sm font-medium item-entry-text-label mb-1">룬 정보:</p>
                  <ul className="space-y-1">
                    {talisman.runes.map((rune, runeIndex) => {
                      const runeItemId = rune.itemId;
                      let runeImage = "https://via.placeholder.com/32x32.png?text=RuneX";
                      if (rune.itemImage && typeof rune.itemImage === 'string' && rune.itemImage.startsWith('http')) {
                        runeImage = rune.itemImage;
                      } else if (runeItemId) {
                        runeImage = `https://img-api.neople.co.kr/df/items/${runeItemId}`;
                      }
                      const runeFallbackImageUrl = "https://via.placeholder.com/32x32.png?text=RuneErr";
                      
                      // 디버깅용 로그 주석 처리
                      // console.log(`[TalismanSection] Rune: ${rune.itemName}, ItemId: ${runeItemId}, Original itemImage: ${rune.itemImage}, Final ImageURL: ${runeImage}`);

                      return (
                        <li key={rune.itemId || `rune-${runeIndex}`} className={`text-xs item-entry-text-primary p-1.5 rounded item-entry-bg-nested ${rarityColorMap[rune.itemRarity] || 'item-name-default'} flex items-center gap-1.5`}>
                          {/* 이미지 표시 로직 전체 주석 처리 시작
                          {runeImage && (
                            <div className="relative w-5 h-5 flex-shrink-0 item-image-placeholder">
                              <Image 
                                src={runeImage}
                                alt={rune.itemName || '룬 이미지'}
                                fill
                                sizes="32px"
                                className="object-contain p-0.5"
                                onError={(e) => { 
                                  // console.error(`[TalismanSection] Error loading rune image for ${rune.itemName} (URL: ${runeImage}). Falling back to ${runeFallbackImageUrl}. Original error:`, e);
                                  e.currentTarget.src = runeFallbackImageUrl; 
                                }}
                              />
                            </div>
                          )}
                          이미지 표시 로직 전체 주석 처리 끝 */}
                          <span>{rune.itemName}</span>
                        </li>
                      );
                    })}
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