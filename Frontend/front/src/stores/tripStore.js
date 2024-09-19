import { create } from 'zustand';

export const useTripStore = create((set) => ({
  trip: {
    locations: [],   
    members: [],     
    payments: [],  
    startDate: '',
    endDate: '',  
  },

  setTrip: (locations, members, startDate, endDate) => set(() => ({
    trip: {
      locations: locations || [],
      members: members || [],
      payments: [],  
      startDate,
      endDate,
    }
  })),

  addPayment: (payment) => set((state) => ({
    trip: {
      ...state.trip,
      payments: [...state.trip.payments, payment],
    }
  })),

  updateMember: (memberId, updatedMember) => set((state) => ({
    trip: {
      ...state.trip,
      members: state.trip.members.map((member) =>
        member.id === memberId ? { ...member, ...updatedMember } : member
      ),
    }
  })),
}));

const initializeTrip = () => {
  useTripStore.getState().setTrip(
    ['South Korea', 'Japan'],
    [
      { id: 'member1', account: '123-456' }, 
      { id: 'member2', account: '789-012' }
    ],
    '2024-09-01', 
    '2024-09-10',
  );
};

const addPayment = () => {
  useTripStore.getState().addPayment({
    id: 'payment1',
    amount: 100,
    memberId: 'member1',
    description: 'Dinner'
  });
};