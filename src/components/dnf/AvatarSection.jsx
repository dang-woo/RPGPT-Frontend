"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function AvatarSection({ avatar }) {
  if (!avatar || avatar.length === 0) {
    return (
      <div className="section-box">
        <h2 className="section-content-title text-2xl font-bold mb-4">아바타 정보</h2>
        <p className="item-entry-text-secondary">표시할 아바타 정보가 없습니다.</p>
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

  const fallbackImageUrlOnError = "https://cdn-store.leagueoflegends.co.kr/images/v2/emotes/1516.png";

  return (
    <div className="section-box">
      <h2 className="section-content-title text-2xl font-bold mb-6">아바타 정보</h2>
      <ul className="space-y-4">
        {sortedAvatar.map((item, index) => {
          const itemNameClass = rarityColorMap[item.itemRarity] || 'item-name-default';
          const emblemCount = item.emblems ? item.emblems.length : 0;

          return (
            <li key={item.slotId || `avatar-item-${index}`} className="item-entry flex items-start gap-4 p-3">
              <div className="relative w-16 h-16 item-image-placeholder rounded-md flex-shrink-0">
                <Image
                  src={item.itemImage || fallbackImageUrlOnError}
                  alt={item.itemName || '아바타 이미지'}
                  fill
                  className="object-contain"
                  sizes="64px"
                  onError={(e) => {
                    if (e.target.src !== fallbackImageUrlOnError) {
                      e.target.srcset = fallbackImageUrlOnError;
                      e.target.src = fallbackImageUrlOnError;
                    }
                  }}
                />
              </div>
              <div className="flex-grow">
                <p className="text-base font-semibold item-entry-text-label mb-0.5">{item.slotName}</p>
                <p className={`text-sm ${itemNameClass} truncate`} title={item.itemName}>{item.itemName}</p>
                {item.optionAbility && <p className="text-xs item-entry-text-secondary mt-0.5 truncate" title={item.optionAbility}>옵션: {item.optionAbility}</p>}
                {emblemCount > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t item-entry-divider-top">
                    <p className="text-xs font-medium item-entry-text-label mb-0.5">엠블렘 ({emblemCount}개):</p>
                    <ul className="space-y-0.5">
                      {item.emblems.map((emblem, emblemIndex) => (
                        <li key={`${emblem.itemName}-${emblemIndex}`} className={`text-xs truncate ${rarityColorMap[emblem.itemRarity] || 'item-name-default'}`} title={`${emblem.itemName} (${emblem.itemAbility})`}>
                          {emblem.itemName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 