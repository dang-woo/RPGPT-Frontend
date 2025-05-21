"use client";

import { MessageSquareText } from 'lucide-react'; // 또는 다른 채팅 아이콘

export default function FloatingChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full shadow-lg z-50 transition-colors duration-150 ease-in-out"
      aria-label="AI 채팅 열기"
      title="AI 채팅 열기"
    >
      <MessageSquareText size={24} />
    </button>
  );
} 