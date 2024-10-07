import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { useTripStore } from '@/stores/tripStore';
import { useUserStore } from '@/stores/userStore';
import { usePaymentStore } from '@/stores/paymentStore';

import OngoingModal from '@/components/OngoingModal';
import Checkbox from '@mui/material/Checkbox';

const Payment = ({ paymentsData, selectedDate }) => {
  const { tripId } = useParams();
  const tripDetailInfo = {
    id: tripId,
    startDate: "2024-08-19",
    members: [
      // ...
    ]
  };

  const userInfo = useUserStore((state) => state.userInfo);
  const payments = usePaymentStore((state) => state.payments);
  const setPayments = usePaymentStore((state) => state.setPayments);
  const calculatedPayments = usePaymentStore((state) => state.calculatedPayments);
  const setCalculatedPayments = usePaymentStore((state) => state.setCalculatedPayments);
  const addCalculatedPayments = usePaymentStore((state) => state.addCalculatedPayments);
  const removeCalculatedPayments = usePaymentStore((state) => state.removeCalculatedPayments);

  // 정산 여부 판단
  const [isCompleted, setIsCompleted] = useState(0);

  // 최종 정산 금액
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    // paymentsData가 유효할 경우에만 map 실행
    if (paymentsData) {
      const updatedPaymentsData = paymentsData.map((payment) => ({
        ...payment,
        checked: false,
      }));
      setPayments(updatedPaymentsData);
    }
  }, [paymentsData, setPayments]);

  useEffect(() => {
    setCalculatedPayments(tripDetailInfo.id);
  }, [tripDetailInfo.id, setCalculatedPayments]);

  // payments가 정의되어 있는지 체크하고 처리
  const filteredPayments = (payments || []).filter((payment) => {
    if (selectedDate === 'all') {
      return true;
    } else if (selectedDate === 'prepare') {
      return new Date(payment.pay_date) < new Date(tripDetailInfo.startDate);
    } else {
      return new Date(payment.pay_date).toDateString() === new Date(selectedDate).toDateString();
    }
  }).filter((payment) => payment.is_completed === isCompleted);

  // 정산 내역 체크
  const handleCheck = (paymentId, amount) => {
    const updatedPaymentsData = payments.map((payment) => {
      if (payment.id === paymentId) {
        const checked = !payment.checked;
        if (checked) {
          setTotalPayment((prev) => prev + amount);
          const bills = tripDetailInfo.members.map((member) => ({
            cost: 0,
            bank_account: member.bank_account,
          }));
          addCalculatedPayments(paymentId, bills);
        } else {
          setTotalPayment((prev) => prev - amount);
          removeCalculatedPayments(paymentId);
        }
        return { ...payment, checked };
      }
      return payment;
    });

    setPayments(updatedPaymentsData);
  };

  return (
    <>
      <div>
        <button onClick={() => setIsCompleted(0)}>미정산</button>
        <button onClick={() => setIsCompleted(1)}>정산완료</button>
      </div>

      {filteredPayments.map((data) => (
        <div key={data.id} className="d-flex">
          <div>{data.pay_date} {data.amount} {data.username}</div>
          <div>
            {data.username === userInfo.nickName && (
              <Checkbox
                checked={data.checked}
                onChange={() => handleCheck(data.id, data.amount)}
              />
            )}
          </div>
        </div>
      ))}

      <button onClick={() => console.log('정산하기')}>{totalPayment}원 정산하기</button>
    </>
  );
};

export default Payment;
