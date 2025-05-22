"use client";

import { useEffect, useRef } from 'react';
import ChatGreeting from './ChatGreeting';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import useAuthStore from '@/lib/store/authStore';
import useChatStore from '@/lib/store/chatStore';

// 이 컴포넌트는 채팅 UI와 핵심 로직을 담당합니다.
// props:
// - initialContextText: (선택 사항) 채팅 시작 시 AI에게 전달할 초기 컨텍스트 메시지 (예: "던파 OOO 캐릭터에 대해 궁금합니다.")
// - isModalMode: (선택 사항) true일 경우 모달 내부 스타일에 맞게 일부 UI 조정 (예: 배경색, 그림자 등) - 이번 단계에서는 미적용

export default function ChatInterface({ initialContextText = "", isModalMode = false, currentCharacterDetails = null }) {
  const { user } = useAuthStore();
  const {
    messages,
    inputValue,
    isLoadingAiResponse,
    addMessage,
    setInputValue,
    setIsLoadingAiResponse,
    initializeGreeting,
    conversationCount,
    deleteChatHistoryAndNotify
  } = useChatStore();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatAreaRef = useRef(null);

  useEffect(() => {
    let greetingText = user && user.nickname
      ? `${user.nickname}님, 무엇을 도와드릴까요?`
      : "무엇을 도와드릴까요?";

    if (initialContextText) {
      greetingText = `${initialContextText}\n${greetingText}`;
    }
    
    initializeGreeting(greetingText);

  }, [user, initialContextText, initializeGreeting]);

  useEffect(() => {
    if (conversationCount >= 5) {
      const timer = setTimeout(() => {
        deleteChatHistoryAndNotify("AI와의 대화는 최대 5회까지 가능합니다. 이전 대화가 삭제되었으니 새로 시작해주세요.");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [conversationCount, deleteChatHistoryAndNotify]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatAreaRef.current && messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoadingAiResponse) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isLoadingAiResponse]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    const userMessageText = inputValue.trim();
    if (userMessageText === "" || isLoadingAiResponse) return;

    if (conversationCount >= 5) {
      addMessage({
        id: Date.now().toString() + '-ai-limit-send',
        text: "대화 횟수 5회를 초과하여 메시지를 보낼 수 없습니다.",
        sender: "ai",
      });
      return;
    }

    const newUserMessage = {
      id: Date.now().toString() + '-user',
      text: userMessageText,
      sender: "user",
    };
    
    addMessage(newUserMessage);
    setInputValue("");
    setIsLoadingAiResponse(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now().toString() + '-ai',
        text: `"${userMessageText}"에 대한 AI의 답변입니다. (시뮬레이션)`,
        sender: "ai",
      };
      addMessage(aiResponse);
      setIsLoadingAiResponse(false);
    }, 1500);

    useChatStore.getState().sendChatMessageToApi(userMessageText);
  };

  const isGreetingActive = messages.length === 1 && messages[0].isGreeting;

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden ${isModalMode ? 'bg-transparent' : 'bg-neutral-50 dark:bg-neutral-850'}`}>
      <main
        className={`flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0 ${isGreetingActive ? 'flex items-center justify-center' : ''}`}
        ref={chatAreaRef}
      >
        {isGreetingActive ? (
          <ChatGreeting text={messages[0].text} />
        ) : (
          <MessageList messagesToDisplay={messages} isLoadingAiResponse={isLoadingAiResponse} />
        )}
        <div ref={messagesEndRef} />
      </main>
      <ChatInput
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        isLoadingAiResponse={isLoadingAiResponse}
        isGreetingActive={isGreetingActive}
        inputRef={inputRef}
        currentCharacterDetails={currentCharacterDetails}
      />
    </div>
  );
} 