// src/app/mypage/mockData.js
// 나중에 실제 API로 대체될 하드코딩된 모험단 데이터입니다.
export const mockAdventureCharacters = {
    adventureName: "탭탭",
    characters: [
        {
            serverId: "cain",
            characterId: "characterId1", // 실제 ID 대신 임의의 고유 ID
            characterName: "여렌탭",
            jobGrowName: "眞 레인저",
            fame: 73800,
            damage: "84억 7,993만",
            buffPower: null,
            characterImageURL: "https://img-api.neople.co.kr/df/servers/cain/characters/0f7076358bcc4993a519983329177965?zoom=1", // 실제 이미지 URL 또는 플레이스홀더
            guildName: "카페알바"
        },
        {
            serverId: "cain",
            characterId: "characterId2",
            characterName: "엘마탭",
            jobGrowName: "眞 엘레멘탈마스터",
            fame: 70990,
            damage: "43억 7,137만",
            buffPower: null,
            characterImageURL: "https://img-api.neople.co.kr/df/servers/cain/characters/e1a69c09eda0436a409fd78336874608?zoom=1",
            guildName: "카페알바"
        },
        {
            serverId: "cain",
            characterId: "characterId3",
            characterName: "헌터탭",
            jobGrowName: "眞 헌터",
            fame: 69173,
            damage: "54억 3,487만",
            buffPower: null,
            characterImageURL: "https://img-api.neople.co.kr/df/servers/cain/characters/6968c260929e6f670cdc735a14883934?zoom=1",
            guildName: "카페알바"
        },
        {
            serverId: "cain",
            characterId: "characterId4",
            characterName: "버퍼탭",
            jobGrowName: "眞 뮤즈",
            fame: 63982,
            damage: null,
            buffPower: "461만",
            characterImageURL: "https://img-api.neople.co.kr/df/servers/cain/characters/4fd6d72ef9e189209263679e8697118f?zoom=1",
            guildName: "카페알바" 
        },
        {
            serverId: "cain",
            characterId: "characterId5",
            characterName: "트븜탭",
            jobGrowName: "眞 트래블러",
            fame: 61665,
            damage: "24억 945만",
            buffPower: null,
            characterImageURL: "https://img-api.neople.co.kr/df/servers/cain/characters/53d43854066511f81a339bd4f15699e8?zoom=1",
            guildName: "카페알바"
        }
    ]
}; 

// 서버 ID를 한글 이름으로 매핑 (src/app/(main)/dnf/[serverId]/[characterId]/page.jsx 와 유사하게)
export const serverNameMap = {
    all: "전체",
    adven: "모험단",
    cain: "카인",
    diregie: "디레지에",
    siroco: "시로코",
    prey: "프레이",
    casillas: "카시야스",
    hilder: "힐더",
    anton: "안톤",
    bakal: "바칼",
  }; 