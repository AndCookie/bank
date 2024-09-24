import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import './styles/Modal.css';

const SketchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className='box'>
        <Typography>AI 스케치</Typography>
      </Box>
    </Modal>
  );
}

export default SketchModal;