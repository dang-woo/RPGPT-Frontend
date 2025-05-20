"use client";

export default function LoadingIndicator() {
  return (
    <div className="chat-message-item-outer chat-message-item-ai-outer">
      <div className="chat-loading-indicator-bubble">
        <div className="chat-loading-dot mr-1.5"></div>
        <div className="chat-loading-dot mr-1.5 delay-150"></div>
        <div className="chat-loading-dot delay-300"></div>
      </div>
    </div>
  );
} 