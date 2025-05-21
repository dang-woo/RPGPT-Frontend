"use client";

import { rarityColorMap, RenderReinforceAmp } from "@/utils/dnfUtils";
import Image from 'next/image';

export default function EquipmentSection({ equipment }) {
  if (!equipment || equipment.length === 0) {
    return (
      <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold mb-4 text-[var(--link-accent-color)]">장착 장비</h2>
        <p className="text-neutral-500 dark:text-neutral-400">장착된 장비가 없습니다.</p>
      </div>
    );
  }

  // 아이템 슬롯 순서 정의 (원하는 순서대로)
  const slotOrder = [
    "무기", "칭호", "상의", "하의", "머리어깨", "벨트", "신발", 
    "목걸이", "팔찌", "반지", "보조장비", "마법석", "귀걸이"
  ];

  const sortedEquipment = [...equipment].sort((a, b) => {
    const orderA = slotOrder.indexOf(a.slotName);
    const orderB = slotOrder.indexOf(b.slotName);
    if (orderA === -1 && orderB === -1) return 0;
    if (orderA === -1) return 1;
    if (orderB === -1) return -1;
    return orderA - orderB;
  });

  const fallbackImageUrlOnError = "https://via.placeholder.com/40x40.png?text=No+Img";

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-6 text-[var(--link-accent-color)]">장착 장비</h2>
      <ul className="space-y-4">
        {sortedEquipment.map((item, index) => (
          <li key={index} className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-600 flex gap-4">
            {item.itemImage && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-neutral-200 dark:bg-neutral-600 rounded-md overflow-hidden">
                <Image
                  src={item.itemImage || fallbackImageUrlOnError}
                  alt={item.itemName || '아이템 이미지'}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    if (e.target.src !== fallbackImageUrlOnError) {
                      e.target.srcset = fallbackImageUrlOnError;
                      e.target.src = fallbackImageUrlOnError;
                    }
                  }}
                  sizes="(max-width: 640px) 64px, 80px"
                />
              </div>
            )}
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-base sm:text-lg">{item.slotName}</span>
                {item.itemGradeName && <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1">등급: {item.itemGradeName}</span>}
              </div>
              <p className={`text-lg sm:text-xl font-medium ${rarityColorMap[item.itemRarity] || 'text-neutral-800 dark:text-neutral-100'} mb-1.5`}>
                {item.itemName}
                <RenderReinforceAmp item={item} />
              </p>
              <div className="text-xs space-y-1">
                {item.setItemName && <p className="text-blue-500 dark:text-blue-400">세트: {item.setItemName}</p>}
                {item.itemAvailableLevel && item.itemAvailableLevel > 0 && <p className="text-neutral-500 dark:text-neutral-400">레벨제한: {item.itemAvailableLevel}</p>}
                
                {item.enchant && item.enchant.status && item.enchant.status.length > 0 && (
                  <div>
                    <span className="font-medium text-green-600 dark:text-green-400">마법부여: </span>
                    <span className="text-neutral-600 dark:text-neutral-300">
                      {item.enchant.status.map(s => `${s.name} ${s.value}`).join(', ')}
                    </span>
                  </div>
                )}

                {item.fusionOption && item.fusionOption.options && item.fusionOption.options.length > 0 && (
                  <div>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">융합 옵션: </span>
                    <span className="text-neutral-600 dark:text-neutral-300">
                      {item.fusionOption.options.map(opt => opt.explain).join(', ')}
                      {item.fusionOption.options.some(opt => opt.buff) && 
                        ` (버프력: ${item.fusionOption.options.filter(opt => opt.buff).map(opt => opt.buff).join('/')})`}
                    </span>
                  </div>
                )}

                {item.upgradeInfo && (
                  <div>
                    <span className="font-medium text-purple-600 dark:text-purple-400">업그레이드: </span>
                    <span className="text-neutral-600 dark:text-neutral-300">
                      {item.upgradeInfo.itemName} (세트 포인트: {item.upgradeInfo.setPoint || '-'})
                    </span>
                  </div>
                )}

                {item.tune && item.tune.length > 0 && 
                  item.tune.some(t => (t.status && t.status.length > 0) || t.level !== undefined || t.setPoint !== undefined || t.upgrade !== undefined) && (
                  <div>
                    <span className="font-medium text-teal-600 dark:text-teal-400">튠: </span>
                    <span className="text-neutral-600 dark:text-neutral-300">
                      {item.tune.map((t) => {
                        let tuneStr = '';
                        if (t.status && t.status.length > 0) {
                          tuneStr = t.status.map(s => `${s.name} ${s.value}`).join(', ');
                        } else if (t.level !== undefined && t.level !== "0") { // 레벨 0은 표시 안함
                          tuneStr = `Lv.${t.level}`;
                          if (t.setPoint !== undefined) {
                            tuneStr += ` (세트 포인트: ${t.setPoint || '-'})`;
                          }
                        }
                        if (t.upgrade === "false") {
                          tuneStr += `${tuneStr ? ', ' : ''}업그레이드 불가`;
                        } else if (t.upgrade && t.upgrade !== "true" && t.upgrade !== "0") { // "true", "0" 문자열은 표시 안함
                          tuneStr += `${tuneStr ? ', ' : ''}업그레이드: ${t.upgrade}`;
                        }
                        return tuneStr;
                      }).filter(Boolean).join(' / ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 