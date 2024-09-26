import axios from 'axios';

// Axios 기본 설정
const axiosInstance = axios.create({
  baseURL: 'https://j11a204.p.ssafy.io/api', // 기본 URL 설정
  timeout: 5000, // 타임아웃 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더 기본 설정
  },
});

// 요청 인터셉터 (예: Authorization 헤더에 토큰 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 요청 헤더에 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // 응답 인터셉터 (예: 에러 처리)
// axiosInstance.interceptors.response.use(
//   (response) => response, // 성공적인 응답
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // 인증 실패 시 처리 (예: 로그인 페이지로 리다이렉트)
//       console.log('Unauthorized, redirecting to login...');
//       // window.location.href = '/login';  // 필요 시 리다이렉트
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;