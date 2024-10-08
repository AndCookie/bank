import { create } from 'zustand';
import axiosInstance from '@/axios';

export const usePaymentStore = create((set, get) => ({
  // 결제 내역
  payments: [],

  // 결제 내역 저장 및 bills 추가
  setPayments: (paymentsInfo) => {
    const updatedPayments = paymentsInfo.map(payment => {
      // bills 필드를 추가 (필요한 로직에 맞게 처리)
      const bills = payment.bills || [];
      return { ...payment, bills };
    });

    set(() => ({
      payments: updatedPayments,
    }));
  },

  // 정산을 위해 체크한 결제 계산 내역
  finalPayments: {},

  setFinalPayments: (tripId) => set(() => ({
    finalPayments: {
      trip_id: tripId,
      payments: [],
    }
  })),

  // 기타 로직 생략
  // tripId에 따른 여행 결제내역 axios 요청
  fetchPayments: async (tripId) => {
    try {
      const response = await axiosInstance.get('/payments/list/', {
        params: {
          trip_id: tripId
        }
      });
      const { data } = response;
      return data;

      // 여행 결제내역 저장
      // usePaymentStore.getState().setPayments(data);
    } catch (error) {
      console.log(error);
    }
  },
}));

