import { create } from 'zustand'

export const useUserStore = create((set) => ({
  // 토큰
  userToken: '',

  // 토큰 저장
  setUserToken: (token) => set(() => ({
    userToken: token
  })),

  userName: '',
  profileImageUrl: '',
}))