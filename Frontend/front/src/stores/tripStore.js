import { create } from 'zustand';

export const useTripStore = create((set) => ({
  trips: [],
}))