import { React, useState, useEffect } from 'react';
import { Modal, Box, Typography, Backdrop, Fade, TextField } from '@mui/material';
import { useTripStore } from '@/stores/tripStore';
import CloseIcon from '@mui/icons-material/Close';

import styles from "./styles/AdjustCompleteModal.module.css";

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

  // 날짜 포맷팅 함수
  const formatPayDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

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
        <div
          className={styles.box}
          onClick={(e) => e.stopPropagation()} // Modal 내부 클릭 시 이벤트 전파 방지
        >
         <CloseIcon
            className={styles.closeBtn}
            fontSize="large"
            onClick={onClose}
          />

          {/* 멤버별 정산 내역 */}
          <div className={styles.memberList}>
            {resultPayment && resultPayment.bills.map((bill, index) => (
              <div className={styles.member} key={index}>
                {matchUserName(bill.user_id)} {bill.cost} {bill.is_completed}
              </div>
            ))}
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default AdjustCompleteModal;