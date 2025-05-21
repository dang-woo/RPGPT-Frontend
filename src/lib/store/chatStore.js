import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  messages: [],
  inputValue: "",
  isLoadingAiResponse: false,
  chatContext: null, // 현재 채팅의 컨텍스트 (예: 캐릭터 ID, 페이지 종류 등)

  setChatContext: (context) => set({ chatContext: context }),

  addMessage: (message) => {
    // 만약 isGreeting이 true인 초기 메시지가 있다면, 새 메시지 추가 시 이를 제거
    const currentMessages = get().messages;
    const filteredMessages = currentMessages.length === 1 && currentMessages[0].isGreeting
      ? []
      : currentMessages;

    set({ messages: [...filteredMessages, message] });
  },

  setInputValue: (value) => set({ inputValue: value }),

  setIsLoadingAiResponse: (loading) => set({ isLoadingAiResponse: loading }),

  // 초기 인사 메시지 설정 (컨텍스트에 따라 다르게 설정 가능)
  initializeGreeting: (greetingText) => {
    // 기존 메시지가 없고, greetingText가 제공될 때만 초기화
    if (get().messages.length === 0 && greetingText) {
      set({ 
        messages: [
          {
            id: 'initial-greeting',
            text: greetingText,
            sender: "ai",
            isGreeting: true,
          },
        ]
      });
    }
  },
  
  // 채팅 기록을 초기화하는 함수 (선택적: 컨텍스트 변경 시 기존 대화 삭제 등)
  clearChat: (newGreetingText) => {
    set({ messages: [], inputValue: "", isLoadingAiResponse: false });
    if (newGreetingText) {
      get().initializeGreeting(newGreetingText);
    }
  },
}));

export default useChatStore; 