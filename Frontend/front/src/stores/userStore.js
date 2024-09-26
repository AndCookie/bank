import { create } from 'zustand'

export const useUserStore = create((set) => ({
  userName: '',
  profileImageUrl: '',
}))