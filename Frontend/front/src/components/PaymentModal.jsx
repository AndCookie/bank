import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useParams } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

const PaymentModal = ({ isOpen, onClose, onSubmitPrepare, onSubmitCash }) => {
  // useParams로 URL에서 tripId 받아오기
  const { tripId } = useParams();
  const bankAccount = useUserStore((state) => state.userInfo.bankAccount);

  const [amount, setAmount] = useState('');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [payDate, setPayDate] = useState('');
  const [payTime, setPayTime] = useState('');

  // 탭 상태 (0: 여행 시작 전 결제, 1: 현금 결제)
  const [tabIndex, setTabIndex] = useState(0);

  // 탭 변경 시 호출
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSubmit = () => {
    if (tabIndex === 0) {
      // 여행 시작 전 결제 내역
      onSubmitPrepare({
        trip_id: Number(tripId),
        amount: Number(amount),
        brand_name: brandName,
        category: category,
      });
    } else if (tabIndex === 1) {
      // 현금 결제 내역
      onSubmitCash({
        pay_date: payDate,
        pay_time: payTime,
        brand_name: brandName,
        bank_account: bankAccount, // userStore에서 bankAccount 가져오기
        amount: Number(amount),
      });
    }

    // 모달 닫기
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <h2>결제 내역 추가</h2>

        {/* 탭 컴포넌트 */}
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="payment type tabs">
          <Tab label="여행 준비 결제" />
          <Tab label="현금 결제" />
        </Tabs>

        {/* 여행 시작 전 결제 (탭 0) */}
        {tabIndex === 0 && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Category"
              select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="항공">항공</option>
              <option value="숙소">숙소</option>
              <option value="교통">교통</option>
              <option value="식비">식비</option>
              <option value="카페">카페</option>
              <option value="쇼핑">쇼핑</option>
              <option value="관광">관광</option>
              <option value="기타">기타</option>
            </TextField>
          </>
        )}

        {/* 현금 결제 (탭 1) */}
        {tabIndex === 1 && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Pay Date"
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Pay Time"
              type="time"
              value={payTime}
              onChange={(e) => setPayTime(e.target.value)}
            />
          </>
        )}

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          제출
        </Button>
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
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default PaymentModal;
