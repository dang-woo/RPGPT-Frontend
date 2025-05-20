"use client";

import React from 'react';
import { rarityColorMap } from "@/utils/dnfUtils"; // 스타일링 위해 추가

// 개별 아이템을 표시하기 위한 작은 컴포넌트
const BuffItemCard = ({ item, type }) => {
  if (!item) return null;
  let itemName = item.itemName;
  if (type === 'avatar' && item.clone?.itemName) {
    itemName = item.clone.itemName;
  }

  return (
    <div className="p-2 bg-neutral-100 dark:bg-neutral-600 rounded shadow-sm text-xs">
      <p className={`font-medium ${rarityColorMap[item.itemRarity] || 'text-neutral-700 dark:text-neutral-200'}`}>
        {itemName || '정보 없음'}
      </p>
      {type === 'avatar' && item.optionAbility && (
        <p className="text-sky-500">옵션: {item.optionAbility}</p>
      )}
      {/* 필요시 다른 정보 추가 (예: 엠블렘) */}
    </div>
  );
};

export default function BuffSkillSection({ buffSkillInfo }) {
  if (!buffSkillInfo || !buffSkillInfo.skillInfo) {
    return null;
  }

  const { skillInfo, equipment, avatar, creature } = buffSkillInfo;

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--link-accent-color)' }}>버프 강화 정보</h2>

      {/* 주요 버프 스킬 정보 */}
      <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md">
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">{skillInfo.name || '버프 스킬'}</h3>
        {skillInfo.option && (
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            <p className="mb-1"><span className="font-semibold">레벨:</span> {skillInfo.option.level}</p>
            {skillInfo.option.desc && (
              <p className="whitespace-pre-line">
                <span className="font-semibold">설명:</span> 
                {/* API 응답의 desc 필드에서 {valueX} 부분을 실제 값으로 치환하여 표시 */}
                {skillInfo.option.desc.replace(/\{value(\d+)\}/g, (match, index) => {
                  const valueIndex = parseInt(index, 10) - 1;
                  return skillInfo.option.values?.[valueIndex] || match;
                })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 버프 관련 장비 */}
      {equipment && equipment.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2 text-neutral-700 dark:text-neutral-200">관련 장비:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {equipment.map((item, index) => (
              <BuffItemCard key={`buff-equip-${index}`} item={item} type="equipment" />
            ))}
          </div>
        </div>
      )}

      {/* 버프 관련 아바타 */}
      {avatar && avatar.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2 text-neutral-700 dark:text-neutral-200">관련 아바타:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {avatar.map((item, index) => (
              <BuffItemCard key={`buff-avatar-${index}`} item={item} type="avatar" />
            ))}
          </div>
        </div>
      )}

      {/* 버프 관련 크리쳐 */}
      {creature && creature.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2 text-neutral-700 dark:text-neutral-200">관련 크리쳐:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {creature.map((item, index) => (
              <BuffItemCard key={`buff-creature-${index}`} item={item} type="creature" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 