"use client";

import React from 'react';
import { rarityColorMap, RenderReinforceAmp } from "@/utils/dnfUtils"; // 스타일링 위해 추가, RenderReinforceAmp 추가
import Image from 'next/image';

// 각 장비/아바타/크리쳐 아이템을 표시하는 작은 컴포넌트 (개선된 버전)
const BuffItemDisplay = ({ item, type, fullEquipmentList }) => {
  const defaultImage = "https://via.placeholder.com/64/E5E7EB/9CA3AF?text=NoImg";
  
  // 이미지 URL 직접 생성 (itemId 사용)
  const itemImageToShow = item.itemId ? `https://img-api.neople.co.kr/df/items/${item.itemId}` : defaultImage;

  let itemNameToShow = item.itemName || "이름 없음";
  let itemRarityToShow = item.itemRarity;
  let enchantInfo = null;
  let reinforceDisplay = null;
  let avatarOptionAbility = null;
  let avatarEmblems = [];

  if (type === 'equipment' && item) {
    // 장비의 경우, fullEquipmentList에서 추가 정보를 가져올 수 있음 (이름, 강화 등)
    // 단, 버프강화 창의 아이템과 실제 착용 아이템은 다를 수 있으므로 주의.
    // 여기서는 item (buffSkillInfo.equipment의 요소)에 있는 정보를 우선 사용하고,
    // 이미지는 itemId로 직접 가져오므로 fItem에서 이미지를 가져올 필요는 없음.
    const fItem = fullEquipmentList?.find(eq => eq.itemId === item.itemId); // 매칭 시도 (이름, 강화 등 다른 정보 위함)

    itemNameToShow = fItem?.itemName || item.itemName || "이름 없음"; // fItem 우선, 없으면 버프정보의 아이템 이름
    itemRarityToShow = fItem?.itemRarity || item.itemRarity;
    if (fItem) {
      reinforceDisplay = <RenderReinforceAmp item={fItem} />;
      if (fItem.enchant?.status?.length > 0) {
        enchantInfo = fItem.enchant.status.map(s => `${s.name} ${s.value}`).join(', ');
      }
    } else {
      // fItem이 없을 경우, item 자체의 강화/증폭 정보를 표시 (API 응답에 있다면)
      // 현재 dd.txt의 buffSkillInfo.equipment 에는 직접적인 reinforce, amplificationName 필드가 있음
      reinforceDisplay = <RenderReinforceAmp item={item} />; // item 객체를 직접 전달
      if (item.enchant?.status?.length > 0) { // API 응답에 enchant가 있다면
        enchantInfo = item.enchant.status.map(s => `${s.name} ${s.value}`).join(', ');
      }
    }

  } else if (type === 'avatar' && item) {
    avatarOptionAbility = item.optionAbility;
    avatarEmblems = item.emblems || [];
  } else if (type === 'creature' && item) {
    // 크리쳐는 item 객체 자체의 정보를 사용
  }

  const rarityClass = rarityColorMap[itemRarityToShow] || 'item-name-default';

  return (
    <li className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg shadow border border-neutral-200 dark:border-neutral-600 flex flex-col text-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative w-16 h-16 flex-shrink-0 mr-4 rounded border border-[var(--border-color-semilight)] item-image-placeholder">
          <Image
            src={itemImageToShow}
            alt={itemNameToShow}
            fill
            className="object-contain p-1"
            sizes="64px"
            onError={(e) => {
              e.currentTarget.srcset = defaultImage;
              e.currentTarget.src = defaultImage;
            }}
          />
        </div>
        <div className="flex-grow min-w-0">
          <p className={`font-semibold truncate ${rarityClass}`} title={itemNameToShow}>{itemNameToShow}</p>
          {item.slotName && <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.slotName}</p>}
        </div>
      </div>

      {/* 아바타 옵션 또는 기타 세부 정보 */} 
      {type === "avatar" && avatarOptionAbility && (
        <p className="text-xs text-sky-600 dark:text-sky-400 mt-1 mb-1.5">옵션: {avatarOptionAbility}</p>
      )}
      {/* 장비의 경우 itemTypeDetail (e.g., 가죽, 판금) 표시 */} 
      {type === "equipment" && item.itemTypeDetail && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">종류: {item.itemTypeDetail}</p>
      )}

      {/* 엠블렘 정보 (아바타 타입일 때만) */} 
      {type === "avatar" && avatarEmblems && avatarEmblems.length > 0 && (
        <div className="mt-1 pt-2 border-t border-neutral-200 dark:border-neutral-600">
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">엠블렘:</p>
          <ul className="space-y-1">
            {avatarEmblems.map((emblem, idx) => (
              <li key={idx} className={`text-xs ${rarityColorMap[emblem.itemRarity] || 'text-neutral-700 dark:text-neutral-200'} flex justify-between`}>
                <span>{emblem.itemName}</span>
                {/* <span className="text-neutral-500 dark:text-neutral-400">{emblem.slotNo}</span> */} 
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default function BuffSkillSection({ buffSkillInfo, fullEquipmentList }) {
  // --- DEBUG LOGS START ---
  // console.log("[BuffSkillSection] buffSkillInfo:", buffSkillInfo); // 이전 로그로 확인했으므로 주석 처리
  // console.log("[BuffSkillSection] fullEquipmentList:", fullEquipmentList); // 이전 로그로 확인했으므로 주석 처리
  // --- DEBUG LOGS END ---

  if (!buffSkillInfo || !buffSkillInfo.skillInfo || !buffSkillInfo.skillInfo.name) {
    return (
      <div className="section-box">
        <h2 className="section-content-title text-2xl font-bold mb-4">버프 강화 정보</h2>
        <p className="item-entry-text-secondary">표시할 버프 강화 정보가 없습니다.</p>
      </div>
    );
  }

  const skillName = buffSkillInfo.skillInfo.name;
  const skillLevel = buffSkillInfo.skillInfo.option?.level || buffSkillInfo.skillInfo?.level;
  const { equipment: buffEquipmentSource, avatar, creature } = buffSkillInfo;

  const buffEquipment = buffEquipmentSource?.map(bItem => {
    const fItem = fullEquipmentList?.find(item => item.itemId === bItem.itemId);
    
    // --- 추가 디버깅 로그 ---
    console.log(`[BuffSkillSection] Mapping buff item: ${bItem.itemName} (ID: ${bItem.itemId})`);
    if (fItem) {
      console.log(`  Found matching item in fullEquipmentList: ${fItem.itemName} (Image URL: ${fItem.itemImage})`);
    } else {
      console.log(`  No matching item found in fullEquipmentList for ID: ${bItem.itemId}`);
    }
    // --- 추가 디버깅 로그 끝 ---

    return {
      ...bItem,
      itemImage: fItem?.itemImage || bItem.itemImage, // buffSkillInfo의 itemImage는 null이므로 fItem의 것을 기대
      itemName: fItem?.itemName || bItem.itemName,    // 이름도 fItem의 것을 우선 사용할 수 있도록
    };
  }) || [];

  // 버프 크리쳐 정보 표시
  // dd.txt에 따르면 buffSkillInfo.creature는 배열일 수 있음. (예: [{"itemId": ..., "itemName": ...}])
  // 따라서 map으로 처리하는 것이 더 안전함.
  const creatureItems = buffSkillInfo.creature; // 배열이라고 가정

  return (
    <div className="section-box">
      <h2 className="section-content-title text-2xl font-bold mb-6">버프 강화 정보</h2>

      <div className="mb-6 item-entry p-4">
        <h3 className="text-lg font-semibold item-entry-text-primary mb-2">버프 스킬: {skillName || '이름 없음'}</h3>
        <p className="text-sm item-entry-text-secondary">스킬 레벨: {skillLevel || '-'}</p>
      </div>

      {/* 버프 장비 섹션 - 개선된 BuffItemDisplay 사용 */} 
      {buffEquipment && buffEquipment.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold item-entry-text-label mb-3">버프 장비:</h3>
          {/* 컬럼 수를 줄여서 각 아이템이 더 잘 보이도록 조정 (예: 1열 또는 2열) */} 
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buffEquipment.map((item) => (
              <BuffItemDisplay key={item.itemId || item.itemName} item={item} type="equipment" fullEquipmentList={fullEquipmentList} />
            ))}
          </ul>
        </div>
      )}

      {/* 아바타 섹션 - 개선된 BuffItemDisplay 사용 */} 
      {avatar && avatar.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold item-entry-text-label mb-3">관련 아바타</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {avatar.map((item, index) => <BuffItemDisplay key={`avatar-${index}`} item={item} type="avatar" fullEquipmentList={fullEquipmentList} />)}
          </ul>
        </div>
      )}

      {/* 버프 크리쳐 */}
      {creatureItems && creatureItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[var(--border-color-semilight)]">
          <h4 className="text-lg font-semibold mb-3 text-[var(--text-highlight)]">버프 크리쳐</h4>
          {creatureItems.map((creature, index) => (
            <BuffItemDisplay key={`creature-${index}`} item={creature} type="creature" fullEquipmentList={fullEquipmentList} />
          ))}
        </div>
      )}

      {(!buffEquipment || buffEquipment.length === 0) &&
       (!avatar || avatar.length === 0) &&
       (!creatureItems || creatureItems.length === 0) && (
          <p className="item-entry-text-secondary mt-4">등록된 버프 강화 장비, 아바타, 크리쳐가 없습니다.</p>
      )}
    </div>
  );
} 