import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Modal,
  Box,
  Typography,
  Backdrop,
  Fade,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useUserStore } from '@/stores/userStore';
import { useTripStore } from '@/stores/tripStore';
import { usePaymentStore } from '@/stores/paymentStore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


import styles from "./styles/OngoingModal.module.css";

import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import AttractionsIcon from "@mui/icons-material/Attractions";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CafeIcon from "@mui/icons-material/LocalCafe";
import EtcIcon from "@mui/icons-material/MoreHoriz";

const OngoingModal = ({ isOpen, onClose, paymentId, isCompleted }) => {
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
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isCompleted && partPayment.length) {
      setPartPayment((prev) => ({
        ...prev,
        bills: partPayment.calculates.map((calculate) => ({
          cost: calculate.cost,
          bank_account: tripDetailInfo.members.find((member) => member.id === calculate.user_id).bank_account,
        })),
      }))
    }
  }, [isOpen, isCompleted, partPayment])

  // 여행 멤버 수만큼 나누어 저장
  useEffect(() => {
    if (isOpen && !isCompleted && payments.find(payment => payment.id === paymentId).bills.every(bill => bill.cost === 0)) {
      // 첫 정산의 경우
      if (payments.find(payment => payment.id === paymentId).calculates.length === 0) {
        const baseCost = parseInt(partPayment.amount / tripDetailInfo.members.length);
        const totalCost = baseCost * tripDetailInfo.members.length;

        setPartPayment((prev) => ({
          ...prev,
          bills: tripDetailInfo.members.map((member, index) => ({
            cost: index === 0 ? baseCost + partPayment.amount - totalCost : baseCost,
            bank_account: member.bank_account
          }))
        }));
        // 첫 정산이 아닌 경우
      } else {
        setPartPayment((prev) => ({
          ...prev,
          bills: tripDetailInfo.members.map((member, index) => ({
            cost: payments.find(payment => payment.id === paymentId).calculates.find(calculate => calculate.user_id === member.id).remain_cost,
            bank_account: member.bank_account
          }))
        }));
      }
    }
  }, [partPayment.amount]);

  // useEffect(() => {
  //   console.log(partPayment)
  // }, [partPayment])

  // 여행 멤버별 정산 금액 매칭
  const matchBankAccount = (bankAccount, userId) => {
    if (!isCompleted) {
      const targetBill = (partPayment.bills || []).find(
        (bill) => bill.bank_account === bankAccount
      );
      return targetBill ? targetBill.cost : 0;
    } else {
      const targetBill = (partPayment.calculates || []).find(
        (calculate) => calculate.user_id === userId
      );
      return targetBill ? targetBill.cost : 0;
    }
  };

  // 여행 멤버별 정산 금액 조정
  const handleCostChange = (bankAccount, inputCost) => {
    const fixedCost = inputCost === '' ? 0 : parseInt(inputCost);

    let remainingCost;
    if (partPayment.calculates.length === 0) {
      remainingCost = partPayment.amount - fixedCost;
    } else {
      remainingCost = partPayment.calculates.reduce((acc, calculate) => acc + calculate.remain_cost, 0) - fixedCost;
    }

    setPartPayment((prevPayment) => {
      const firstMember = prevPayment.bills[0];
      const isFirstMemberBeingAdjusted = firstMember.bank_account === bankAccount;

      const otherMembers = prevPayment.bills.filter(bill => bill.bank_account !== bankAccount);

      const updatedBills = prevPayment.bills.map((bill, index) => {
        if (bill.bank_account === bankAccount) {
          // 입력된 금액을 조정 중인 사람의 cost 업데이트
          return { ...bill, cost: fixedCost };
        } else if (index === 0 && !isFirstMemberBeingAdjusted) {
          // 첫 번째 사람이 조정 중이 아니면, 첫 번째 사람에게 남은 차액 할당
          return { ...bill, cost: parseInt(remainingCost / otherMembers.length) + (remainingCost % otherMembers.length) };
        } else if (index === 1 && isFirstMemberBeingAdjusted) {
          // 첫 번째 사람이 조정 중이면, 두 번째 사람에게 남은 차액 할당
          return { ...bill, cost: parseInt(remainingCost / otherMembers.length) + (remainingCost % otherMembers.length) };
        } else {
          // 나머지 사람들에게 남은 금액을 균등하게 분배
          return { ...bill, cost: parseInt(remainingCost / otherMembers.length) };
        }
      });
      return { ...prevPayment, bills: updatedBills };
    });
  };

  // userId에 따른 이름 반환
  const matchUserName = () => {
    const matchMember = tripDetailInfo.members.find(
      (member) => Number(member.id) === Number(partPayment.user_id)
    );
    return matchMember
      ? `${matchMember.last_name}${matchMember.first_name}`
      : "";
  };

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

  // 모달 창이 닫힐 때 payments에 저장하기
  useEffect(() => {
    if (!isOpen) {
      setPayments(
        payments.map((payment) =>
          payment.id === partPayment.id ? partPayment : payment
        )
      );
    }
  }, [isOpen]);

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
            <CloseIcon
              className={styles.closeBtn}
              fontSize="large"
              onClick={onClose}
            />
            <div className={styles.totalAmount}>
              {(partPayment.amount !== undefined && partPayment.amount !== null)
                ? partPayment.amount.toLocaleString()
                : '0'}&nbsp;원
            </div>


            {/* 정산 체크한 결제 내역 */}
            <div className={styles.content}>
              <div className={styles.category}>
                {categoryIcons[partPayment.category]}
              </div>
              <div className={styles.brandName}>{partPayment.brand_name}</div>
              <div className={styles.payRecord}>
                <div className={styles.payDate}>
                  {formatPayDate(partPayment.pay_date)}
                </div>
                <div className={styles.payTime}>{partPayment.pay_time}</div>
              </div>
            </div>

            {/* 정산 멤버 */}
            <div className={styles.memberList}>
              {partPayment.calculates && partPayment.calculates.length > 0 &&
                <>
                  {tripDetailInfo.members.map((member, index) => (
                    <div className={styles.member} key={index}>
                      <div className={styles.memberName}>
                        {partPayment.calculates.length &&
                          partPayment.calculates.find((calculate) => calculate.user_id == member.id).remain_cost > 0 &&
                          <WarningAmberIcon sx={{ color: 'orange' }} />}
                        {member.last_name}
                        {member.first_name}
                      </div>
                      <TextField
                        disabled
                        variant={isCompleted === 1 ? 'outlined' : 'outlined'}
                        value={matchBankAccount(member.bank_account, member.id)}
                        onChange={(e) => handleCostChange(member.bank_account, e.target.value)}
                        className={styles.customTextField}
                        InputProps={{
                          style: {
                            height: "40px", // 원하는 높이로 조정
                            width: "120px", // 원하는 너비로 조정
                          },
                        }}
                        inputProps={{
                          style: {
                            backgroundColor: "lightgrey",
                            padding: "8px",
                            borderRadius: "5px",
                            textAlign: "right", // 텍스트를 오른쪽 정렬
                          },
                        }}
                      />
                      <div className={styles.won}>
                        &nbsp; 원
                      </div>
                    </div>
                  ))}
                </>
              }
            </div>


            {<div className={styles.memberList}>
              결제 당사자 <div className={styles.payMember}>{matchUserName()}</div>님만<br />{isCompleted ? '수정' : '정산'}할 수 있어요
            </div>
            }
          </div>
        </Fade>
      </Modal>
    )
  }

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
          <CloseIcon
            className={styles.closeBtn}
            fontSize="large"
            onClick={onClose}
          />
          <div className={styles.totalAmount}>
            {(partPayment.amount !== undefined && partPayment.amount !== null)
              ? partPayment.amount.toLocaleString()
              : '0'}&nbsp;원
          </div>


          {/* 정산 체크한 결제 내역 */}
          <div className={styles.content}>
            <div className={styles.category}>
              {categoryIcons[partPayment.category]}
            </div>
            <div className={styles.brandName}>{partPayment.brand_name}</div>
            <div className={styles.payRecord}>
              <div className={styles.payDate}>
                {formatPayDate(partPayment.pay_date)}
              </div>
              <div className={styles.payTime}>{partPayment.pay_time}</div>
            </div>
          </div>

          {/* 정산 멤버 */}
          <div className={styles.memberList}>
            {tripDetailInfo.members.map((member, index) => {
              const calculate = partPayment.calculates.find((calculate) => Number(calculate.user_id) === Number(member.id));
              return (
                <div className={styles.member} key={index}>
                  <div className={styles.memberName}>
                  {calculate && calculate.remain_cost > 0 && (
                    <WarningAmberIcon sx={{ color: 'orange' }} />
                  )}
                    {member.last_name}
                    {member.first_name}
                  </div>
                  <TextField
                    // disabled={isCompleted === 1}
                    variant={isCompleted === 1 ? 'outlined' : 'outlined'}
                    value={matchBankAccount(member.bank_account, member.id)}
                    onChange={(e) => handleCostChange(member.bank_account, e.target.value)}
                    className={styles.customTextField}
                    InputProps={{
                      style: {
                        height: "40px", // 원하는 높이로 조정
                        width: "120px", // 원하는 너비로 조정
                      },
                    }}
                    inputProps={{
                      style: {
                        backgroundColor: "lightgrey",
                        padding: "8px",
                        borderRadius: "5px",
                        textAlign: "right", // 텍스트를 오른쪽 정렬
                      },
                    }}
                  />
                  &nbsp; 원
                </div>
              );
            })}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default OngoingModal;
