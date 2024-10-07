import { React, useState, useEffect } from 'react';
import { Modal, Box, Typography, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { usePaymentStore } from '@/stores/paymentStore';

import styles from './styles/Modal.module.css';

const OngoingModal = ({ isOpen, onClose, paymentId }) => {
  const [payment, setPayment] = useState(null);
  const getPayment = usePaymentStore((state) => state.getPayment);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && paymentId) {
      setPayment(getPayment(paymentId))
      setLoading(false);
    }
  }, [isOpen, paymentId, getPayment]);

  useEffect(() => {
    console.log(payment)
  }, [payment])

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
          {loading ? (
            <div />
          ) : (
            <div>
              <div>{payment.amount}원</div>
              <div>{payment.brand_name}원</div>
              <div>{payment.pay_date}원</div>
              <div>{payment.pay_time}원</div>
              <div>결제자 {payment.username}</div>
              <div>정산대상</div>
              {payment.bills.map((data, index) => (
                <div key={index} className="d-flex">
                  <div>{data.member} {data.cost}원</div>
                </div>
              ))}
            </div>)}
        </div>
      </Fade>
    </Modal>
  );
}

export default OngoingModal;
