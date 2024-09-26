import { create } from 'zustand';
import axios from 'axios';
import { usePastTripStore } from '@/stores/pastTripStore';
import { useFutureTripStore } from '@/stores/futureTripStore';

export const useTripStore = create((set) => ({
  // 현재 여행 정보
  currentTrips: {},

  // 현재 여행 정보 저장
  setCurrentTrips: (tripInfo) => set(() => ({
    currentTrips: Array.isArray(tripInfo)
      ? {
        id: tripInfo.id,
        startDate: tripInfo.start_date,
        endDate: tripInfo.end_date,
        tripName: tripInfo.trip_name,
        imageUrl: tripInfo.image_url,
        locations: tripInfo.locations,
      }
      : [],
  })),

  // 여행 정보 axios 요청
  fetchTrips: async () => {
    try {
      const response = await axios.get('');
      const { data } = response;

      // 과거, 현재, 미래 여행 정보 저장
      usePastTripStore.getState().setPastTrips(data.past);
      useTripStore.getState().setCurrentTrips(data.current);
      useFutureTripStore.getState().setFutureTrips(data.future);
    } catch (error) {
      console.log(error)
    }
  },
}));

//   addPayment: (payment) => set((state) => ({
//     payments: [...state.payments, payment],
//   })),

//   updateMember: (memberId, updatedMember) => set((state) => ({
//     members: state.members.map((member) =>
//       member.id === memberId ? { ...member, ...updatedMember } : member
//     ),
//   })),

//   clearTrip: () => set(() => ({
//     locations: [],
//     members: [],
//     payments: [],
//     startDate: '',
//     endDate: '',
//   })),
// }));

// const initializeTrip = () => {
//   useTripStore.getState().setTrip(
//     ['South Korea', 'Japan'],
//     [
//       { id: 'member1', account: '123-456' },
//       { id: 'member2', account: '789-012' }
//     ],
//     '2024-09-01',
//     '2024-09-10'
//   );
// };

// const addPayment = () => {
//   useTripStore.getState().addPayment({
//     id: 'payment1',
//     amount: 100,
//     memberId: 'member1',
//     description: 'Dinner'