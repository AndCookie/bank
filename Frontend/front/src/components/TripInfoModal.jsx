import React from 'react';
import { Modal, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTripStore } from '@/stores/tripStore';
import { useUserStore } from '@/stores/userStore'; // userStore import

import styles from './styles/TripInfoModal.module.css';

const TripInfoModal = ({ isOpen, onClose }) => {
  const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);
  const { budget } = useUserStore((state) => state); // budget 가져오기

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
        <div className={styles.infoBox}>
          <CloseIcon className={styles.closeBtn} fontSize="large" onClick={onClose} />

          {/* 날짜 정보 */}
          <div className={styles.date}>
            <div className={styles.infoTitle}>📅 &nbsp;날짜</div>
            <div className={styles.infoDetail}>
              <div className={styles.startDate}>
                시작일 &nbsp;| &nbsp; <span className={styles.fullDate}>{tripDetailInfo.startDate}</span>
              </div>
              <div className={styles.endDate}>
                종료일 &nbsp;| &nbsp; <span className={styles.fullDate}>{tripDetailInfo.endDate}</span>
              </div>
            </div>
          </div>

          {/* 국가 정보 */}
          <div className={styles.country}>
            <div className={styles.infoTitle}>✈️ &nbsp;국가</div>
            <div className={styles.infoDetail}>
              {tripDetailInfo.locations.map((location, index) => (
                <div key={index} className={styles.infoMap}>
                  <div className={styles.countryName}>{location.country}</div>
                  <div className={styles.countryTime}>
                    <div className={styles.time}>05:54:20 AM</div>
                    <div className={styles.timeCompare}>한국대비 7시간 느림</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 예산 정보 */}
          <div className={styles.budget}>
            <div className={styles.infoTitle}>💰 &nbsp;예산</div>
            <div className={styles.infoDetail}>
              <div className={styles.infoBudget}>초기 예산: {budget.initialBudget.toLocaleString()}원</div>
              <div className={styles.infoBudget}>소비 예산: {budget.usedBudget.toLocaleString()}원</div>
              <div className={styles.infoBudget}>잔여 예산: {budget.remainBudget.toLocaleString()}원</div>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default TripInfoModal;
