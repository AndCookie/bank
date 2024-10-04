import React from 'react';
import { Modal, Box, Typography, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import styles from './styles/Modal.module.css';

const OngoingModal = ({ isOpen, onClose }) => {
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
        <div className={styles.box}>
          <CloseIcon className={styles.closeBtn} fontSize='large' onClick={onClose} />
          <div>
            진행 중인 여행 정산 정보
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default OngoingModal;
