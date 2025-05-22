import { create } from 'zustand';
import apiClient from '../apiClient';

const useChatStore = create((set, get) => ({
  messages: [],
  inputValue: "",
  isLoadingAiResponse: false,
  chatContext: null, // 현재 채팅의 컨텍스트 (예: 캐릭터 ID, 페이지 종류 등)
  currentCharacterInfo: null, // 현재 캐릭터 정보 (serverId, characterId) 저장용

  setChatContext: (context) => set({ chatContext: context }),
  setCurrentCharacterInfo: (info) => set({ currentCharacterInfo: info }), // 캐릭터 정보 설정 액션

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
  
  // 실제 API로 채팅 메시지를 전송하는 액션
  sendChatMessageToApi: async (messageText) => {
    const { addMessage, setIsLoadingAiResponse, currentCharacterInfo } = get();
    
    if (!currentCharacterInfo || !currentCharacterInfo.serverId || !currentCharacterInfo.characterId) {
      console.error("ChatStore: Character info (serverId, characterId) is not set for API chat.");
      addMessage({
        id: Date.now().toString() + '-ai-error',
        text: "캐릭터 정보가 설정되지 않아 AI와 대화할 수 없습니다.",
        sender: "ai",
      });
      return;
    }

    const newUserMessage = {
      id: Date.now().toString() + '-user',
      text: messageText,
      sender: "user",
    };
    addMessage(newUserMessage);
    setIsLoadingAiResponse(true);
    set({ inputValue: "" }); // 입력창 비우기

    try {
      const payload = {
        serverId: currentCharacterInfo.serverId,
        characterId: currentCharacterInfo.characterId,
        message: messageText,
      };
      // apiClient는 자동으로 Authorization 헤더에 JWT를 포함합니다.
      const response = await apiClient.post('/df/chat', payload);

      if (response.data && response.data.reply) { // 백엔드 응답 필드명 확인 필요 (예: reply)
        const aiResponse = {
          id: Date.now().toString() + '-ai',
          text: response.data.reply, 
          sender: "ai",
        };
        addMessage(aiResponse);
      } else {
        addMessage({
          id: Date.now().toString() + '-ai-error',
          text: "AI로부터 응답을 받지 못했습니다. (응답 형식 오류)",
          sender: "ai",
        });
      }
    } catch (error) {
      console.error("Error sending chat message to API:", error.response?.data || error.message);
      addMessage({
        id: Date.now().toString() + '-ai-error',
        text: error.response?.data?.message || "AI와 대화 중 오류가 발생했습니다.",
        sender: "ai",
      });
    } finally {
      setIsLoadingAiResponse(false);
    }
  },

  // 채팅 기록을 초기화하는 함수 (선택적: 컨텍스트 변경 시 기존 대화 삭제 등)
  clearChat: (newGreetingText) => {
    set({ messages: [], inputValue: "", isLoadingAiResponse: false, currentCharacterInfo: null }); // currentCharacterInfo도 초기화
    if (newGreetingText) {
      get().initializeGreeting(newGreetingText);
    }
  },
}));

export default useChatStore; 