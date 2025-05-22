import { create } from 'zustand';
import apiClient from '../apiClient'; // apiClient 경로 유지

// localStorage 키 정의
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const useAuthStore = create((set, get) => ({
  user: null, // 현재 로그인된 사용자 정보 (예: { userId: 'test', nickname: '테스트' })
  isLoading: true, // 사용자 정보 로딩 상태 (초기값 true)
  isLoggingIn: false, // 로그인 요청 진행 상태
  isSigningUp: false, // 회원가입 요청 진행 상태
  isFetchingCurrentUser: false, // 현재 유저 정보 요청 상태
  error: null, // 에러 상태 추가

  // 로그인 액션
  login: async (credentials) => {
    set({ isLoggingIn: true, isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      // 수정된 조건: 응답 데이터와 토큰 객체, 그리고 accessToken이 존재하는지 확인
      // 백엔드 응답 예시: { message: "로그인 성공", token: { accessToken: "...", refreshToken: "..." } }
      if (response.data && response.data.token && response.data.token.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.token.accessToken);
        
        if (response.data.token.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.token.refreshToken);
          console.log('[AuthStore] AccessToken and RefreshToken stored from login response.');
        } else {
          // refreshToken이 없는 경우는 이제 발생하지 않을 것으로 예상되지만, 방어적으로 로그 유지
          localStorage.removeItem(REFRESH_TOKEN_KEY); // 혹시 모를 이전 값 제거
          console.warn('[AuthStore] Refresh token not found in login response. This might affect token refresh.');
        }
        
        // fetchCurrentUser를 호출하여 사용자 정보를 가져오고 user 상태를 업데이트합니다.
        // fetchCurrentUser 내부에서 isLoading 상태도 관리합니다.
        await get().fetchCurrentUser(true); 
        set({ isLoggingIn: false }); // 로그인 진행 상태만 false로 변경

        // 성공 객체 반환 (메시지는 백엔드 응답을 사용하거나 기본값 설정)
        return { success: true, message: response.data.message || "로그인 되었습니다." };
      } else {
        // 로그인 실패 또는 예상치 못한 응답 형식
        const errorMessage = response.data?.message || '아이디 또는 비밀번호가 올바르지 않거나, 서버 응답이 예상과 다릅니다.';
        set({ user: null, isLoggingIn: false, isLoading: false, error: errorMessage });
        throw new Error(errorMessage);
      }
    } catch (error) {
      // API 호출 실패 또는 위에서 throw된 에러 처리
      const message = error.response?.data?.message || error.message || '로그인 중 알 수 없는 오류가 발생했습니다.';
      set({ user: null, isLoggingIn: false, isLoading: false, error: message });
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY); 
      throw new Error(message);
    }
  },

  // 로그아웃 액션
  logout: async () => {

      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      set({ user: null, isLoading: false, error: null }); // 로그아웃 시 에러 상태도 초기화

  },

  // 회원가입 액션
  signup: async (userData) => {
    set({ isSigningUp: true, isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/signup', userData);
      if (response.data && response.data.success) {
        // 회원가입 성공 시 바로 로그인시키지 않고, 로그인 페이지로 유도하거나 메시지만 표시할 수 있음
        // 여기서는 반환된 사용자 정보로 user 상태를 업데이트하지 않음.
        set({ isSigningUp: false, isLoading: false }); 
        return response.data; // { success: true, message: "...", userId: "...", nickname: "..." }
      } else {
        const errorMessage = response.data?.message || '회원가입에 실패했습니다. 입력 정보를 확인해주세요.';
        set({ isSigningUp: false, isLoading: false, error: errorMessage });
        throw new Error(errorMessage);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || '회원가입 중 오류가 발생했습니다.';
      set({ isSigningUp: false, isLoading: false, error: message });
      throw new Error(message);
    }
  },

  // 현재 사용자 정보 확인
  fetchCurrentUser: async (forceFetch = false) => {
    // 이미 fetch 중이고 강제 fetch가 아니면 중복 실행 방지
    if (get().isFetchingCurrentUser && !forceFetch) return;
    
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      set({ user: null, isLoading: false, isFetchingCurrentUser: false, error: null });
      return;
    }

    // fetchCurrentUser가 호출될 때마다 isFetchingCurrentUser를 true로 설정
    set({ isLoading: true, isFetchingCurrentUser: true, error: null }); 
    try {
      const response = await apiClient.get('/auth/me'); // Authorization 헤더는 apiClient 인터셉터에서 추가
      if (response.data && response.data.success) {
        set({ 
          user: { 
            userId: response.data.userId, 
            nickname: response.data.nickname,
            // 필요하다면 다른 사용자 정보도 추가 (예: createdAt)
            // createdAt: response.data.createdAt 
          }, 
          isLoading: false, // 사용자 정보 로드 완료
          isFetchingCurrentUser: false // fetch 작업 완료
        });
      } else {
        // API 응답은 성공했으나, success: false 인 경우 (예: 서버에서 유효하지 않은 토큰으로 판단)
        set({ user: null, isLoading: false, isFetchingCurrentUser: false, error: response.data?.message || "사용자 정보를 가져오는데 실패했습니다." });
        localStorage.removeItem(ACCESS_TOKEN_KEY); 
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      // API 요청 자체가 실패한 경우 (네트워크 오류, 401 등 서버 오류)
      const message = error.response?.data?.message || error.message || '사용자 정보 조회 중 오류가 발생했습니다.';
      set({ user: null, isLoading: false, isFetchingCurrentUser: false, error: message });
      // 토큰 관련 오류(401 등) 발생 시 토큰 제거
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
      
      // 401은 apiClient에서 토큰 재발급 시도 후 최종 실패 시 넘어올 수 있음.
      // 그 외의 에러는 개발 중 확인을 위해 로그를 남길 수 있음.
      if (error.response?.status !== 401) { 
        console.error('Failed to fetch current user:', message);
      }
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useAuthStore; 