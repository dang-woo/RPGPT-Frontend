"use client";

import { rarityColorMap } from "@/utils/dnfUtils";

export default function SetItemEffectSection({ setItemInfo }) {
  if (!setItemInfo || setItemInfo.length === 0) {
    return null; // 또는 "적용 중인 세트 아이템 효과가 없습니다." 메시지 반환
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--link-accent-color)' }}>세트 아이템 효과</h2>
      {setItemInfo.map((set, index) => (
        <div key={index} className="mb-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded shadow">
          <h3 className={`text-xl font-semibold ${rarityColorMap[set.setItemRarityName] || 'text-neutral-800 dark:text-neutral-100'}`}>{set.setItemName}</h3>
          {/* 캐릭터정보.txt 에서는 active.explain 사용 */}
          {set.active?.explain && <p className="text-sm whitespace-pre-line text-neutral-600 dark:text-neutral-300 mt-1">{set.active.explain}</p>}
          
          {/* 캐릭터정보.txt 에서는 active.buffExplain 사용 (버프 직업군용) */}
          {set.active?.buffExplain && <p className="text-sm whitespace-pre-line text-amber-600 dark:text-amber-400 mt-1">{set.active.buffExplain}</p>}

          {/* 캐릭터정보.txt 에서는 active.status 사용 */}
          {set.active?.status && set.active.status.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">세트 효과 스탯:</p>
              <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400">
                {set.active.status.map((stat, i) => <li key={i}>{stat.name}: {stat.value}</li>)}
              </ul>
            </div>
          )}

          {/* 캐릭터정보.txt 에서는 active.setPoint 정보도 있음 (필요시 표시) */}
          {set.active?.setPoint && (
             <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                세트 포인트: {set.active.setPoint.current} / {set.active.setPoint.min} (최소) {set.active.setPoint.max ? `- ${set.active.setPoint.max} (최대)` : ''}
             </div>
          )}
        </div>
      ))}
    </div>
  );
} 