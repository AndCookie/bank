import { create } from 'zustand';

export const usePaymentStore = create((set) => ({
  // 체크 여부가 추가된 결제 내역
  payments: [],

  // 체크 여부가 추가된 결제 내역 저장
  setPayments: (paymentsInfo) => set(() => ({
    payments: paymentsInfo
  })),

  // 정산을 위해 체크한 결제 계산 내역
  calculatedPayments: {},

  // 정산을 위해 체크한 결제 계산 내역의 tripId 설정
  setCalculatedPayments: (tripId) => set(() => ({
    calculatedPayments: {
      trip_id: tripId,
      payments: [],
    }
  })),

  // 체크한 결제 내역 추가
  addCalculatedPayments: (paymentId, bills) => set((state) => ({
    calculatedPayments: {
      ...state.calculatedPayments,
      payments: [
        ...state.calculatedPayments.payments,
        { payment_id: paymentId, bills }
      ]
    }
  })),

  // 체크 해제한 결제 내역 삭제
  removeCalculatedPayments: (paymentId) => set((state) => ({
    calculatedPayments: {
      ...state.calculatedPayments,
      payments: state.calculatedPayments.payments.filter(payment => payment.payment_id !== paymentId)
    }
  })),

  // paymentId에 따른 결제 내역 조회하기
  // getPayment: (paymentId) => {
  //   const payment = get().payments.find(payment => payment.id === paymentId);
  //   return payment
  // },

  // payments에 데이터를 추가하는 함수
  // addPayments: (tripId, payments) => set((state) => ({
  //   payments: [...state.payments, { tripId, payments }]
  // })),

  // 특정 tripId에 맞는 payments를 가져오는 함수 (get을 사용)
}));