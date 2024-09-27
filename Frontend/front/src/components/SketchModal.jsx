import React from 'react';
import { Modal, Box, Typography, Backdrop, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import './styles/Modal.css';

const SketchModal = ({ isOpen, onClose }) => {
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
            AI 스케치
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

export default SketchModal;