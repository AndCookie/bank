import React, { useState } from 'react';
import { Modal, Backdrop, Fade, IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/axios'; // axiosInstance import
import { useUserStore } from '@/stores/userStore'; // userStore import

import styles from './styles/TripInfoModal.module.css';

const TripInfoModal = ({ isOpen, onClose, refreshData }) => {
  const { budget, setUserBudget, userInfo } = useUserStore((state) => state); // budget과 userInfo 가져오기
  const { tripId } = useParams(); // tripId 가져오기

  const [editMode, setEditMode] = useState(false); // 수정 모드 상태
  const [newBudget, setNewBudget] = useState(budget.initialBudget); // 새로운 예산 상태

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      // POST 요청 데이터
      const postData = {
        trip_id: tripId,
        budget: newBudget,
      };

      // /trips/budget/로 POST 요청 보내기
      await axiosInstance.post('/trips/budget/', postData);

      // 새로운 예산 업데이트
      setUserBudget({ ...budget, initialBudget: newBudget });

      // 수정 모드 종료
      setEditMode(false);

      // 데이터 새로고침 (부모 컴포넌트의 fetchData 호출)
      refreshData();

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error('Error sending budget data:', error);
    }
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
        <div className={styles.infoBox}>
          <CloseIcon className={styles.closeBtn} fontSize="large" onClick={onClose} />

          {/* 예산 정보 */}
          <div className={styles.budget}>
            <div className={styles.infoTitle}>💰 &nbsp;예산</div>
            <div className={styles.infoDetail}>
              {!editMode ? (
                <>
                  <div className={styles.infoBudget}>
                    초기 예산: {budget.initialBudget.toLocaleString()}원
                    <IconButton onClick={handleEditClick} size="small">
                      <EditIcon />
                    </IconButton>
                  </div>
                  <div className={styles.infoBudget}>소비 예산: {budget.usedBudget.toLocaleString()}원</div>
                  <div className={styles.infoBudget}>잔여 예산: {budget.remainBudget.toLocaleString()}원</div>
                </>
              ) : (
                <div className={styles.editBudget}>
                  <TextField
                    label="초기 예산"
                    type="number"
                    variant="outlined"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" onClick={handleSaveClick} className={styles.saveBtn}>
                    저장
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default TripInfoModal;
