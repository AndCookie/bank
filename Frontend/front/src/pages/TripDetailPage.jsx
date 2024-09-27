import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import EditIcon from '@mui/icons-material/Edit';

import TripInfoModal from '@/components/TripInfoModal';
import OngoingModal from '@/components/OngoingModal';

import { useTripStore } from '@/stores/tripStore';

const TripDetailPage = () => {
  const fetchTripDetail = useTripStore((state) => state.fetchTripDetail);

  // const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  const { tripId } = useParams();
  useEffect(() => {
    fetchTripDetail(tripId);
  }, [fetchTripDetail, tripId]);

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

  const tripDays = eachDayOfInterval({
    start: new Date(tripDetailInfo.startDate),
    end: new Date(tripDetailInfo.endDate),
  });

  // 날짜 선택
  const [selectedDate, setSelectedDate] = useState(null);


  const navigate = useNavigate();

  const clickDate = (date) => {
    setSelectedDate(date);
  }

  const toFinish = () => {
    navigate(`/finish/${tripId}`);
  }

  // 여행 상세 정보 모달 창
  const [isTripInfoOpen, setisTripInfoOpen] = useState(false);

  // 진행 중인 여행 정산 모달 창
  const [isOngoingOpen, setisOngoingOpen] = useState(false);

  const openTripInfoModal = () => {
    setisTripInfoOpen(true);
  }

  const openOngoingModal = () => {
    setisOngoingOpen(true);
  }

  const closeTripInfoModal = () => {
    setisTripInfoOpen(false);
  }

  const closeOngoingModal = () => {
    setisOngoingOpen(false);
  }

  return (
    <>
      <div className="d-flex">
        <div>임광영 님은 {tripDetailInfo.locations[0].country} 여행 중</div>
        <EditIcon onClick={openTripInfoModal} />
      </div>

      {/* 여행 일자 */}
      <div className="d-flex">
        <div onClick={() => clickDate('a')}>
          <div>A</div>
          <div>ALL</div>
        </div>
        <div onClick={() => clickDate('p')}>
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
      <div>
        <button>정산</button>
        <button>미정산</button>
        <div onClick={openOngoingModal}>바르셀로나 공항버스</div>
      </div>

      <button onClick={toFinish}>정산하기</button>

      {/* 여행 상세 정보 모달 창 */}
      <TripInfoModal isOpen={isTripInfoOpen} onClose={closeTripInfoModal} />

      {/* 진행 중인 여행 정산 모달 창 */}
      <OngoingModal isOpen={isOngoingOpen} onClose={closeOngoingModal} />
    </>
  )
}

export default TripDetailPage;