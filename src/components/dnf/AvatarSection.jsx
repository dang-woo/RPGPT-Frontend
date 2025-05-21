"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function AvatarSection({ avatar }) {
  if (!avatar || avatar.length === 0) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">아바타</h2>
        <p className="text-neutral-500 dark:text-neutral-400">장착된 아바타가 없습니다.</p>
      </div>
    );
  }

  // 아바타 부위 순서 (원하는 순서대로 정렬하기 위함)
  const slotOrder = [
    "머리", "모자", "얼굴", "목가슴", "상의", "하의", "허리", "신발", "피부", "오라", "무기"
  ];

  const normalizeSlotName = (slotNameWithSuffix) => {
    if (!slotNameWithSuffix) return "알 수 없음";
    // " 아바타", " 스킨 아바타" 등을 제거하여 기본 부위 이름만 추출
    return slotNameWithSuffix.replace(/\s+(아바타|스킨 아바타)$/, "");
  };

  // API 응답의 slotName을 기준으로 정렬
  const sortedAvatar = [...avatar].sort((a, b) => {
    // API 응답에서 slotName을 사용 (예: "모자 아바타", "스킨 아바타")
    const nameA = normalizeSlotName(a.slotName);
    const nameB = normalizeSlotName(b.slotName);
    const orderA = slotOrder.indexOf(nameA);
    const orderB = slotOrder.indexOf(nameB);

    if (orderA === -1 && orderB === -1) return 0; 
    if (orderA === -1) return 1; 
    if (orderB === -1) return -1; 
    return orderA - orderB;
  });

  const fallbackImageUrlOnError = "https://via.placeholder.com/40x40.png?text=No+Img";

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-6 text-[var(--link-accent-color)]">아바타 정보</h2>
      <ul className="space-y-3">
        {sortedAvatar.map((item, index) => {
          const displaySlotName = item.slotName || "알 수 없음";
          const displayItemName = item.clone?.itemName || item.itemName || "정보 없음";
          const itemRarityClass = rarityColorMap[item.itemRarity] || 'text-neutral-800 dark:text-neutral-100';
          // API 응답에서 itemImage는 각 아바타 객체에 직접 포함되어 있지 않고, 필요시 itemId로 구성해야 함.
          // dd.txt 에는 itemImage 필드가 없으므로, 이미지는 표시하지 않거나 itemId 기반 URL 구성 필요.
          // 여기서는 이미지를 표시하지 않는 것으로 유지. 필요하면 Image 컴포넌트 다시 추가.

          return (
            <li key={`${item.slotId}-${index}`} className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-600">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-base">{displaySlotName}</span>
                {item.optionAbility && <span className="text-xs text-sky-500 dark:text-sky-400">옵션: {item.optionAbility}</span>}
              </div>
              <p className={`text-md font-medium ${itemRarityClass} mb-2`}>
                {displayItemName}
              </p>
              
              {item.emblems && item.emblems.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-600">
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">엠블렘:</p>
                  <ul className="space-y-1">
                    {item.emblems.map((emblem, idx) => (
                      <li key={`${emblem.slotNo}-${idx}`} className="text-xs flex justify-between items-center">
                        <span className={`${rarityColorMap[emblem.itemRarity] || 'text-neutral-700 dark:text-neutral-200'}`}>
                          {/* API 응답에서 emblem.slotNo로 엠블렘 슬롯 번호 표시 가능 */}
                          {emblem.slotNo && <span className="mr-1.5 text-neutral-500 dark:text-neutral-400">[{emblem.slotNo}]</span>}
                          {emblem.itemName || "엠블렘 정보 없음"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
} 