import React from 'react';
import { useParams } from 'react-router-dom';

import { Modal, Box, Typography, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useTripStore } from '@/stores/tripStore';

import './styles/Modal.css';

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
        <div className='box'>
          <CloseIcon className='close-btn' fontSize='large' onClick={onClose} />

          <div>
            <div>날짜</div>
            <div>시작일 {tripDetailInfo.startDate}</div>
            <div>종료일 {tripDetailInfo.endDate}</div>
          </div>

          <div>
            <div>국가</div>
            {tripDetailInfo.locations.map((location, index) => (
              <div key={index}>{location.country}</div>
            ))}
          </div>

          <div>
            <div>예산</div>
            {tripDetailInfo.members.map((member, index) => (
              <div key={index}>
                <span>{member.member}</span>
                <span>{member.balance}</span>
              </div>
            ))}
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default SketchModal;