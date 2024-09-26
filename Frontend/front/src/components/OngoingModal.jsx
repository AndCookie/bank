import React from 'react';
import { MdClose } from 'react-icons/md';
import { Modal, Box, Typography, Backdrop, Fade } from '@mui/material';

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
      <Fade in={open}>
        <Box className='box'>
          <MdClose onClick={onClose} />
          <Typography>
            진행 중인 여행 정산 정보
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}

export default SketchModal;