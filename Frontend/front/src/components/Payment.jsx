import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { useTripStore } from '@/stores/tripStore';
import { useUserStore } from '@/stores/userStore';
import { usePaymentStore } from '@/stores/paymentStore';

import OngoingModal from '@/components/OngoingModal';
import AdjustModal from '@/components/AdjustModal';

import Checkbox from '@mui/material/Checkbox';

const Payment = ({ paymentsData, selectedDate }) => {
  const { tripId } = useParams();
  const tripDetailInfo = {
    id: tripId,
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

  const finalPayments = usePaymentStore((state) => state.finalPayments);
  const setFinalPayments = usePaymentStore((state) => state.setFinalPayments);
  const addFinalPayments = usePaymentStore((state) => state.addFinalPayments);
  const removeFinalPayments = usePaymentStore((state) => state.removeFinalPayments);

  // 정산 여부 판단
  const [isCompleted, setIsCompleted] = useState(0);
  
  // 선택한 상세 결제 내역 Id
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    
  // 최종 정산 금액
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setFinalPayments(tripDetailInfo.id);
  }, [tripDetailInfo.id])

  useEffect(() => {
    // 인원별 정산 금액과 체크 여부를 담기 위한 임시 변수
    const updatedPaymentsData = paymentsData.map((payment) => {
      const membersData = tripDetailInfo.members.map(member => ({
        cost: 0,
        bank_account: member.bank_account
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
          setTotalAmount(prev => prev + amount);

          // calculatedPayments에서 paymentId에 해당하는 데이터 추가
          // const bills = tripDetailInfo.members.map((member) => ({
          //   cost: 0,
          //   bank_account: member.bank_account,
          // }));

          addFinalPayments(paymentId);
        } else {
          setTotalAmount(prev => prev - amount);
          removeFinalPayments(paymentId)
        }
        return { ...payment, checked: checked };
      }
      return payment;
    });

    setPayments(updatedPaymentsData);
  };

  // 디버깅
  useEffect(() => {
    console.log(finalPayments);
  }, [finalPayments])

  useEffect(() => {
    console.log(payments);
  }, [payments])

  // 결제내역 상세 정보 모달 창
  const [isOngoingOpen, setisOngoingOpen] = useState(false);
  
  // 체크한 결제내역 정산 모달 창
  const [isAdjustOpen, setisAdjustOpen] = useState(false);

  const openOngoingModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setisOngoingOpen(true);
  }

  const closeOngoingModal = () => {
    setisOngoingOpen(false);
  }

  const openAdjustModal = () => {
    setisAdjustOpen(true);
  }

  const closeAdjustModal = () => {
    setisAdjustOpen(false);
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

      <button onClick={openAdjustModal}>{totalAmount}원 정산하기</button>

      {/* 결제내역 상세 정보 모달 창 */}
      <OngoingModal isOpen={isOngoingOpen} onClose={closeOngoingModal} paymentId={selectedPaymentId} />

      {/* 결제내역 상세 정보 모달 창 */}
      <AdjustModal isOpen={isAdjustOpen} onClose={closeAdjustModal} totalAmount={totalAmount} />
    </>
  )
}

export default Payment;