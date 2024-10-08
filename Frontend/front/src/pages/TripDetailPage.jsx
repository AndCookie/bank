import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { MdArrowBack } from 'react-icons/md';
import EditIcon from '@mui/icons-material/Edit';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '@/styles/TripDetailPage.module.css';
import Payment from "@/components/Payment";
import TripInfoModal from '@/components/TripInfoModal';
import LoadingPage from '@/pages/LoadingPage';

import { useTripStore } from '@/stores/tripStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { useUserStore } from "@/stores/userStore";

const TripDetailPage = () => {
  const userInfo = useUserStore((state) => state.userInfo);

  const fetchTripDetail = useTripStore((state) => state.fetchTripDetail);
  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  const setPayments = usePaymentStore((state) => state.setPayments);
  const fetchPayments = usePaymentStore((state) => state.fetchPayments);

  const [loading, setLoading] = useState(true);

  const { tripId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promise.all을 사용해 fetchTripDetail과 fetchPayments를 병렬로 호출
        const [tripDetail, paymentsData] = await Promise.all([
          fetchTripDetail(tripId),  // 여행 정보 호출
          fetchPayments(tripId),    // 결제 정보 호출
        ]);

        // 데이터가 제대로 반환되었는지 확인
        if (!tripDetail || !tripDetail.members || !paymentsData) {
          console.log(tripDetail)
          console.log(paymentsData)
          console.error("Data is missing or invalid");
          return;
        }

        // paymentsData에서 bills 추가
        const updatedPaymentsData = paymentsData.map(payment => {
          const bills = tripDetail.members.map(member => ({
            cost: 0,
            bank_account: member.bank_account,
          }));

          return {
            ...payment,
            bills,    // bills 추가
            checked: false,  // 기본적으로 체크되지 않음
          };
        });

        // paymentStore에 결제 데이터를 저장
        setPayments(updatedPaymentsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);  // 로딩 완료 후 상태 변경
      }
    };

    fetchData();
  }, [tripId, fetchTripDetail, fetchPayments, setPayments]);


  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('all');
  const [isTripInfoOpen, setisTripInfoOpen] = useState(false);

  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
  }

  const clickDate = (date) => {
    setSelectedDate(date);
  }

  const openTripInfoModal = () => {
    setisTripInfoOpen(true);
  }

  const closeTripInfoModal = () => {
    setisTripInfoOpen(false);
  }

  if (loading) {
    return <LoadingPage />;
  }

  const tripDays = eachDayOfInterval({
    start: new Date(tripDetailInfo.startDate),
    end: new Date(tripDetailInfo.endDate),
  });

  return (
    <div className={styles.container}>
      {/* 뒤로가기 */}
      <div className={styles.header}>
        <div className={styles.back}>
          <MdArrowBack className={styles.btns} size={30} onClick={goBack} />
        </div>
      </div>

      {/* 프로필 */}
      <div className={styles.profile}>
        <div>{userInfo.profileImage && <img src={userInfo.profileImage} alt={userInfo.nickName} className={styles.circleImage} />}</div>
        <div className={styles.profileStatus}>
          {userInfo.nickName} 님은 {tripDetailInfo.locations[0].country} 여행 중 &nbsp;
        </div>
        <EditIcon onClick={openTripInfoModal} />
      </div>

      {/* 여행 일자 */}
      <div className={styles.pickContainer}>
        <div className={styles.all} onClick={() => clickDate('all')}>
          <div className={styles.upper}>&nbsp;</div>
          <div className={`${styles.middle} ${selectedDate === 'all' ? styles.pickCircle : ''}`}>A</div>
          <div className={styles.bottom}>ALL</div>
        </div>
        <div className={styles.prepare} onClick={() => clickDate('prepare')}>
          <div className={styles.upper}>&nbsp;</div>
          <div className={`${styles.middle} ${selectedDate === 'prepare' ? styles.pickCircle : ''}`}>P</div>
          <div className={styles.bottom}>준비</div>
        </div>

        {/* 날짜 스크롤 */}
        <div className={styles.dayScroll}>
          {tripDays.map((date, index) => (
            <div className={styles.dayContainer} key={index} onClick={() => clickDate(date)}>
              <div className={styles.upper}>{format(date, "EEE")}</div>
              <div className={`${styles.middle} ${isSameDay(selectedDate, date) ? styles.pickCircle : ''}`}>
                {format(date, "d")}
              </div>
              <div className={styles.bottom}>{format(date, "M")}월</div>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 내역 */}
      <div className={styles.payment}>
        <Payment selectedDate={selectedDate} />
      </div>

      {/* 여행 상세 정보 모달 창 */}
      <TripInfoModal isOpen={isTripInfoOpen} onClose={closeTripInfoModal} tripDetailInfo={tripDetailInfo} />
    </div>
  );
};

export default TripDetailPage;
