"use client";

import { ArrowUp } from 'lucide-react';
import useChatStore from '@/lib/store/chatStore'; // 메시지 전송을 위해 추가

export default function ChatInput({
  inputValue,
  onInputChange,
  onSendMessage,
  isLoadingAiResponse,
  isGreetingActive, // placeholder 텍스트 변경을 위해 추가
  inputRef, // textarea에 focus하기 위해 추가
  currentCharacterDetails // 빠른 정보 전달을 위해 추가
}) {
  const { addMessage, setIsLoadingAiResponse: storeSetIsLoadingAiResponse, setInputValue: storeSetInputValue } = useChatStore();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const canSendMessage = inputValue.trim() !== "" && !isLoadingAiResponse;

  const handleQuickInfoSend = (type) => {
    if (!currentCharacterDetails || isLoadingAiResponse) return;

    let quickInfoText = "";
    let logTextPrefix = "";

    if (type === "characterInfo") {
      logTextPrefix = "캐릭터 기본 정보";
      quickInfoText = `캐릭터명: ${currentCharacterDetails.characterName}\n레벨: ${currentCharacterDetails.level}\n직업: ${currentCharacterDetails.jobName}`;
    } else if (type === "equipment") {
      logTextPrefix = "장착 장비 (무기)";
      const weapon = currentCharacterDetails.equipment?.find(eq => eq.slotName === "무기");
      if (weapon) {
        quickInfoText = `무기: ${weapon.itemName} (${weapon.itemGradeName || '정보없음'} 등급)`;
      } else {
        quickInfoText = "장착된 무기 정보가 없습니다.";
      }
    } else if (type === "avatar") {
      logTextPrefix = "아바타 정보";
      const avatars = currentCharacterDetails.avatar;
      if (avatars && avatars.length > 0) {
        quickInfoText = "아바타:\n" + avatars.map(av => `- ${av.slotName}: ${av.itemName} (${av.optionAbility || '옵션없음'})`).join("\n");
      } else {
        quickInfoText = "장착된 아바타 정보가 없습니다.";
      }
    } else if (type === "skillInfo") {
      logTextPrefix = "스킬 정보 (일부)";
      const activeSkills = currentCharacterDetails.skill?.style?.active;
      if (activeSkills && activeSkills.length > 0) {
        quickInfoText = "주요 스킬:\n" + activeSkills.slice(0, 5).map(sk => `- ${sk.name} (Lv.${sk.requiredLevel})`).join("\n");
      } else {
        quickInfoText = "스킬 정보가 없습니다.";
      }
    }

    if (quickInfoText) {
      const userMessage = {
        id: Date.now().toString() + '-user-quickinfo',
        text: `[빠른 질문] ${logTextPrefix} 정보 요청`, // 실제 유저 입력창에는 보이지 않고, AI에게 전달되는 내부 메시지 or 로그용
        sender: "user",
        isQuickInfo: true, // 빠른 정보 요청임을 구분
        displayedText: quickInfoText // 채팅창에는 요약 정보만 표시
      };
      addMessage(userMessage);
      storeSetIsLoadingAiResponse(true);

      // AI 응답 시뮬레이션
      setTimeout(() => {
        const aiResponse = {
          id: Date.now().toString() + '-ai-quickinfo',
          text: `"${logTextPrefix}"에 대한 AI의 답변입니다:\n${quickInfoText}`,
          sender: "ai",
        };
        addMessage(aiResponse);
        storeSetIsLoadingAiResponse(false);
      }, 1000);
    }
  };

  const quickButtons = [
    { label: "캐릭터", type: "characterInfo" },
    { label: "장비", type: "equipment" },
    { label: "아바타", type: "avatar" },
    { label: "스킬", type: "skillInfo" },
  ];

  return (
    <div className="chat-input-container">
      {currentCharacterDetails && (
        <div className="flex items-center justify-center space-x-2 mb-2 px-2 flex-wrap gap-y-2">
          {quickButtons.map(btn => (
            <button
              key={btn.type}
              onClick={() => handleQuickInfoSend(btn.type)}
              disabled={isLoadingAiResponse}
              className="p-2 bg-sky-500 hover:bg-sky-600 text-white text-xs rounded-full shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out whitespace-nowrap min-w-[3rem] h-8 flex items-center justify-center"
              title={`${btn.label} 정보 빠르게 질문`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
      <div className="chat-input-inner-flex">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={handleKeyPress}
          placeholder={isGreetingActive ? "무엇을 알고 싶으세요?" : "AI에게 메시지 보내기..."}
          className="chat-input-textarea"
          rows={2}
        />
        <button
          onClick={onSendMessage}
          disabled={!canSendMessage}
          className={`chat-input-button ${canSendMessage
              ? "chat-input-button-enabled"
              : "chat-input-button-disabled"
            }`}
          aria-label="메시지 전송"
          title="메시지 전송 (Enter)">
          {isLoadingAiResponse ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ArrowUp size={20} className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
} 