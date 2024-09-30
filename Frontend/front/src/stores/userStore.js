import { create } from 'zustand'

export const useUserStore = create((set) => ({
  // 토큰
  userToken: '',

  // 토큰 저장
  setUserToken: (token) => set(() => ({
    userToken: typeof tripInfo === 'string'
      ? {
        userToken: token
      }
      : '',
  })),

  // 토큰 발급
  fetchToken: async () => {
    try {
      const eventSourceToken = new EventSource('https://j11a204.p.ssafy.io/api/accounts/kakao_login_success/');
      eventSourceToken.onmessage = (event) => {
        const data = JSON.parse(event.data);
        useUserStore.getState().setUserToken(data);
        eventSourceToken.close();
      };

      eventSourceToken.onerror = (error) => {
        console.error(error);
        eventSourceToken.close();
      };
    } catch (error) {
      console.log(error);
    }
  },

  userName: '',
  profileImageUrl: '',
}))