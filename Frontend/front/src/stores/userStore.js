import { create } from 'zustand'

export const userStore = create((set) => ({
  userName: '',
  profileImageUrl: '',
}))