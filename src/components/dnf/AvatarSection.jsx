"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function AvatarSection({ avatar }) {
  if (!avatar || avatar.length === 0) {
    return null; // 또는 "장착된 아바타가 없습니다." 메시지 반환
  }

  // 아바타 부위 순서 (원하는 순서대로 정렬하기 위함)
  const slotOrder = [
    "머리", "모자", "얼굴", "목가슴", "상의", "하의", "허리", "신발", "피부"
  ];

  // API 응답의 slotName을 기준으로 정렬
  const sortedAvatar = [...avatar].sort((a, b) => {
    const orderA = slotOrder.indexOf(a.slotName);
    const orderB = slotOrder.indexOf(b.slotName);
    if (orderA === -1) return 1; // 알 수 없는 부위는 뒤로
    if (orderB === -1) return -1;
    return orderA - orderB;
  });

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--link-accent-color)' }}>아바타</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAvatar.map((item, index) => (
          <div key={index} className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded shadow flex flex-col">
            <div className="flex items-center mb-2">
              {item.itemImage && (
                <div className="relative w-10 h-10 mr-2 flex-shrink-0">
                    <Image
                      src={item.itemImage} 
                      alt={item.itemName || '아바타 이미지'}
                      width={40}
                      height={40}
                      className="rounded object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} // 이미지 로드 실패 시 숨김
                    />
                </div>
              )}
              <div>
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">{item.slotName}</p>
                <p className={`text-sm font-medium ${rarityColorMap[item.itemRarity] || 'text-neutral-800 dark:text-neutral-100'}`}>
                  {item.itemName || "-"}
                </p>
                {item.optionAbility && <p className="text-xs text-sky-500">옵션: {item.optionAbility}</p>}
              </div>
            </div>
            {item.emblems && item.emblems.length > 0 && (
              <div className="mt-1 pt-1 border-t border-neutral-200 dark:border-neutral-600">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">엠블렘:</p>
                <ul className="space-y-0.5">
                  {item.emblems.map((emblem, idx) => (
                    <li key={idx} className="text-xs">
                      <span className={`font-medium ${rarityColorMap[emblem.itemRarity] || 'text-neutral-700 dark:text-neutral-200'}`}>
                        {emblem.itemName}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 