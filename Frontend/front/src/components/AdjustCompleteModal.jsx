import { React, useState, useEffect } from 'react';
import { Modal, Box, Typography, Backdrop, Fade, TextField } from '@mui/material';
import { useTripStore } from '@/stores/tripStore';
import CloseIcon from '@mui/icons-material/Close';
import { usePaymentStore } from '@/stores/paymentStore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import styles from './styles/Modal.module.css';

import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import AttractionsIcon from "@mui/icons-material/Attractions";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CafeIcon from "@mui/icons-material/LocalCafe";
import EtcIcon from "@mui/icons-material/MoreHoriz";

const AdjustCompleteModal = ({ isOpen, onClose, resultPayments, paymentId }) => {
  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);
  const getPartPayment = usePaymentStore((state) => state.getPartPayment);

  const [resultPayment, setResultPayment] = useState(null);
  const [partPayment, setPartPayment] = useState(null);

    // 카테고리별 아이콘 매핑
    const categoryIcons = {
      항공: <FlightIcon fontSize="large" />,
      숙소: <HotelIcon fontSize="large" />,
      관광: <AttractionsIcon fontSize="large" />,
      식비: <RestaurantIcon fontSize="large" />,
      쇼핑: <ShoppingBagIcon fontSize="large" />,
      교통: <DirectionsCarIcon fontSize="large" />,
      카페: <CafeIcon fontSize="large" />,
      기타: <EtcIcon fontSize="large" />,
    };

  // paymentId에 따른 정산 결과 내역
  useEffect(() => {
    if (isOpen) {
      setResultPayment(resultPayments.find((payment) => payment.payment_id === paymentId));
      setPartPayment(getPartPayment(paymentId));
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      console.log(resultPayment)
    }
  }, [isOpen, resultPayment])

  useEffect(() => {
    if (isOpen) {
      console.log(partPayment)
    }
  }, [isOpen, partPayment])

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

          {/* 결제 상세 내역 */}
          {partPayment && (
            <div>
              {categoryIcons[partPayment.category]} {partPayment.brand_name} {partPayment.pay_date} {partPayment.pay_time}
            </div>
          )}

          {/* 멤버별 정산 내역 */}
          {resultPayment && resultPayment.bills.map((bill, index) => (
            <div key={index}>
              {matchUserName(bill.user_id)} {bill.cost} {bill.remain_cost !== 0 && <WarningAmberIcon sx={{ color: 'orange' }} />}
            </div>
          ))}
        </div>
      </Fade>
    </Modal>
  )
}

export default AdjustCompleteModal;