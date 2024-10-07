import { create } from 'zustand';

export const usePaymentStore = create((set, get) => ({
  // 정산을 위한 계산용 결제 내역
  payments: [],

  // 결제 내역 저장
  setPayments: (paymentsInfo) => set(() => ({
    payments: paymentsInfo
  })),

  // paymentId에 따른 결제 내역 조회하기
  getPayment: (paymentId) => {
    const payment = get().payments.find(payment => payment.id === paymentId);
    return payment
  },
  
  // payments에 데이터를 추가하는 함수
  // addPayments: (tripId, payments) => set((state) => ({
  //   payments: [...state.payments, { tripId, payments }]
  // })),
  
  // 특정 tripId에 맞는 payments를 가져오는 함수 (get을 사용)
  getPaymentsByTripId: (tripId) => {
    const paymentData = get().payments.find(p => p.tripId === tripId);
    return paymentData ? paymentData.payments : [];
  },
}));