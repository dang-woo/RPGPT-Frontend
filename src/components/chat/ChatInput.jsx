"use client";

import { ArrowUp } from 'lucide-react';

export default function ChatInput({
  inputValue,
  onInputChange,
  onSendMessage,
  isLoadingAiResponse,
  isGreetingActive, // placeholder 텍스트 변경을 위해 추가
  inputRef // textarea에 focus하기 위해 추가
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const canSendMessage = inputValue.trim() !== "" && !isLoadingAiResponse;

  return (
    <div className="chat-input-container">
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