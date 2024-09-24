import { create } from 'zustand';

export const useFutureTripsStore = create((set) => ({
  futureTrips: [],

  addFutureTrip: (trip) => set((state) => ({
    futureTrips: [...state.futureTrips, trip],
  })),
}));