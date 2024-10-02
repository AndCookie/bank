import React from 'react';
import { useParams } from 'react-router-dom';

import { Modal, Box, Typography, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useTripStore } from '@/stores/tripStore';

import styles from './styles/TripInfoModal.module.css';

const SketchModal = ({ isOpen, onClose }) => {
  // const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  const { tripId } = useParams();
  const tripDetailInfo = {
    id: tripId,
    startDate: "2024-08-19",
    endDate: "2024-09-02",
    imageUrl: " ",
    locations: [
      {
        "country": "스페인"
      },
      {
        "country": "포르투갈"
      }
    ],
    members: [
      {
        "member": "박준영",
        "bank_account": "0880493544778029",
        "bank_name": "신한은행",
        "balance": "여행 수락중"
      },
      {
        "member": "오승진",
        "bank_account": "0886984969930397",
        "bank_name": "신한은행",
        "balance": "카드 연결중"
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
      },
      {
        "member": "정지환",
        "bank_account": "0886984969930399",
        "bank_name": "신한은행",
        "balance": "카드 연결중"
      },
    ]
  };

  if (!isOpen) return null; return (
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
          <CloseIcon className={styles.closeBtn} fontSize='large' onClick={onClose} />

          <div className={styles.date}>
            <div className={styles.infoTitle}>📅 &nbsp;날짜</div>
            <div className={styles.infoDetail}>
              <div className={styles.startDate}>시작일 &nbsp;| &nbsp; <span className={styles.fullDate}>{tripDetailInfo.startDate}</span></div>
              <div className={styles.endDate}>종료일 &nbsp;| &nbsp; <span className={styles.fullDate}>{tripDetailInfo.endDate}</span></div>
            </div>
          </div>

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

          <div className={styles.budget}>
            <div className={styles.infoTitle}>💰 &nbsp;예산</div>
            <div className={styles.infoDetail}>
              {tripDetailInfo.members.map((member, index) => (
                <div key={index} className={styles.member}>
                  <div className={styles.memberName}>{member.member}</div>
                  <div className={styles.memberBalance}>{member.balance}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );

}

export default SketchModal;