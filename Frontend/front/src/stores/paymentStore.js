import { create } from 'zustand';

export const usePaymentStore = create((set, get) => ({
  payments: [],
  
  // payments에 데이터를 추가하는 함수
  addPayments: (tripId, payments) => set((state) => ({
    payments: [...state.payments, { tripId, payments }]
  })),
  
  // 특정 tripId에 맞는 payments를 가져오는 함수 (get을 사용)
  getPaymentsByTripId: (tripId) => {
    const paymentData = get().payments.find(p => p.tripId === tripId);
    return paymentData ? paymentData.payments : [];
  },
}));