import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Modal, Box, Typography, Backdrop, Fade, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useUserStore } from '@/stores/userStore';
import { useTripStore } from '@/stores/tripStore';
import { usePaymentStore } from '@/stores/paymentStore';

import styles from './styles/Modal.module.css';

const OngoingModal = ({ isOpen, onClose, paymentId }) => {
  const userInfo = useUserStore((state) => state.userInfo);

  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  // 결제 내역 상세 정보
  const [partPayment, setPartPayment] = useState({});
  const getPartPayment = usePaymentStore((state) => state.getPartPayment);

  const payments = usePaymentStore((state) => state.payments);
  const setPayments = usePaymentStore((state) => state.setPayments);

  useEffect(() => {
    if (isOpen) {
      setPartPayment(getPartPayment(paymentId));
    }
  }, [isOpen])

  // 여행 멤버 수만큼 나누어 저장
  useEffect(() => {
    if (isOpen && payments.find(payment => payment.id === paymentId).bills.every(bill => bill.cost === 0)) {
      setPartPayment((prev) => ({
        ...prev,
        bills: tripDetailInfo.members.map((member) => ({
          cost: parseInt(partPayment.amount / tripDetailInfo.members.length),
          bank_account: member.bank_account
        }))
      }));
    }
  }, [partPayment.amount])

  // 여행 멤버별 정산 금액 매칭
  const matchBankAccount = (bankAccount) => {
    const targetBill = (partPayment.bills || []).find(bill => bill.bank_account === bankAccount);
    return targetBill ? targetBill.cost : 0;
  };

  // 여행 멤버별 정산 금액 조정
  const handleCostChange = (bankAccount, inputCost) => {
    const fixedCost = inputCost === '' ? 0 : parseInt(inputCost);
    const remainingCost = partPayment.amount - fixedCost;

    setPartPayment((prevPayment) => {
      const otherMembers = (prevPayment.bills).filter(bill => bill.bank_account !== bankAccount);
      const updatedBills = (prevPayment.bills).map(bill => {
        if (bill.bank_account === bankAccount) {
          return { ...bill, cost: fixedCost };
        } else {
          return { ...bill, cost: parseInt(remainingCost / otherMembers.length) };
        }
      });
      return { ...prevPayment, bills: updatedBills };
    });
  };
  
  // userId에 따른 이름 반환
  const matchUserName = () => {
    const matchMember = tripDetailInfo.members.find((member) => member.id == partPayment.user_id);
    return matchMember ? `${matchMember.last_name}${matchMember.first_name}` : '';
  }

  // 모달 창이 닫힐 때 payments에 저장하기
  useEffect(() => {
    if (!isOpen) {
      setPayments(payments.map((payment) => payment.id === partPayment.id ? partPayment : payment));
    }
  }, [isOpen])

  if (!isOpen) return null;

  // 결제 당사자가 아닐 경우
  if (userInfo.id != partPayment.user_id) {
    return (
      <Modal
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpen}>
          <div className={styles.box}>
            <CloseIcon className={styles.closeBtn} fontSize='large' onClick={onClose} />
            <div>{partPayment.amount}원</div>

            {/* 정산 체크한 결제 내역 */}
            <div>
              {partPayment.brand_name}
              {partPayment.pay_date}
              {partPayment.pay_time}
            </div>

            <div>결제 당사자만 정산 가능합니다</div>
            <div>{matchUserName()}</div>
          </div>
        </Fade>
      </Modal>
  )}

  // 결제 당사자일 경우
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isOpen}>
        <div className={styles.box}>
          <CloseIcon className={styles.closeBtn} fontSize='large' onClick={onClose} />
          <div>{partPayment.amount}원</div>

          {/* 정산 체크한 결제 내역 */}
          <div>
            {partPayment.brand_name}
            {partPayment.pay_date}
            {partPayment.pay_time}
          </div>

          {/* 정산 멤버 */}
          <div>정산대상</div>
          {tripDetailInfo.members.map((member, index) => (
            <div key={index}>
              {member.last_name}{member.first_name}
              <TextField
                variant="outlined"
                value={matchBankAccount(member.bank_account)}
                onChange={(e) => handleCostChange(member.bank_account, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Fade>
    </Modal>
  );
}

export default OngoingModal;
