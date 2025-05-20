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
          {/* API 응답에서 set.active.explain 대신 set.explain으로 변경된 것을 가정 (캐릭터정보.txt 참조) */}
          {/* 또한, 캐릭터정보.txt 에서는 optionInfo.explain 으로 되어있어, API 응답 구조를 다시 한번 확인 필요 */}
          {/* 우선은 기존 코드의 set.active.explain 구조를 따르되, 추후 API 응답에 맞춰 수정 */}
          {set.active?.explain && <p className="text-sm whitespace-pre-line text-neutral-600 dark:text-neutral-300 mt-1">{set.active.explain}</p>}
          
          {/* 캐릭터정보.txt 에서는 optionInfo.status 로 되어있음. */}
          {/* 여기서는 기존 코드의 set.active.status 구조를 따름 */}
          {set.active?.status && set.active.status.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">세트 효과:</p>
              <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400">
                {set.active.status.map((stat, i) => <li key={i}>{stat.name}: {stat.value}</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 