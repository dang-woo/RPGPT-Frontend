import axios from 'axios';
import useAuthStore from './store/authStore'; // authStore 경로 확인

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken'; // 백엔드가 refreshToken을 반환하고 사용한다면 필요

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // JWT 인증의 경우 일반적으로 false 또는 제거
});

// 요청 인터셉터: 모든 요청에 AccessToken을 헤더에 추가
apiClient.interceptors.request.use(
  (config) => {
    console.log('[API Request Interceptor] Triggered for URL:', config.url);
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    console.log('[API Request Interceptor] Token from localStorage:', token);

    const publicApis = ['/df/search', '/auth/login', '/auth/signup', '/auth/reissue'];
    const isPublicApi = publicApis.some(apiPath => config.url.startsWith(apiPath));

    if (token && !isPublicApi) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('[API Request Interceptor] Authorization header SET for private API:', config.headers['Authorization']);
    } else if (token && isPublicApi) {
      console.log('[API Request Interceptor] Token found, but API is public. Authorization header NOT SET for:', config.url);
    } else {
      console.warn('[API Request Interceptor] No token found. Authorization header NOT SET.');
    }
    return config;
  },
  (error) => {
    console.error('[API Request Interceptor] Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: AccessToken 만료(401) 시 RefreshToken으로 재발급 시도
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // 일반적인 API 호출 성공 시, 헤더에 새 토큰이 있는지 확인
    // 백엔드 JwtAuthenticationFilter에서 토큰 재발급 후 헤더에 담아주는 경우를 처리
    const newAccessTokenHeader = response.headers['new-access-token'];
    const newRefreshTokenHeader = response.headers['new-refresh-token']; // 백엔드가 응답 헤더에 New-Refresh-Token을 준다면 사용

    if (newAccessTokenHeader) {
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessTokenHeader);
      console.log('[API Response Interceptor] New AccessToken from response header stored.');
    }
    if (newRefreshTokenHeader) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshTokenHeader);
      console.log('[API Response Interceptor] New RefreshToken from response header stored.');
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('[API Response Interceptor] Error status:', error.response?.status);
    console.log('[API Response Interceptor] Original request URL:', originalRequest.url);
    console.log('[API Response Interceptor] Original request _retry:', originalRequest._retry);

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/reissue') {
      if (isRefreshing) {
        console.log('[API Response Interceptor] Token is already refreshing. Adding to queue.');
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log('[API Response Interceptor] Attempting to refresh token.');

      const currentAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      console.log('[API Response Interceptor] Current AccessToken for reissue:', currentAccessToken);
      console.log('[API Response Interceptor] Current RefreshToken for reissue:', currentRefreshToken);

      if (!currentRefreshToken) {
        console.error('[API Response Interceptor] No refresh token available. Logging out.');
        isRefreshing = false;
        useAuthStore.getState().logout();
        processQueue(error, null);
        return Promise.reject(error);
      }

      try {
        const reissuePayload = {
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken
        };
        console.log('[API Response Interceptor] Sending to /auth/reissue with payload:', reissuePayload);
        const rs = await apiClient.post('/auth/reissue', reissuePayload );
        console.log('[API Response Interceptor] /auth/reissue response:', rs.data);

        if (rs.data && rs.data.token && rs.data.token.accessToken) {
          const newAccessToken = rs.data.token.accessToken;
          const newRefreshToken = rs.data.token.refreshToken;

          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
            console.log('[API Response Interceptor] New AccessToken and RefreshToken stored.');
          } else {
            console.warn('[API Response Interceptor] New RefreshToken was NOT provided in reissue response. Old one will be kept if still valid.');
            console.log('[API Response Interceptor] New AccessToken stored.');
          }

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          console.error('[API Response Interceptor] Token reissue response is missing token data. Logging out.');
          processQueue(new Error("Token reissue response invalid"), null);
          useAuthStore.getState().logout();
          return Promise.reject(new Error("Token reissue response invalid"));
        }
      } catch (_error) {
        console.error('[API Response Interceptor] Token refresh failed. Logging out.', _error.response?.data || _error.message);
        processQueue(_error, null);
        useAuthStore.getState().logout();
        return Promise.reject(_error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 