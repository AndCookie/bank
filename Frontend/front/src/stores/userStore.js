import { create } from 'zustand'

export const useUserStore = create((set) => ({
  // 토큰
  userToken: '',

  // 토큰 저장
  setUserToken: (token) => set(() => ({
    userToken: token
  })),

  // 유저 정보
  userInfo: {},

  // 유저 정보 저장
  setUserInfo: (userInfo) => set(() => ({
    userInfo: {
      nickName: userInfo.properties.nickname,
      profileImage: userInfo.properties.profile_image,
    }
  })),
}))