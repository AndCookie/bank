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
  const [renderedMemberInfo, setRenderedMemberInfo] = useState(tripDetailInfo.members.map(member => {
    return {
      // member: member.member,
      bankAccount: member.bank_account,
      cost: 0
    };
  }));

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
      setRenderedMemberInfo(tripDetailInfo.members.map(member => {
        return {
          bankAccount: member.bank_account,
          cost: 0
        };
      }));

      finalPayments.payments.forEach((finalPayment) => {
        const updatedBills = payments.find((payment) => payment.id === finalPayment.payment_id).bills;

        // 체크 표시를 하고 세부 가격을 설정하지 않았을 경우
        if (updatedBills.every(bill => bill.cost === 0)) {
          // 첫 정산일 경우
          if (payments.find((payment) => payment.id === finalPayment.payment_id).calculates.length === 0) {
            const paymentAmount = payments.find((payment) => payment.id === finalPayment.payment_id).amount;
            const baseCost = parseInt(paymentAmount / updatedBills.length);
            const totalCost = baseCost * updatedBills.length;

            const newUpdatedBills = updatedBills.map((bill, index) => ({
              ...bill,
              cost: index === 0 ? baseCost + paymentAmount - totalCost : baseCost,
            }))

            updateFinalPayments(finalPayment.payment_id, newUpdatedBills)
            newUpdatedBills.forEach(bill => {
              renderedMemberInfo.find(member => member.bankAccount === bill.bank_account).cost += bill.cost;
            });
          // 첫 정산이 아닐 경우
          } else {
            const newUpdatedBills = updatedBills.map((bill) => ({
              ...bill,
              cost: payments.find((payment) => payment.id === finalPayment.payment_id).calculates.find((calculate) => calculate.user_id == tripDetailInfo.members.find((member) => member.bank_account == bill.bank_account).id).remain_cost,
            }))
            updateFinalPayments(finalPayment.payment_id, newUpdatedBills)
            newUpdatedBills.forEach(bill => {
              renderedMemberInfo.find(member => member.bankAccount === bill.bank_account).cost += bill.cost;
            });
          }
          // 세부 가격을 설정했을 경우
        } else {
          updateFinalPayments(finalPayment.payment_id, updatedBills)
          updatedBills.forEach(bill => {
            renderedMemberInfo.find(member => member.bankAccount === bill.bank_account).cost += bill.cost;
          });
        }
      })
    }
  }, [isOpen])

  // 여행 멤버별 정산 금액 매칭
  const matchBankAccount = (bankAccount) => {
    return renderedMemberInfo.find((info) => info.bankAccount === bankAccount).cost;
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
