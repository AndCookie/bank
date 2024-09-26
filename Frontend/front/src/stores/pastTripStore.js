import { create } from 'zustand';

export const usePastTripStore = create((set) => ({
  // 과거 여행 정보
  pastTrips: [],

  // 과거 여행 정보 저장
  setPastTrips: (tripInfo) => set(() => ({
    pastTrips: tripInfo.map(trip => ({
      id: trip.id,
      startDate: trip.start_date,
      endDate: trip.end_date,
      tripName: trip.trip_name,
      locations: trip.locations,
    })),
  })),
}));