import React from 'react';
import { useTripStore } from '@/stores/tripStore'; // tripStore에서 상태 가져오기
import styles from './styles/AdjustCompleteModal.module.css'; // 스타일 경로에 맞게 설정

const AdjustCompleteModal = ({ adjustResults }) => {
  // tripStore에서 tripDetailInfo 가져오기
  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  // 사용자 ID와 tripDetailInfo의 members를 매칭하여 이름과 이미지를 찾는 함수
  const findMemberInfo = (userId) => {
    const member = tripDetailInfo.members.find(member => member.id === userId);
    return member ? { name: member.last_name, image: member.profileImage } : { name: 'Unknown', image: '' };
  };

  return (
    <div className={styles.modalContainer}>
      <h3>정산 상세 결과</h3>
      {adjustResults.payments.map((payment) => (
        <div key={payment.payment_id} className={styles.paymentSection}>
          <h4>결제 ID: {payment.payment_id}</h4>
          <ul className={styles.billsList}>
            {payment.bills.map((bill, index) => {
              const memberInfo = findMemberInfo(bill.user_id); // 사용자 정보 매칭
              return (
                <li key={index} className={styles.billItem}>
                  <img src={memberInfo.image} alt={memberInfo.name} className={styles.memberImage} />
                  <span className={styles.memberName}>{memberInfo.name}</span>
                  <span className={styles.cost}>금액: {bill.cost}원</span>
                  <span className={bill.is_complete ? styles.complete : styles.incomplete}>
                    {bill.is_complete ? '완료' : '미완료'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdjustCompleteModal;