import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import EditIcon from '@mui/icons-material/Edit';

import Payment from "@/components/Payment";
import TripInfoModal from '@/components/TripInfoModal';

import { useTripStore } from '@/stores/tripStore';
import { usePaymentStore } from '@/stores/paymentStore'

const TripDetailPage = () => {
  // const fetchTripDetail = useTripStore((state) => state.fetchTripDetail);

  const { tripId } = useParams();
  // useEffect(() => {
  //   fetchTripDetail(tripId);
  // }, [fetchTripDetail, fetchPayments, tripId]);

  // const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);
  // const payments = useTripStore((state) => state.payments);

  const tripDetailInfo = {
    id: tripId,
    startDate: "2024-08-19",
    endDate: "2024-09-02",
    imageUrl: " ",
    locations: [
      {
        "country": "기흥"
      },
      {
        "country": "역삼"
      }
    ],
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
  };

  const payments = {
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
        "username": "박준영"
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

  const paymentsData = payments.data;
  const paymentsBudget = payments.budget;

  const tripDays = eachDayOfInterval({
    start: new Date(tripDetailInfo.startDate),
    end: new Date(tripDetailInfo.endDate),
  });

  // 날짜 선택
  const [selectedDate, setSelectedDate] = useState('all');

  const navigate = useNavigate();

  const clickDate = (date) => {
    setSelectedDate(date);
  }

  const toFinish = () => {
    navigate(`/finish/${tripId}`);
  }

  // 여행 상세 정보 모달 창
  const [isTripInfoOpen, setisTripInfoOpen] = useState(false);

  const openTripInfoModal = () => {
    setisTripInfoOpen(true);
  }

  const closeTripInfoModal = () => {
    setisTripInfoOpen(false);
  }

  return (
    <>
      <div className="d-flex">
        <div>임광영 님은 {tripDetailInfo.locations[0].country} 여행 중</div>
        <EditIcon onClick={openTripInfoModal} />
      </div>

      {/* 여행 일자 */}
      <div className="d-flex">
        <div onClick={() => clickDate('all')}>
          <div>A</div>
          <div>ALL</div>
        </div>
        <div onClick={() => clickDate('prepare')}>
          <div>P</div>
          <div>준비</div>
        </div>
        {tripDays.map((date, index) => (
          <div key={index} onClick={() => clickDate(date)}>
            <div>{format(date, "EEE")}</div>
            <div>{format(date, "d")}</div>
            <div>{format(date, "M")}월</div>
          </div>
        ))}
      </div>

      {/* 결제 내역 */}
      <Payment payments={paymentsData} selectedDate={selectedDate} />

      <button onClick={toFinish}>정산하기</button>

      {/* 여행 상세 정보 모달 창 */}
      <TripInfoModal isOpen={isTripInfoOpen} onClose={closeTripInfoModal} tripDetailInfo={tripDetailInfo} />
    </>
  )
}

export default TripDetailPage;