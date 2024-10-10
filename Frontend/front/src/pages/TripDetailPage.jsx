import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { MdArrowBack } from 'react-icons/md';
import SearchIcon from '@mui/icons-material/Search';
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
  const setTripDetailInfo = useTripStore((state) => state.setTripDetailInfo);
  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  const fetchPayments = usePaymentStore((state) => state.fetchPayments);
  const setPayments = usePaymentStore((state) => state.setPayments);
  const payments = usePaymentStore((state) => state.payments);

  const setFinalPayments = usePaymentStore((state) => state.setFinalPayments);

  const [loading, setLoading] = useState(true);

  const { tripId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promise.all을 사용해 fetchTripDetail과 fetchPayments를 병렬로 호출
        const [tripDetailData, paymentsData] = await Promise.all([
          fetchTripDetail(tripId),
          fetchPayments(tripId),
        ]);

        console.log(tripDetailData, paymentsData, userInfo);

        // paymentsData.payments_list에 bills 추가
        const updatedPaymentsData = paymentsData.payments_list.map(payment => {
          const bills = tripDetailData.members.map(member => ({
            cost: 0,
            bank_account: member.bank_account,
          }));

          return {
            ...payment,
            bills,
            checked: false,
          };
        });

        setTripDetailInfo(tripId, tripDetailData);
        setPayments(updatedPaymentsData);

        setFinalPayments(tripId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('all');
  const [isTripInfoOpen, setisTripInfoOpen] = useState(false);

  const goBack = () => {
    navigate('/trip');
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

  const tripState = new Date(tripDetailInfo.startDate) > new Date() ? '준비' : '';

  return (
    <div className={styles.container}>
      {/* 뒤로가기 */}
      <div className={styles.header}>
        <div className={styles.back}>
          <MdArrowBack className={styles.btns} size={30} onClick={goBack} />
        </div>
        <div className={styles.search}>
          <SearchIcon 
            className={styles.searchIcon} 
            onClick={openTripInfoModal} 
            style={{ fontSize: 30 }}
          />
        </div>
      </div>

      {/* 프로필 */}
      <div className={styles.profile}>
        <div>{userInfo.profileImage && <img src={userInfo.profileImage} alt={userInfo.nickName} className={styles.circleImage} />}</div>
        <div className={styles.profileStatus}>
          {userInfo.nickName} 님은<br /><div className={styles.tripName}>{tripDetailInfo.tripName}</div> 여행 {tripState} 중 &nbsp;
        </div>
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
      <TripInfoModal isOpen={isTripInfoOpen} onClose={closeTripInfoModal} />
    </div>
  );
};

export default TripDetailPage;
