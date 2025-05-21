"use client";

export default function ChatGreeting({ text }) {
  const greetingLines = text.split('\n');
  return (
    <div className="chat-greeting-container flex flex-col items-center justify-center text-center p-4">
      {greetingLines.length > 1 ? (
        <>
          <p className="text-sm text-[var(--chat-greeting-subtitle-text)] mb-1">
            {greetingLines[0]}
          </p>
          <h1 className="text-base font-semibold text-[var(--chat-greeting-title-text)]">
            {greetingLines[1]}
          </h1>
          {greetingLines[2] && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{greetingLines[2]}</p>
          )}
        </>
      ) : (
        <h1 className="text-base font-semibold text-[var(--chat-greeting-title-text)]">
          {greetingLines[0]}
        </h1>
      )}
    </div>
  );
} 