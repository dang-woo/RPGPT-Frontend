"use client";

import React from 'react';

const SkillItem = ({ skill }) => (
  <li className="py-1 px-2 bg-neutral-100 dark:bg-neutral-700 rounded text-sm">
    <span className="font-medium text-neutral-700 dark:text-neutral-200">{skill.name}</span>
    {skill.requiredLevel && <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">(Lv.{skill.requiredLevel})</span>}
  </li>
);

export default function SkillSection({ skillStyle }) {
  if (!skillStyle || (!skillStyle.active?.length && !skillStyle.passive?.length)) {
    return null;
  }

  const { active, passive } = skillStyle;

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--link-accent-color)' }}>스킬 정보</h2>
      
      {active && active.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-100">액티브 스킬</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {active.map((skill, index) => <SkillItem key={`active-${index}-${skill.name}`} skill={skill} />)}
          </ul>
        </div>
      )}

      {passive && passive.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-100">패시브 스킬</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {passive.map((skill, index) => <SkillItem key={`passive-${index}-${skill.name}`} skill={skill} />)}
          </ul>
        </div>
      )}
    </div>
  );
} 