import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { useTripStore } from '@/stores/tripStore';
import { useUserStore } from '@/stores/userStore';
import { usePaymentStore } from '@/stores/paymentStore';
import OngoingModal from '@/components/OngoingModal';

import Checkbox from '@mui/material/Checkbox';

const Payment = ({ paymentsData, selectedDate }) => {
  const tripDetailInfo = {
    startDate: "2024-08-19",
    members: [
      {
        "member": "김신한",
        "bank_account": "0880493544778029",
        "bank_name": "신한은행",
        "balance": "7192236"
      },
      {
        "member": "박준영",
        "bank_account": "0886984969930397",
        "bank_name": "신한은행",
        "balance": "6848235"
      },
      {
        "member": "이선재",
        "bank_account": "0885399658115105",
        "bank_name": "신한은행",
        "balance": "9703466"
      },
      {
        "member": "임광영",
        "bank_account": "0882137908931580",
        "bank_name": "신한은행",
        "balance": "5359931"
      },
      {
        "member": "정태완",
        "bank_account": "0885969348355476",
        "bank_name": "신한은행",
        "balance": "6304116"
      }
    ]
  }

  const userInfo = useUserStore((state) => state.userInfo);
  // const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);
  const payments = usePaymentStore((state) => state.payments);
  const setPayments = usePaymentStore((state) => state.setPayments);

  // 정산 여부 판단
  const [isCompleted, setIsCompleted] = useState(0);

  // 상세 결제 내역 Id
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  // 최종 정산 금액
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    // 인원별 정산 금액과 체크 여부를 담기 위한 임시 변수
    const updatedPaymentsData = paymentsData.map((payment) => {
      const membersData = tripDetailInfo.members.map(member => ({
        cost: 0,
        member: member.member,
        bankAccount: member.bank_account
      }));

      return {
        ...payment,
        bills: membersData,
        checked: false,
      };
    });

    setPayments(updatedPaymentsData)
  }, [setPayments])

  // 필터링 된 결제 내역
  const filteredPayments = payments.filter((payment) => {
    // 전체 기간 조회
    if (selectedDate === 'all') {
      return true;
      // 준비 기간 조회
    } else if (selectedDate === 'prepare') {
      return new Date(payment.pay_date) < tripDetailInfo.startDate;
      // 특정 날짜 조회
    } else {
      return new Date(payment.pay_date).toDateString() === new Date(selectedDate).toDateString();
    }
    // 정산 여부 조회
  }).filter((payment) => {
    return payment.is_completed === isCompleted;
  });

  // 정산 내역 체크
  const handleCheck = (paymentId, amount) => {
    // 정산 체크 상태 변경을 담기 위한 임시 변수
    const updatedPaymentsData = payments.map((payment) => {
      if (payment.id === paymentId) {
        const checked = !payment.checked;
        if (checked) {
          setTotalPayment(prev => prev + amount);
        } else {
          setTotalPayment(prev => prev - amount);
        }
        return { ...payment, checked: checked };
      }
      return payment;
    });

    setPayments(updatedPaymentsData);
  };

  // 진행 중인 여행 정산 모달 창
  const [isOngoingOpen, setisOngoingOpen] = useState(false);

  const openOngoingModal = (paymentId) => {
    setSelectedPaymentId(paymentId)
    setisOngoingOpen(true);
  }

  const closeOngoingModal = () => {
    setisOngoingOpen(false);
  }

  return (
    <>
      <div>
        <button onClick={() => setIsCompleted(0)}>미정산</button>
        <button onClick={() => setIsCompleted(1)}>정산완료</button>
      </div>

      {filteredPayments.map((data) => (
        <div key={data.id} className="d-flex">
          <div onClick={() => openOngoingModal(data.id)}>{data.pay_date} {data.amount} {data.username}</div>
          <div>{data.username === userInfo.nickName && <Checkbox checked={data.checked} onChange={() => handleCheck(data.id, data.amount)} />}</div>
        </div>
      ))}

      {totalPayment}원

      {/* 진행 중인 여행 정산 모달 창 */}
      <OngoingModal isOpen={isOngoingOpen} onClose={closeOngoingModal} paymentId={selectedPaymentId} />
    </>
  )

}

export default Payment;