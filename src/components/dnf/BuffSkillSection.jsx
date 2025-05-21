"use client";

import React from 'react';
import { rarityColorMap } from "@/utils/dnfUtils"; // 스타일링 위해 추가

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
      <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">버프 강화 정보</h2>
        <p className="text-neutral-500 dark:text-neutral-400">버프 강화 정보가 없습니다.</p>
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
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-6 text-[var(--link-accent-color)]">버프 강화 정보</h2>

      {/* 기본 버프 스킬 정보 */} 
      <div className="mb-6 p-4 bg-sky-50 dark:bg-sky-900/30 rounded-lg border border-sky-200 dark:border-sky-700">
        <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-2">{skillInfo.name || "스킬 이름 없음"}</h3>
        {skillInfo.option?.level && <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">적용 스킬 레벨: {skillInfo.option.level}</p>}
        {skillDesc && <p className="text-sm whitespace-pre-line text-neutral-700 dark:text-neutral-200">{skillDesc}</p>}
      </div>

      {/* 장착 장비 */} 
      {equipment && equipment.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3">관련 장비</h4>
          <ul className="space-y-3">
            {equipment.map((item, index) => <BuffItemDisplay key={`equip-${index}`} item={item} type="equipment" />)}
          </ul>
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