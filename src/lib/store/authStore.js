import { create } from 'zustand';
import apiClient from '../apiClient'; // apiClient 경로 수정

const useAuthStore = create((set, get) => ({
  user: null, // 현재 로그인된 사용자 정보 (예: { userId: 'test', nickname: '테스트' })
  isLoading: true, // 사용자 정보 로딩 상태 (초기값 true로 변경)

  // 로그인 액션
  login: async (credentials) => {
    set({ isLoading: true }); // 요청 시작 시 로딩 상태 true
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data && response.data.success) {
        set({ user: { userId: response.data.userId, nickname: response.data.nickname }, isLoading: false });
        return response.data;
      } else {
        set({ user: null, isLoading: false });
        throw new Error(response.data?.message || '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      set({ user: null, isLoading: false });
      // error.response?.data?.message 가 있으면 그걸 쓰고, 없으면 error.message, 그것도 없으면 기본 메시지
      const message = error.response?.data?.message || error.message || '로그인 중 오류가 발생했습니다.';
      throw new Error(message);
    }
  },

  // 로그아웃 액션
  logout: async () => {
    // 로그아웃 시에는 isLoading을 true로 할 필요는 없어보임. 즉시 user를 null로 설정.
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
      // 실패해도 클라이언트에서는 로그아웃 처리
    } finally {
      set({ user: null, isLoading: false }); // isLoading은 false로 유지
    }
  },

  // 회원가입 액션
  signup: async (userData) => {
    set({ isLoading: true }); // 요청 시작 시 로딩 상태 true
    try {
      const response = await apiClient.post('/auth/signup', userData);
      if (response.data && response.data.success) {
        set({ isLoading: false }); // 성공 시 로딩 상태 false
        return response.data;
      } else {
        set({ isLoading: false });
        throw new Error(response.data?.message || '회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
      }
    } catch (error) {
      set({ isLoading: false });
      const message = error.response?.data?.message || error.message || '회원가입 중 오류가 발생했습니다.';
      throw new Error(message);
    }
  },

  // 현재 사용자 정보 확인 (세션 기반 인증 시 앱 시작 시 호출)
  fetchCurrentUser: async () => {
    // isLoading 초기값이 true이므로, 여기서 set({ isLoading: true }) 호출은 제거하거나 유지해도 됩니다.
    // 만약 앱의 다른 부분에서 fetchCurrentUser를 직접 호출하며 로딩 상태 관리가 필요하다면 유지합니다.
    // 여기서는 초기 로딩을 위한 것이므로, 이미 true 상태일 것이라 가정하고 진행합니다.
    // 명확성을 위해 set({ isLoading: true });를 호출해줄 수 있습니다.
    if (!get().isLoading) { // 이미 로딩 중이 아닐 때만 실행하도록 하여 중복 호출 방지
        set({ isLoading: true });
    }

    try {
      const response = await apiClient.get('/auth/me');
      if (response.data && response.data.success) {
        set({ user: { userId: response.data.userId, nickname: response.data.nickname }, isLoading: false });
      } else {
        // API 응답은 성공했으나, success: false 인 경우 (예: 세션 만료 등)
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      // API 요청 자체가 실패한 경우 (네트워크 오류, 서버 오류 등)
      set({ user: null, isLoading: false }); // 에러 발생 시 확실히 로딩 상태 종료
      // 401 (미인증) 에러는 일반적인 상황일 수 있으므로 콘솔 에러에서 제외할 수 있습니다.
      // 그 외의 에러는 개발 중 확인을 위해 로그를 남기는 것이 좋습니다.
      if (error.response?.status !== 401) {
        console.error('Failed to fetch current user:', error.message); // 더 간결한 에러 메시지
      }
    }
  },
}));

export default useAuthStore; 