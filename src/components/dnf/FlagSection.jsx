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

  const fallbackImageUrlOnError = "https://via.placeholder.com/60x60.png?text=No+Img";
  const flagNameClass = rarityColorMap[flag.itemRarity] || 'item-name-default';

  return (
    <div className="section-box">
      <h2 className="section-content-title text-2xl font-bold mb-6">휘장 정보</h2>
      <div className="item-entry p-4 flex flex-col sm:flex-row items-center gap-4">
        {flag.itemImage && (
          <div className="relative w-20 h-20 item-image-placeholder rounded-md flex-shrink-0">
            <Image 
              // ... existing image props ...
            />
          </div>
        )}
        <div className="flex-grow text-center sm:text-left">
          <h3 className={`text-xl font-semibold mb-1 ${flagNameClass}`}>{flag.itemName}</h3>
          {flag.reinforceSkill && flag.reinforceSkill.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium item-entry-text-label">강화 스킬:</p>
              {flag.reinforceSkill.map((skill, index) => (
                <p key={index} className="text-xs item-entry-text-primary">
                  {skill.name} +{skill.value}
                </p>
              ))}
            </div>
          )}
          {flag.itemStatus && flag.itemStatus.length > 0 && (
            <div className="mt-2 pt-2 item-entry-divider-top">
              <p className="text-sm font-medium item-entry-text-label mb-1">휘장 스탯:</p>
              <ul className="list-disc list-inside text-xs item-entry-text-secondary space-y-0.5 pl-2">
                {flag.itemStatus.map((stat, i) => <li key={`flag-stat-${i}`}>{stat.name}: {stat.value}</li>)}
              </ul>
            </div>
          )}
          {/* 젬 정보 (존재한다면) */}
          {flag.gems && flag.gems.length > 0 && (
            <div className="mt-3 pt-3 item-entry-divider-top">
              <h4 className="text-md font-semibold item-entry-text-label mb-1.5">젬:</h4>
              <ul className="space-y-2">
                {flag.gems.map((gem, idx) => (
                  <li key={idx} className={`text-xs item-entry-text-primary p-2 rounded item-entry-bg-nested ${rarityColorMap[gem.itemRarity] || 'item-name-default'}`}>
                    {gem.itemName} (슬롯 {gem.slotNo}) - {gem.itemAbility || '능력치 정보 없음'}
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