import { create } from 'zustand';

export const useFutureTripStore = create((set) => ({
  // 미래 여행 정보
  futureTrips: [],

  // 미래 여행 정보 저장
  setFutureTrips: (tripInfo) => set(() => ({
    futureTrips: Array.isArray(tripInfo)
      ? tripInfo.map(trip => ({
        id: trip.id,
        startDate: trip.start_date,
        endDate: trip.end_date,
        tripName: trip.trip_name,
        locations: trip.locations,
      }))
      : [],
  })),
}));