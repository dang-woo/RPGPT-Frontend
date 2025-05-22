"use client";

import React from 'react';
import { rarityColorMap } from "@/utils/dnfUtils"; // 스타일링 위해 추가
import Image from 'next/image';

// 각 장비/아바타/크리쳐 아이템을 표시하는 작은 컴포넌트
const BuffItemDisplay = ({ item, type }) => {
  if (!item || !item.itemName) return null;

  const itemRarityClass = rarityColorMap[item.itemRarity] || 'text-neutral-700 dark:text-neutral-200';
  let detailText = item.itemTypeDetail ? `(${item.itemTypeDetail})` : '';
  if (type === "avatar" && item.optionAbility) {
    detailText = item.optionAbility;
  }

  return (
    <li className="p-2.5 bg-neutral-100 dark:bg-neutral-600 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-500">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${itemRarityClass}`}>{item.itemName}</span>
        {item.slotName && type !== "creature" && <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.slotName}</span>}
      </div>
      {detailText && <p className="text-xs text-sky-600 dark:text-sky-400 mt-0.5">{detailText}</p>}
      {type === "avatar" && item.emblems && item.emblems.length > 0 && (
        <div className="mt-1.5 pt-1.5 border-t border-neutral-200 dark:border-neutral-500">
          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">엠블렘:</p>
          <ul className="space-y-0.5">
            {item.emblems.map((emblem, idx) => (
              <li key={idx} className={`text-xs ${rarityColorMap[emblem.itemRarity] || 'text-neutral-700 dark:text-neutral-200'}`}>
                {emblem.itemName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default function BuffSkillSection({ buffSkillInfo }) {
  if (!buffSkillInfo || !buffSkillInfo.skillInfo) {
    return (
      <div className="section-box">
        <h2 className="section-content-title text-2xl font-bold mb-4">버프 강화 정보</h2>
        <p className="item-entry-text-secondary">표시할 버프 강화 정보가 없습니다.</p>
      </div>
    );
  }

  const { skillInfo, equipment, avatar, creature } = buffSkillInfo;

  // skillInfo.option.desc의 플레이스홀더를 실제 값으로 대체
  let skillDesc = skillInfo.option?.desc || "";
  if (skillInfo.option?.values) {
    skillInfo.option.values.forEach((value, i) => {
      skillDesc = skillDesc.replace(`{value${i + 1}}`, value);
    });
  }

  return (
    <div className="section-box">
      <h2 className="section-content-title text-2xl font-bold mb-6">버프 강화 정보</h2>

      {skillInfo && (
        <div className="mb-6 item-entry p-4">
          <h3 className="text-lg font-semibold item-entry-text-primary mb-2">버프 스킬: {skillInfo.name || '이름 없음'}</h3>
          <p className="text-sm item-entry-text-secondary">스킬 레벨: {skillInfo.level || '-'}</p>
          {skillInfo.option && skillInfo.option.desc && (
            <p className="text-sm item-entry-text-secondary mt-1">
              효과: {skillInfo.option.desc} (값: {skillInfo.option.value})
            </p>
          )}
          {/* skillInfo.option.values 같은 배열 데이터가 있다면 추가적으로 표시 가능 */}
        </div>
      )}

      {equipment && equipment.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold item-entry-text-label mb-3">버프 장비:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {equipment.map((item) => {
              const itemNameClass = rarityColorMap[item.itemRarity] || 'item-name-default';
              return (
                <div key={item.itemId || item.itemName} className="item-entry p-3">
                  <div className="flex items-center gap-3">
                    {item.itemImage && (
                      <div className="relative w-10 h-10 item-image-placeholder rounded">
                        <Image 
                          src={item.itemImage}
                          alt={item.itemName || '장비 아이콘'}
                          fill
                          className="object-contain"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/32x32.png?text=X'; }}
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className={`text-sm font-medium truncate ${itemNameClass}`} title={item.itemName}>{item.itemName}</p>
                      <p className="text-xs item-entry-text-secondary">{item.slotName || '슬롯 정보 없음'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 아바타 정보 */} 
      {avatar && avatar.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3">관련 아바타</h4>
          <ul className="space-y-3">
            {avatar.map((item, index) => <BuffItemDisplay key={`avatar-${index}`} item={item} type="avatar" />)}
          </ul>
        </div>
      )}

      {/* 크리쳐 정보 */} 
      {creature && creature.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3">관련 크리쳐</h4>
          <ul className="space-y-3">
            {creature.map((item, index) => <BuffItemDisplay key={`creature-${index}`} item={item} type="creature" />)}
          </ul>
        </div>
      )}
    </div>
  );
} 