"use client";

import { rarityColorMap } from "@/utils/dnfUtils";

export default function SetItemEffectSection({ setItemInfo }) {
  if (!setItemInfo || setItemInfo.length === 0) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">세트 아이템 효과</h2>
        <p className="text-neutral-500 dark:text-neutral-400">적용 중인 세트 아이템 효과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl mb-6 ">세트 아이템 효과</h2>
      <ul className="space-y-4">
        {setItemInfo.map((set, index) => {
          // dd.txt의 setItemInfo 객체 내에 setItemRarityName 필드가 있으므로 이를 사용.
          const setRarityClass = rarityColorMap[set.setItemRarityName] || 'text-neutral-800 dark:text-neutral-100';
          // itemImage 필드는 setItemInfo에 없으므로 이미지는 표시하지 않음.

          return (
            <li key={`${set.setItemId}-${index}`} className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-600">
              <h3 className={`text-xl font-semibold ${setRarityClass} mb-2`}>{set.setItemName}</h3>
              
              {/* 세트 아이템 개수 및 활성화된 효과 개수 (API 응답에 있다면) */}
              {/* 예: <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">착용: {set.equippedCount} / {set.totalCount} | 활성 효과: {set.activeEffectCount}</p> */}
              
              {set.active?.explain && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-0.5">기본 효과:</p>
                  <p className="text-sm whitespace-pre-line text-neutral-600 dark:text-neutral-400">
                    {set.active.explain.replace(/<br\s*\/?>/gi, '\n')} {/* <br> 태그를 개행 문자로 변경 */}
                  </p>
                </div>
              )}
              
              {set.active?.buffExplain && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-0.5">버프 효과:</p>
                  <p className="text-sm whitespace-pre-line text-amber-600 dark:text-amber-500">
                    {set.active.buffExplain.replace(/<br\s*\/?>/gi, '\n')}
                  </p>
                </div>
              )}

              {set.active?.status && set.active.status.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-600">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">세트 효과 스탯:</p>
                  <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5 pl-2">
                    {set.active.status.map((stat, i) => <li key={`set-stat-${index}-${i}`}>{stat.name}: {stat.value}</li>)}
                  </ul>
                </div>
              )}

              {set.active?.setPoint && (
                 <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-600 text-xs text-neutral-500 dark:text-neutral-400">
                    세트 포인트: {set.active.setPoint.current} / {set.active.setPoint.min}
                    {set.active.setPoint.max && set.active.setPoint.max !== set.active.setPoint.min 
                      ? ` (최소) ~ ${set.active.setPoint.max} (최대)` 
                      : ' (요구)'}
                 </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
} 