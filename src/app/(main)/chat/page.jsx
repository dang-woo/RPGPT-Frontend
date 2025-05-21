"use client";

import { useEffect, useRef } from 'react';
import ChatGreeting from '@/components/chat/ChatGreeting';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import useAuthStore from '@/lib/store/authStore';
import useChatStore from '@/lib/store/chatStore';

export default function ChatPage() {
  const { user } = useAuthStore();
  const {
    messages,
    inputValue,
    isLoadingAiResponse,
    addMessage,
    setInputValue,
    setIsLoadingAiResponse,
    initializeGreeting,
  } = useChatStore();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatAreaRef = useRef(null);

  useEffect(() => {
    const greetingText = user && user.nickname
      ? `${user.nickname}님, 무엇을 도와드릴까요?`
      : "무엇을 도와드릴까요?";
    
    initializeGreeting(greetingText); 

  }, [user, initializeGreeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 페이지 진입 시 또는 chatAreaRef가 설정될 때 스크롤을 최상단으로 이동
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = 0;
    }
  }, []); // 마운트 시 한 번만 실행하여 스크롤을 최상단으로

  // 메시지 목록이 변경될 때 (새 메시지 수신 등) 자동 스크롤 로직
  // 사용자 요청: "채팅을 보낼때마다 스크롤이 내려가는 현상" 수정을 위해 일단 이 부분을 주석 처리
  /*
  useEffect(() => {
    if (messages.length > 1) { // 인사 메시지 외에 다른 메시지가 있을 때만 스크롤
        scrollToBottom();
    }
  }, [messages]);
  */

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
  };

  const isGreetingActive = messages.length === 1 && messages[0].isGreeting;

  return (
    <div className="chat-page-container">
      <div className="chat-ui-wrapper">
        <main
          className={`chat-messages-area ${isGreetingActive ? 'greeting-active' : ''}`}
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
        />
      </div>
    </div>
  );
} 