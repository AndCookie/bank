import { React, useState, useEffect } from 'react';
import { Modal, Box, Typography, Backdrop, Fade, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { usePaymentStore } from '@/stores/paymentStore';

import styles from './styles/Modal.module.css';

const OngoingModal = ({ isOpen, onClose, totalPayment }) => {
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

  // const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);
  const payments = usePaymentStore((state) => state.payments);
  const calculatedPayments = usePaymentStore((state) => state.calculatedPayments);

  // 여행 멤버별 정산 금액 조정
  const [finalPayments, setFinalPayments] = useState(
    tripDetailInfo.members.map((member) => ({
      cost: totalPayment / tripDetailInfo.members.length,
      bank_account: member.bank_account
    })));

  // 정산 체크한 내역
  const [checkedPayments, setCheckedPayments] = useState([]);

  // 여행 멤버별 정산 금액 매칭
  const matchBankAccount = (bankAccount) => {
    return finalPayments.find(info => info.bank_account === bankAccount).cost;
  };

  useEffect(() => {
    setCheckedPayments(payments.filter(payment => payment.checked === true));
  }, [payments, setCheckedPayments])

  if (!isOpen) return null;

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
          <div>{totalPayment}원</div>

          {/* 정산 체크한 결제 내역 */}
          {checkedPayments.map((payment) => (
            <div key={payment.id}>{payment.brand_name} {payment.pay_date} {payment.pay_time}</div>
          ))}

          <div>정산대상</div>
          {tripDetailInfo.members.map((member, index) => (
            <div key={index}>
              {member.member}
              <TextField
                variant="outlined"
                value={matchBankAccount(member.bank_account)}
                
              />
            </div>
          ))}
        </div>
      </Fade>
    </Modal>
  );
}

export default OngoingModal;
