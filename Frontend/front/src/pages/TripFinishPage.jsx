import React, { useEffect, useState } from 'react';
import styles from '@/styles/TripFinishPage.module.css';
import checkImage from '@/assets/images/load/check.png';
import axiosInstance from '@/axios.js';
import { useTripStore } from '@/stores/tripStore';
import { usePaymentStore } from '@/stores/paymentStore';
import LoadingPage from '@/pages/LoadingPage'; // LoadingPage 컴포넌트 가져오기

const TripFinishPage = () => {
  const finalPayments = usePaymentStore((state) => state.finalPayments);

  useEffect(() => {
    console.log('Final', finalPayments);
  }, [])

  useEffect(() => {
    // 결제 정산 요청
    if (finalPayments.payments) {
      const sendAdjustment = async () => {
        try {
          const response = await axiosInstance.post('/payments/adjustment/', finalPayments);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
      sendAdjustment();
    };
  }, [finalPayments]);

// const { currentTrip, payments, fetchPayments } = useTripStore((state) => ({
//   currentTrip: state.currentTrip,
//   payments: state.payments,
//   fetchPayments: state.fetchPayments,
// }));

// const [budgetInfo, setBudgetInfo] = useState(null); // API 응답 데이터를 저장할 상태
// const [errorMessage, setErrorMessage] = useState('');
// const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

// useEffect(() => {
//   // 결제 정보 가져오기
//   if (currentTrip.id) {
//     fetchPayments(currentTrip.id);
//   }
// }, [currentTrip.id, fetchPayments]);


// 예산 정보를 렌더링하는 함수
// const renderBudgetInfo = () => {
//   if (!budgetInfo) {
//     return null;
//   }

// const userName = "정태완"; // 현재 사용자의 이름 (변경 가능)
// const userBudget = budgetInfo.data[userName];

//   if (!userBudget) {
//     return <p>사용자의 예산 정보를 찾을 수 없습니다.</p>;
//   }

//   return (
//     <div className={styles.detail}>
//       <h4>{`${userName} 님의 여행 소비 정보`}</h4>
//       <p>전체 지출 {userBudget.used_budget.toLocaleString()}원</p>
//       <p>남은 예산 {userBudget.remain_budget.toLocaleString()}원</p>
//       <div className={styles.explanation}>
//         (개인별) 남은 예산 = 초기 예산 - 총 지출금
//       </div>
//     </div>
//   );
// };

// 로딩 중일 때는 LoadingPage를 렌더링
// if (isLoading) {
//   return <LoadingPage />;
// }

return (
  <>
    <div>정산 완료</div>
    {/* 정산 완료
      <div className={styles.complete}>
        <img src={checkImage} alt="체크" />
        <div className={styles.message}>정 산 완 료</div>
      </div> */}

    {/* 지출/예산/잔액 정보 */}
    {/* {errorMessage ? (
        <p className={styles.error}>{errorMessage}</p>
      ) : (
        renderBudgetInfo()
      )} */}
  </>
  );
};

export default TripFinishPage;

