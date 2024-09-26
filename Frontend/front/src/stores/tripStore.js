import { create } from 'zustand';

export const useTripStore = create((set) => ({
  locations: [],  // 기본값으로 빈 배열 설정
  members: [],
  payments: [],
  startDate: '',
  endDate: '',

  setTrip: (locations, members, startDate, endDate) => set(() => ({
    locations: locations || [],
    members: members || [],
    payments: [],
    startDate,
    endDate,
  })),

  addPayment: (payment) => set((state) => ({
    payments: [...state.payments, payment],
  })),

  updateMember: (memberId, updatedMember) => set((state) => ({
    members: state.members.map((member) =>
      member.id === memberId ? { ...member, ...updatedMember } : member
    ),
  })),

  clearTrip: () => set(() => ({
    locations: [],
    members: [],
    payments: [],
    startDate: '',
    endDate: '',
  })),
}));
