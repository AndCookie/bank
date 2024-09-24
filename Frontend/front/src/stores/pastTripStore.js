import { create } from 'zustand';

export const usePastTripsStore = create((set) => ({
  pastTrips: [],

  // 과거 여행 추가
  addPastTrip: (trip) => set((state) => ({
    pastTrips: [...state.pastTrips, trip],
  })),

  // 과거 여행 조회
  getPastTrips: () => usePastTripsStore.getState().pastTrips,
}));