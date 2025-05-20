"use client";

import MessageItem from './MessageItem';
import LoadingIndicator from './LoadingIndicator';

export default function MessageList({ messagesToDisplay, isLoadingAiResponse }) {
  return (
    <>
      {messagesToDisplay.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isLoadingAiResponse && <LoadingIndicator />}
    </>
  );
} 