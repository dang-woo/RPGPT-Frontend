// 아이템 등급별 색상
export const rarityColorMap = {
  '커먼': 'text-gray-500',
  '언커먼': 'text-green-500',
  '레어': 'text-purple-500',
  '유니크': 'text-pink-500',
  '레전더리': 'text-orange-500',
  '에픽': 'text-yellow-500',
  '신화': 'text-purple-600',
  '흑아': 'text-red-500',
  '태초': 'text-teal-500',
};

// 아이템의 강화/증폭 수치를 표시하는 함수 (JSX를 반환하므로 React 컴포넌트 또는 함수로 사용)
export const RenderReinforceAmp = ({ item }) => {
  let text = "";
  if (item.reinforce && parseInt(item.reinforce) > 0) {
    text += `+${item.reinforce}강화`;
  }
  // API 응답에서 amplificationName은 증폭으로 인한 스탯 증가 이름 (예: "차원 지능")
  // 증폭 수치는 reinforce 값으로 표현될 수 있음. API 구조를 다시 확인해야 함.
  // 우선은 기존 로직을 유지하되, 증폭 표시를 위한 명확한 필드가 필요함.
  // 예시: item.amplificationValue, item.amplificationType 등이 있다면 활용.
  // 여기서는 item.amplificationName이 존재하고, 강화 수치가 있을 때 증폭으로 간주하는 로직을 유지.
  if (item.amplificationName && item.reinforce && parseInt(item.reinforce) > 0) {
    text = `+${item.reinforce}증폭 (${item.amplificationName})`;
  } else if (item.amplificationName && (!item.reinforce || parseInt(item.reinforce) === 0)) {
    // 순수 증폭 (강화 수치 0 또는 없음) - 이 경우는 API 스펙에 따라 다를 수 있음
    text = `증폭 (${item.amplificationName})`; 
  } else if (item.amplificationName) {
    // 기타 증폭 관련 텍스트 (예: "이계 기운의 정화서")
    // 이 경우는 강화/증폭 수치 표시와는 다를 수 있으므로, API 응답을 보고 판단 필요.
    // 우선 기존 로직처럼 amplificationName을 그대로 표시.
    text += `${item.amplificationName}`; 
  }
  return text ? <span className="text-sm text-purple-400 ml-2">{text}</span> : null;
}; 