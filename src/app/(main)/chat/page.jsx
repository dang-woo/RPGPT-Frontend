"use client";

import { useState, useEffect, useRef } from 'react';
// import { ArrowUp } from 'lucide-react'; // ChatInput 컴포넌트로 이동
import ChatGreeting from '../../../components/chat/ChatGreeting';
import MessageList from '../../../components/chat/MessageList';
import ChatInput from '../../../components/chat/ChatInput';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 'initial-greeting',
      text: "안녕하세요!\n오늘 무엇을 도와드릴까요?",
      sender: "ai",
      isGreeting: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatAreaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = 0;
    }
  }, []);

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

    setMessages((prevMessages) => {
      const chatStartedMessages = prevMessages.filter(msg => !msg.isGreeting);
      return [...chatStartedMessages, newUserMessage];
    });
    
    setInputValue("");
    setIsLoadingAiResponse(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now().toString() + '-ai',
        text: `"${userMessageText}"에 대한 AI의 답변입니다. (시뮬레이션)`,
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsLoadingAiResponse(false);
    }, 1500);
  };

  const isGreetingActive = messages.length === 1 && messages[0].isGreeting;

  return (
    <div className="chat-page-container">
      <div className="chat-ui-wrapper">
        <main className="chat-messages-area" ref={chatAreaRef}>
          {isGreetingActive ? (
            <ChatGreeting text={messages[0].text} />
          ) : (
            // 인사 메시지가 아닐 경우, 현재 messages 배열을 MessageList에 전달
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