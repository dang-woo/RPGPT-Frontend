"use client";

export default function ChatGreeting({ text }) {
  const greetingLines = text.split('\\n');
  return (
    <div className="chat-greeting-container">
      <h1 className="chat-greeting-title">
        {greetingLines[0]}
      </h1>
      {greetingLines[1] && (
        <p className="chat-greeting-subtitle">
          {greetingLines[1]}
        </p>
      )}
      {/* 추가적인 안내 문구나 아이콘 등을 여기에 추가할 수 있습니다. */}
    </div>
  );
} 