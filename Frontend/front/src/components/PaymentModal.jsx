import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton'; 
import CloseIcon from '@mui/icons-material/Close'; 
import { useParams } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { usePaymentStore } from '@/stores/paymentStore';
import styles from "./styles/PaymentModal.module.css";

const PaymentModal = ({ isOpen, onClose, onSubmitPrepare, onSubmitCash }) => {
  const { tripId } = useParams();
  const userInfo = useUserStore((state) => state.userInfo);
  const userAccount = useUserStore((state) => state.userAccount);
  const fetchPayments = usePaymentStore((state) => state.fetchPayments);
  const [amount, setAmount] = useState('');
  const [brandName, setBrandName] = useState('');
  const [payDate, setPayDate] = useState('');
  const [payTime, setPayTime] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // 현재 날짜와 시간을 기본값으로 설정
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // 'yyyy-mm-dd' 형식
      const formattedTime = today.toTimeString().split(' ')[0].substring(0, 5); // 'HH:mm' 형식
      
      setPayDate(formattedDate);
      setPayTime(formattedTime);
    }
  }, [isOpen]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSubmit = () => {
    if (tabIndex === 0) {
      onSubmitPrepare({
        trip_id: Number(tripId),
        amount: Number(amount),
        brand_name: brandName,
      });
    } else if (tabIndex === 1) {
      onSubmitCash({
        pay_date: payDate,
        pay_time: payTime,
        brand_name: brandName,
        bank_account: userAccount.bankAccount,
        amount: Number(amount),
      });
    }

    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.box} sx={{ ...modalStyle }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <div className={styles.title}>결제 내역 추가</div>
        
        <div className={styles.content}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="payment type tabs">
            <Tab label="사전 결제" />
            <Tab label="현금 결제" />
          </Tabs>

          {tabIndex === 0 && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="내용"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="금액"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </>
          )}

          {tabIndex === 1 && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="내용"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="금액"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="날짜"
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="시간"
                type="time"
                value={payTime}
                onChange={(e) => setPayTime(e.target.value)}
              />
            </>
          )}
        </div>

        <div className={styles.adjustContainer}>
          <button className={styles.adjustBtn} onClick={handleSubmit}>
            추 가 하 기
          </button>
        </div>

      </Box>
    </Modal>
  );
};

// 모달 스타일
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default PaymentModal;
