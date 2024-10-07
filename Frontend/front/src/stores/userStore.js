import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      // 토큰
      userToken: '',

      // 토큰 저장
      setUserToken: (token) => set(() => ({
        userToken: token,
      })),

      // 유저 정보
      userInfo: {},

      // 유저 정보 저장
      setUserInfo: (userInfo) => set(() => ({
        userInfo: {
          nickName: userInfo.properties.nickname,
          profileImage: userInfo.properties.profile_image,
        },
      })),
    }),
    {
      name: 'user-storage', // localStorage에 저장될 key 이름
      storage: {
        getItem: (name) => JSON.parse(localStorage.getItem(name)),  // 역직렬화
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),  // 직렬화
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
