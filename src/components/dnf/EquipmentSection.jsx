"use client";

import { rarityColorMap, RenderReinforceAmp } from "@/utils/dnfUtils";

export default function EquipmentSection({ equipment }) {
  if (!equipment || equipment.length === 0) {
    return null; // 또는 "장착된 장비가 없습니다." 같은 메시지 반환
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--link-accent-color)' }}>장착 장비</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((item, index) => (
          <div key={index} className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded shadow">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">{item.slotName}</p>
            <p className={`text-lg font-medium ${rarityColorMap[item.itemRarity] || 'text-neutral-800 dark:text-neutral-100'}`}>
              {item.itemName}
              <RenderReinforceAmp item={item} />
            </p>
            {item.setItemName && <p className="text-xs text-blue-400">세트: {item.setItemName}</p>}
            {item.enchant && item.enchant.status && item.enchant.status.length > 0 && (
              <div className="mt-1 text-xs text-green-400">
                마법부여: {item.enchant.status.map(s => `${s.name} ${s.value}`).join(', ')}
              </div>
            )}
            {/* 융합 옵션 표시 (API 응답에 fusionInfo 같은 필드가 있다고 가정) */}
            {item.fusionInfo && (
              <div className="mt-1 text-xs text-yellow-500">
                융합: {item.fusionInfo.itemName} {item.fusionInfo.options?.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 