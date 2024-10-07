import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Modal, Box, Typography, Backdrop, Fade, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { usePaymentStore } from '@/stores/paymentStore';

import styles from './styles/Modal.module.css';

const OngoingModal = ({ isOpen, onClose, paymentId, totalAmount }) => {
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

  // 개별 결제 내역
  const [partPayment, setPartPayment] = useState(0);
  const getPayment = usePaymentStore((state) => state.getPayment);
  const setPayments = usePaymentStore((state) => state.setPayments);

  const payments = usePaymentStore((state) => state.payments);
  // const calculatedPayments = usePaymentStore((state) => state.calculatedPayments);

  useEffect(() => {
    console.log(payments)
  }, [payments])

  // 모달 창에 렌더링 되는 결제 금액
  const [renderedAmount, setRenderedAmount] = useState(0);

  useEffect(() => {
    if (isOpen && paymentId !== 'adjust') {
      // paymentId에 해당하는 결제 내역
      const updatedPayment = payments.find(ele => ele.id === paymentId);

      const updatedBills = updatedPayment.bills.map(bill => ({
        ...bill,
        cost: parseInt(renderedAmount / updatedPayment.bills.length),
      }));

      setPayments(payments.map(ele =>
        ele.id === paymentId ? { ...ele, bills: updatedBills } : ele
      ));
    }
  }, [isOpen, paymentId])

  // 여행 멤버별 정산 금액 조정
  const [finalPayments, setFinalPayments] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setPartPayment(getPayment(paymentId))
    }
  }, [setPartPayment, paymentId])

  useEffect(() => {
    if (isOpen) {
      if (paymentId === 'adjust') {
        setRenderedAmount(totalAmount);
      } else {
        setRenderedAmount(partPayment.amount);
      }
    }
  }, [partPayment])

  // useEffect(() => {
  //   setPayments(
  //     tripDetailInfo.members.map((member) => ({
  //       cost: totalAmount / tripDetailInfo.members.length,
  //       bank_account: member.bank_account
  //     }))
  //   );
  // }, [totalAmount, tripDetailInfo.members.length]);

  // 정산 체크한 내역
  // const [checkedPayments, setCheckedPayments] = useState([]);

  // useEffect(() => {
  //   setCheckedPayments(payments.filter(payment => payment.checked === true));
  // }, [payments, setCheckedPayments])

  // 여행 멤버별 정산 금액 매칭
  // const matchBankAccount = (bankAccount) => {
  //   return finalPayments.find(info => info.bank_account === bankAccount).cost;
  // };

  // 여행 멤버별 정산 금액 조정
  const handleCostChange = (bankAccount, inputCost) => {
    const fixedCost = inputCost === '' ? 0 : parseInt(inputCost);
    const remainingTotalPayment = totalAmount - fixedCost;

    // bankAccount의 cost를 변경하고, 나머지 멤버에게 cost 재분배
    setFinalPayments(prevPayments => {
      const otherMembers = prevPayments.filter(payment => payment.bank_account !== bankAccount);
      const updatedPayments = prevPayments.map(payment => {
        if (payment.bank_account === bankAccount) {
          return { ...payment, cost: fixedCost };
        } else {
          return { ...payment, cost: parseInt(remainingTotalPayment / otherMembers.length) };
        }
      });
      return updatedPayments;
    });
  };

  // const navigate = useNavigate();
  // const { tripId } = useParams();

  // const toFinish = () => {
  //   navigate(`/finish/${tripId}`);
  // }

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
          <div>{renderedAmount}원</div>

          {/* 정산 체크한 결제 내역 */}
          {/* {checkedPayments.map((payment) => (
            <div key={payment.id}>{payment.brand_name} {payment.pay_date} {payment.pay_time}</div>
          ))} */}

          <div>정산대상</div>
          {tripDetailInfo.members.map((member, index) => (
            <div key={index}>
              {member.member}
              <TextField
                variant="outlined"
                // value={matchBankAccount(member.bank_account)}
                onChange={(e) => handleCostChange(member.bank_account, e.target.value)}
              />
            </div>
          ))}

          {/* <button onClick={toFinish} >정산하기</button> */}
        </div>
      </Fade>
    </Modal>
  );
}

export default OngoingModal;
