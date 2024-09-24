import { React, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import EditIcon from '@mui/icons-material/Edit';

import TripInfoModal from '@/components/TripInfoModal';
import OngoingModal from '@/components/OngoingModal';

const TripDetailPage = () => {
  const startDate = new Date('2024-09-20');
  const endDate = new Date('2024-10-10');
  const tripDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const { tripId } = useParams();

  const navigate = useNavigate();

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
      <div>임광영 님은 툼파티파 여행 중</div>
      <EditIcon onClick={openTripInfoModal} />
    </div>

    {/* 여행 일자 */}
    <div className="d-flex">
      <div>
        <div>A</div>
        <div>ALL</div>
      </div>
      <div>
        <div>P</div>
        <div>준비</div>
      </div>
      {tripDays.map((date, index) => (
        <div key={index}>
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
)}

export default TripDetailPage;