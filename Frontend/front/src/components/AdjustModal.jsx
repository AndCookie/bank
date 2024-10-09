import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Modal, Box, Typography, Backdrop, Fade, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useTripStore } from '@/stores/tripStore';
import { usePaymentStore } from '@/stores/paymentStore';
import axiosInstance from '@/axios.js';
import styles from './styles/Modal.module.css';

const AdjustModal = ({ isOpen, onClose, totalAmount }) => {
  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  const payments = usePaymentStore((state) => state.payments);
  const setPayments = usePaymentStore((state) => state.setPayments);

  const finalPayments = usePaymentStore((state) => state.finalPayments);
  const setFinalPayments = usePaymentStore((state) => state.setFinalPayments);
  const addFinalPayments = usePaymentStore((state) => state.addFinalPayments);
  const updateFinalPayments = usePaymentStore((state) => state.updateFinalPayments);

  // 렌더링 되는 결제 내역 정보
  const [renderedInfo, setRenderedInfo] = useState([]);

  // 렌더링 되는 멤버별 정산 내역 정보
  const [renderedMemberInfo, setRenderedMemberInfo] = useState(tripDetailInfo.members.reduce((acc, member) => {
    acc[String(member.bank_account)] = 0;
    return acc;
  }, {}));

  useEffect(() => {
    if (isOpen) {
      console.log('FINAL', finalPayments)
    }
  }, [finalPayments, isOpen])

  useEffect(() => {
    console.log(renderedMemberInfo)
  }, [renderedMemberInfo])

  // 결제 내역 정보 렌더링
  useEffect(() => {
    if (isOpen) {
      setRenderedInfo([]);

      payments.forEach((payment) => {
        if (payment.checked) {
          setRenderedInfo((prevInfo) => [...prevInfo, {
            brandName: payment.brand_name,
            payDate: payment.pay_date,
            payTime: payment.pay_time,
          }])
        }
      })
    }
  }, [payments, isOpen])

  // 멤버별 정산 내역 정보 렌더링
  useEffect(() => {
    if (isOpen) {
      finalPayments.payments.forEach((finalPayment) => {
        const updatedBills = payments.find((payment) => payment.id === finalPayment.payment_id).bills;
        updateFinalPayments(finalPayment.payment_id, updatedBills)

        updatedBills.forEach((bill) => {
          console.log(bill)
          setRenderedMemberInfo((prevState) => {
            const newState = { ...prevState };
            if (newState[bill.bank_account] !== undefined) {
              newState[bill.bank_account] += bill.cost;
            }
            return newState;
          });
        })
      })
    }
  }, [payments, isOpen])

  // 여행 멤버별 정산 금액 매칭
  const matchBankAccount = (bankAccount) => {
    console.log(bankAccount)
    console.log(renderedMemberInfo)
    return renderedMemberInfo[bankAccount]
  };
  
  const navigate = useNavigate();
  const { tripId } = useParams();

  const goFinish = () => {    
    navigate(`/finish/${tripId}`)
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
          <div>{totalAmount}원</div>

          {/* 정산 체크한 결제 내역 */}
          {renderedInfo.map((data, index) => (
            <div key={index}>
              {data.brandName}
              {data.payDate}
              {data.payTime}
            </div>
          ))}

          {/* 정산 멤버 */}
          <div>정산대상</div>
          {tripDetailInfo.members.map((member, index) => (
            <div key={index}>
              {member.last_name}{member.first_name}
              <TextField
                disabled
                variant="filled"
                defaultValue={matchBankAccount(member.bank_account)}
              />
            </div>
          ))}

          <button onClick={goFinish}>정산하기</button>
        </div>
      </Fade>
    </Modal>
  );
}

export default AdjustModal;
