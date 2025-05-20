"use client";

import Image from 'next/image';
import { rarityColorMap } from "@/utils/dnfUtils";

export default function FlagSection({ flag }) {
  if (!flag || !flag.itemName) { // 휘장 이름이 없을 경우 표시 안 함
    return null; // 또는 "장착된 휘장이 없습니다." 메시지 반환
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-neutral-800 shadow-xl rounded-lg border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--link-accent-color)' }}>휘장</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-600">
        {flag.itemImage && (
          <div className="relative w-16 h-16 mr-4 mb-2 sm:mb-0 flex-shrink-0">
            <Image
              src={flag.itemImage}
              alt={flag.itemName || '휘장 이미지'}
              width={64}
              height={64}
              className="rounded object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
        <div className="flex-grow">
          <p className={`text-xl font-semibold ${rarityColorMap[flag.itemRarity] || 'text-neutral-800 dark:text-neutral-100'}`}>
            {flag.itemName}
          </p>
          {flag.reinforce && <p className="text-sm text-orange-400">강화: +{flag.reinforce}</p>}
          {flag.reinforceStatus && flag.reinforceStatus.length > 0 && (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              <p>강화 효과:</p>
              <ul className="list-disc list-inside ml-2">
                {flag.reinforceStatus.map((status, idx) => (
                  <li key={idx}>{status.name}: {status.value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {flag.gems && flag.gems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--link-accent-color)' }}>장착 젬</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {flag.gems.map((gem, index) => (
              <div key={index} className="p-2 bg-neutral-50 dark:bg-neutral-700 rounded shadow text-sm flex items-center">
                {gem.itemImage && (
                  <div className="relative w-8 h-8 mr-2 flex-shrink-0">
                    <Image 
                        src={gem.itemImage}
                        alt={gem.itemName || '젬 이미지'}
                        width={32}
                        height={32}
                        className="rounded object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                )}
                <div>
                    <p className={`font-medium ${rarityColorMap[gem.itemRarity] || 'text-neutral-700 dark:text-neutral-200'}`}>
                    {gem.slotNo ? `${gem.slotNo}번 슬롯: ` : ''}{gem.itemName}
                    </p>
                    {/* API 응답에 젬 옵션 정보가 있다면 추가 (예: gem.options) */}
                    {/* <p className="text-xs text-gray-500">옵션: 힘 +15</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 