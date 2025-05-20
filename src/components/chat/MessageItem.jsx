"use client";

export default function MessageItem({ message }) {
  // 초기 인사 메시지(isGreeting: true)는 ChatGreeting 컴포넌트에서 처리하므로 여기서는 렌더링하지 않습니다.
  if (message.isGreeting) return null;

  const isUser = message.sender === "user";

  return (
    <div 
      className={`chat-message-item-outer ${isUser ? "chat-message-item-user-outer" : "chat-message-item-ai-outer"}`}
    >
      <div
        className={`chat-message-bubble ${isUser
            ? "chat-message-bubble-user"
            : "chat-message-bubble-ai"
          }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
} 