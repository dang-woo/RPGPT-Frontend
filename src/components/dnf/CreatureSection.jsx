"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function CreatureSection({ creature }) {
  if (!creature || !creature.itemName) {
    return (
      <div className="section-box">
        <h2 className="section-content-title text-2xl font-bold mb-4">크리쳐 정보</h2>
        <p className="item-entry-text-secondary">장착된 크리쳐가 없습니다.</p>
      </div>
    );
  }

  const fallbackImageUrlOnError = "https://via.placeholder.com/60x60.png?text=No+Img";
  const itemNameClass = rarityColorMap[creature.itemRarity] || 'item-name-default';

  return (
    <div className="section-box">
      <h2 className="section-content-title text-2xl font-bold mb-6">크리쳐 정보</h2>
      <div className="item-entry p-4 flex flex-col sm:flex-row items-center gap-4">
        {creature.itemImage && (
          <div className="relative w-20 h-20 item-image-placeholder rounded-md flex-shrink-0">
            <Image 
              // ... existing image props ...
            />
          </div>
        )}
        <div className="flex-grow text-center sm:text-left">
          <h3 className={`text-xl font-semibold mb-1 ${itemNameClass}`}>{creature.itemName}</h3>
          {creature.itemStatus && creature.itemStatus.length > 0 && (
            <div className="mt-2 pt-2 item-entry-divider-top">
              <p className="text-sm font-medium item-entry-text-label mb-1">크리쳐 스탯:</p>
              <ul className="list-disc list-inside text-xs item-entry-text-secondary space-y-0.5 pl-2">
                {creature.itemStatus.map((stat, i) => <li key={stat.name || `creature-stat-${i}`}>{stat.name}: {stat.value}</li>)}
              </ul>
            </div>
          )}
          {/* 아티팩트 정보 (존재한다면) */}
          {creature.artifact && creature.artifact.length > 0 && (
            <div className="mt-3 pt-3 item-entry-divider-top">
              <h4 className="text-md font-semibold item-entry-text-label mb-1.5">아티팩트:</h4>
              <ul className="space-y-2">
                {creature.artifact.map((art, idx) => (
                  <li key={art.itemName || `artifact-${idx}`} className={`text-xs item-entry-text-primary p-2 rounded item-entry-bg-nested ${rarityColorMap[art.itemRarity] || 'item-name-default'}`}>
                    {art.itemName} ( {art.itemAbility} )
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 