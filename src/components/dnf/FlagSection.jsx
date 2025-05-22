"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function FlagSection({ flag }) {
  if (!flag || !flag.itemName) {
    return (
      <div className="section-box">
        <h2 className="section-content-title text-2xl font-bold mb-4">휘장 정보</h2>
        <p className="item-entry-text-secondary">장착된 휘장이 없습니다.</p>
      </div>
    );
  }

  const flagNameClass = rarityColorMap[flag.itemRarity] || 'item-name-default';
  // 휘장 아이템 이미지 URL 동적 생성 (itemId 사용)
  const flagImageUrl = flag.itemId ? `https://img-api.neople.co.kr/df/items/${flag.itemId}` : flag.itemImage || "https://via.placeholder.com/80x80.png?text=No+Img";
  const fallbackImageUrl = "https://via.placeholder.com/80x80.png?text=No+Img";

  return (
    <div className="section-box">
      <h2 className="section-content-title text-2xl font-bold mb-6">휘장 정보</h2>
      <div className="item-entry p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-20 h-20 item-image-placeholder rounded-md flex-shrink-0">
          <Image 
            src={flagImageUrl}
            alt={flag.itemName || '휘장 이미지'}
            fill
            sizes="128px"
            className="object-contain p-1"
            onError={(e) => { e.target.src = fallbackImageUrl; }}
          />
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h3 className={`text-xl font-semibold mb-1 ${flagNameClass}`}>{flag.itemName}</h3>
          {flag.reinforce && <p className="text-sm item-entry-text-secondary">강화: +{flag.reinforce}</p>}
          {flag.reinforceStatus && flag.reinforceStatus.length > 0 && (
            <div className="text-xs item-entry-text-secondary mb-1">
              {flag.reinforceStatus.map(s => `${s.name} ${s.value}`).join(', ')}
            </div>
          )}
          {flag.itemAbility && <p className="text-sm item-entry-text-secondary mb-1">기본 능력치: {flag.itemAbility}</p>}
          {/* 젬 정보 (존재한다면) */}
          {flag.gems && flag.gems.length > 0 && (
            <div className="mt-3 pt-3 item-entry-divider-top">
              <h4 className="text-md font-semibold item-entry-text-label mb-1.5">젬:</h4>
              <ul className="grid grid-cols-2 gap-2">
                {flag.gems.map((gem, idx) => {
                  const gemImageUrl = gem.itemImage || "https://via.placeholder.com/24x24.png?text=X";
                  const gemFallbackUrl = "https://via.placeholder.com/24x24.png?text=X";
                  return (
                    <li key={gem.itemId || `gem-${idx}`} 
                        className={`text-xs item-entry-text-primary p-2 rounded item-entry-bg-nested ${rarityColorMap[gem.itemRarity] || 'item-name-default'} flex items-center gap-2`}>
                      <div className="relative w-6 h-6 flex-shrink-0 item-image-placeholder">
                        <Image 
                          src={gemImageUrl}
                          alt={gem.itemName || '젬 이미지'}
                          fill
                          sizes="40px"
                          className="object-contain p-0.5"
                          onError={(e) => { e.target.src = gemFallbackUrl; }}
                        />
                      </div>
                      <div className="flex-grow">
                        <span className="font-medium">{gem.itemName}</span>
                        {gem.itemAbility && <p className="text-xs text-sky-600 dark:text-sky-400">{gem.itemAbility}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 