import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { MdArrowBack } from 'react-icons/md';
import EditIcon from '@mui/icons-material/Edit';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from '@/styles/TripDetailPage.module.css'
import Payment from "@/components/Payment";
import TripInfoModal from '@/components/TripInfoModal';
import LoadingPage from '@/pages/LoadingPage'

import { useTripStore } from '@/stores/tripStore';
import { usePaymentStore } from '@/stores/paymentStore'
import { useUserStore } from "@/stores/userStore";

const TripDetailPage = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  const fetchTripDetail = useTripStore((state) => state.fetchTripDetail);

  const { tripId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      await fetchTripDetail(tripId); // fetchTripDetail 함수 호출
      setLoading(false); // 데이터를 다 불러오면 로딩 종료
    };
    
    fetchData();
  }, [fetchTripDetail, tripId]);
  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);
  const [loading, setLoading] = useState(true);
  // const payments = useTripStore((state) => state.payments);

  const paymentsDummyData = {
    "data": [
      {
        "id": 339,
        "is_completed": 1,
        "amount": 300000,
        "pay_date": "2024-08-19",
        "pay_time": "00:00:00",
        "brand_name": "Korean Air",
        "category": "항공",
        "bank_account": "0880493544778029",
        "username": "김신한",
        "calculates": [
          {
            "username": "김신한",
            "cost": 60000
          },
          {
            "username": "박준영",
            "cost": 60000
          },
          {
            "username": "이선재",
            "cost": 60000
          },
          {
            "username": "임광영",
            "cost": 60000
          },
          {
            "username": "정태완",
            "cost": 60000
          }
        ]
      },
      {
        "id": 85,
        "is_completed": 0,
        "amount": 60000,
        "pay_date": "2024-08-19",
        "pay_time": "15:54:35",
        "brand_name": "플러스 O2O 제휴-(주)마이리얼트립",
        "category": "관광",
        "bank_account": "0886984969930397",
        "username": "임광영"
      },
      {
        "id": 1,
        "is_completed": 0,
        "amount": 1000000,
        "pay_date": "2024-08-19",
        "pay_time": "15:54:35",
        "brand_name": "플러스 O2O 제휴-(주)마이리얼트립",
        "category": "관광",
        "bank_account": "0886984969930397",
        "username": "임광영"
      },
      {
        "id": 90,
        "is_completed": 0,
        "amount": 1031997,
        "pay_date": "2024-08-20",
        "pay_time": "04:00:32",
        "brand_name": "AIR FRANCE",
        "category": "항공",
        "bank_account": "0885399658115105",
        "username": "이선재"
      },
      {
        "id": 88,
        "is_completed": 1,
        "amount": 853111,
        "pay_date": "2024-08-20",
        "pay_time": "10:12:33",
        "brand_name": "AIRBNB * HMFYA3QH3F",
        "category": "숙소",
        "bank_account": "0880493544778029",
        "username": "김신한",
        "calculates": [
          {
            "username": "김신한",
            "cost": 300
          },
          {
            "username": "박준영",
            "cost": 300
          },
          {
            "username": "이선재",
            "cost": 300
          },
          {
            "username": "임광영",
            "cost": 300
          },
          {
            "username": "정태완",
            "cost": 300
          }
        ]
      }
    ],
    "budget": {
      "박준영": {
        "initial_budget": 2000000,
        "used_budget": 93122,
        "remain_budget": 1906878
      },
      "이선재": {
        "initial_budget": 1500000,
        "used_budget": 93122,
        "remain_budget": 1406878
      },
      "임광영": {
        "initial_budget": 1500000,
        "used_budget": 93122,
        "remain_budget": 1406878
      },
      "정태완": {
        "initial_budget": 2000000,
        "used_budget": 93122,
        "remain_budget": 1906878
      },
      "김신한": {
        "initial_budget": 1000000,
        "used_budget": 84409,
        "remain_budget": 915591
      }
    }
  };

  const paymentsData = paymentsDummyData.data;
  const paymentsBudget = paymentsDummyData.budget;

  const payments = usePaymentStore((state) => state.payments);
  const setPayments = usePaymentStore((state) => state.setPayments);

  const finalPayments = usePaymentStore((state) => state.finalPayments);
  const setFinalPayments = usePaymentStore((state) => state.setFinalPayments);

  useEffect(() => {
    setFinalPayments(tripDetailInfo.id);
  }, [])

  useEffect(() => {
    // tripDetailInfo.members가 존재하는지 확인하고 실행
    if (tripDetailInfo.members && tripDetailInfo.members.length > 0) {
      const updatedPaymentsData = paymentsData.map((payment) => {
        const membersData = tripDetailInfo.members.map(member => ({
          cost: 0,
          bank_account: member.bank_account
        }));
        return {
          ...payment,
          bills: membersData,
          checked: false,
        };
      });
      setPayments(updatedPaymentsData);
    }
  }, [tripDetailInfo]); 

  const tripDays = eachDayOfInterval({
    start: new Date(tripDetailInfo.startDate),
    end: new Date(tripDetailInfo.endDate),
  });

  // 날짜 선택
  const [selectedDate, setSelectedDate] = useState('all');

  const navigate = useNavigate();

  // 뒤로가기 버튼 클릭 시 이전 페이지로 이동
  const goBack = () => {
    navigate(-1); // 이전 페이지로 이동
  }

  const clickDate = (date) => {
    setSelectedDate(date);
  }

  // 여행 상세 정보 모달 창
  const [isTripInfoOpen, setisTripInfoOpen] = useState(false);

  const openTripInfoModal = () => {
    setisTripInfoOpen(true);
  }

  const closeTripInfoModal = () => {
    setisTripInfoOpen(false);
  }

  if (loading) {
    return <LoadingPage />;
  }

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

        {/* 구분선 */}
        <div className={styles.line}>|</div>

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

        {/* 구분선 */}
        <div className={styles.arrow}>
          <ChevronRightIcon />
        </div>
      </div>

      {/* 결제 내역 */}
      <Payment selectedDate={selectedDate} />

      {/* 여행 상세 정보 모달 창 */}
      <TripInfoModal isOpen={isTripInfoOpen} onClose={closeTripInfoModal} tripDetailInfo={tripDetailInfo} />
    </div>
  )
}

export default TripDetailPage;