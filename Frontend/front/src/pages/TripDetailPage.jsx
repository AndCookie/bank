import { React, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';

import TripInfoModal from '@/components/TripInfoModal';

const TripDetailPage = () => {
  // 여행 상세 정보 모달 창
  const [isOpen, setisOpen] = useState(false);

  const openModal = () => {
    setisOpen(true);
  }

  const closeModal = () => {
    setisOpen(false);
  }

  return (
    <>
      <div className="d-flex">
        <div>임광영 님은 툼파티파 여행 중</div>
        <EditIcon onClick={openModal} />
      </div>
      
      {/* AI 스케치 모달 창 */}
      <TripInfoModal isOpen={isOpen} onClose={closeModal} />
    </>
  )
}

export default TripDetailPage;