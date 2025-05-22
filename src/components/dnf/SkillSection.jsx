"use client";

import React from 'react';

const SkillItem = ({ skill }) => (
  <li className="py-1.5 px-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-md text-sm shadow-sm border border-neutral-200 dark:border-neutral-600">
    <span className="font-medium text-neutral-800 dark:text-neutral-100">{skill.name}</span>
    <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1.5">
      (Lv.{skill.level || '-'})
      {skill.requiredLevel && <span className="ml-1"> / 필요 Lv.{skill.requiredLevel}</span>}
    </span>
  </li>
);

export default function SkillSection({ skillStyle }) {
  if (!skillStyle || !skillStyle.active || skillStyle.active.length === 0) {
    return (
      <div className="section-box">
        <h2 className="section-content-title text-2xl font-bold mb-4">액티브 스킬 정보</h2>
        <p className="item-entry-text-secondary">표시할 스킬 정보가 없습니다.</p>
      </div>
    );
  }

  // 스킬 스타일 정보를 표시하는 부분은 dd.txt에 명확한 구조가 없으므로,
  // 기본 정보(skillId, name, level, requiredLevel)만 표시하거나, 상세 구조가 확인되면 추가 구현합니다.
  // 여기서는 skillStyle.active 배열을 순회하며 정보를 표시하는 것으로 가정합니다.

  return (
    <div className="section-box">
      <h2 className="section-content-title text-2xl font-bold mb-6">액티브 스킬 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillStyle.active.map((skill, index) => (
          <div key={skill.skillId || skill.name || `skill-${index}`} className="item-entry p-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-base font-semibold item-entry-text-primary truncate" title={skill.name}>{skill.name}</h3>
              {skill.requiredLevel !== undefined && <p className="text-xs item-entry-text-secondary">요구레벨: {skill.requiredLevel}</p>}
            </div>
            <p className="text-sm item-entry-text-primary">
              레벨: <span className="font-medium">{skill.level || '-'}</span>
            </p>
            {/* API에 스킬 아이콘 URL이 있다면 Image 컴포넌트로 표시 가능 */}
            {/* {skill.iconUrl && <Image src={skill.iconUrl} alt={skill.name} width={32} height={32} className="mt-1 rounded" />} */}
          </div>
        ))}
      </div>
    </div>
  );
} 