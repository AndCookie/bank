import React, { useEffect, useRef, useState } from 'react';
import { Chip } from '@mui/material';
import ReactECharts from 'echarts-for-react'; // ECharts for React
import axiosInstance from '@/axios'; // axiosInstance import
import { useParams } from 'react-router-dom';
import styles from './styles/MBTI.module.css';
import InfoIcon from '@mui/icons-material/Info';
import MBTIModal from '@/components/MBTIModal';

const Chart = () => {
  const [isMBTIOpen, setisMBTIOpen] = useState(false);

  const openModal = (event) => {
    event.stopPropagation();
    setisMBTIOpen(true);
  };

  const closeModal = () => {
    setisMBTIOpen(false);
  };
  

  return (
    <div className={styles.trip}>
      <div className={styles.title}>소BTI</div>
      <div className={styles.content}>
        {/*  아이콘  */}
        <div className={styles.icon}>
          <InfoIcon className={styles.infoIcon} onClick={(event) => openModal(event)} />
        </div>
        {/*  캐릭터  */}
        <div className={styles.character}>
          <img src="" alt="" />
          <div className={styles.characterInfo}>
            <div>당신의 소BTI 캐릭터는</div>
            <div className={styles.myCharacter}>룰루핑</div>
            <div>
              <Chip variant="outlined" color="primary" label="#항공마일리지왕" />
              <Chip variant="outlined" color="primary" label="#하늘길애호가" />
            </div>
          </div>
        </div>
      </div>

      <MBTIModal isOpen={isMBTIOpen} onClose={closeModal} />
    </div>
  );
};

export default Chart;
