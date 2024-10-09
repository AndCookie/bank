import { React, useState, useEffect } from 'react';
import { Modal, Box, Typography, Backdrop, Fade, TextField } from '@mui/material';
import { useTripStore } from '@/stores/tripStore';

import styles from './styles/Modal.module.css';

const AdjustCompleteModal = ({ isOpen, onClose, resultPayments, paymentId }) => {
  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  const [resultPayment, setResultPayment] = useState(null);

  // paymentId에 따른 정산 결과 내역
  useEffect(() => {
    if (isOpen) {
      setResultPayment(resultPayments.find((payment) => payment.payment_id === paymentId));
    }
  }, [isOpen])

  useEffect(() => {
    console.log(resultPayment)
  }, [resultPayment])

  // userId에 따른 이름 반환
  const matchUserName = (userId) => {
    const matchMember = tripDetailInfo.members.find((member) => member.id == userId);
    return matchMember ? `${matchMember.last_name}${matchMember.first_name}` : '';
  }

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

          {/* 멤버별 정산 내역 */}
          {resultPayment.bills.map((bill, index) => (
            <div key={index}>
              {matchUserName(bill.user_id)} {bill.cost} {bill.is_completed}
            </div>
          ))}
        </div>
      </Fade>
    </Modal>
  )
}

export default AdjustCompleteModal;