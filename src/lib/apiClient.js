import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api', // 환경 변수 또는 기본 URL 사용
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키를 주고받기 위해 필요합니다.
});

// 요청 인터셉터 (필요시 사용)
// apiClient.interceptors.request.use(
//   (config) => {
//     // 요청 보내기 전에 수행할 작업 (예: 토큰 추가)
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 응답 인터셉터 (필요시 사용)
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // 응답 에러 처리 (예: 401 Unauthorized 시 로그아웃 처리)
//     if (error.response && error.response.status === 401) {
//       // 로그아웃 처리 로직 (Zustand 스토어 활용)
//       // import { useAuthStore } from './store/authStore'; // 스토어 경로에 맞게 수정
//       // useAuthStore.getState().logout(); 
//       // window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient; 