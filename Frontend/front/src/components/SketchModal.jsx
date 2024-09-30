import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '@/axios';
import { Modal, Backdrop, Fade, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import './styles/Modal.css';

const SketchModal = ({ isOpen, onClose, tripId, imageUrl }) => {
  // 새롭게 생성한 AI 스케치 이미지 url
  const [sketchUrl, setSketchUrl] = useState('');

  // 업로드한 이미지명과 url
  const [fileName, setFileName] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  // 이미지 url 초기화
  useEffect(() => {
    if (!isOpen) {
      setSketchUrl('');
      setFileName('');
      setUploadedUrl('');
    }
  }, [isOpen]);

  const uploadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createImage = () => {
    // if (uploadedUrl.length > 0) {
    //   resultImageUrl.value = null;

    //   try {
    //     const formData = new FormData();
    //     formData.append("image", selectedFile.value);
    //     formData.append("index", 0); // Vintage Comic
    //     console.log("API_KEY 되냐", stateStore.apiKey);
    //     const responsePost = await axios.post(
    //       "https://www.ailabapi.com/api/image/effects/ai-anime-generator",
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //           // "ailabapi-api-key": process.env.VUE_APP_AILAB_API_KEY,
    //           "ailabapi-api-key": stateStore.apiKey,
    //         },
    //       }
    //     );

    //     const taskId = responsePost.data.task_id;
    //     await getResult(taskId);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  };

  const saveImage = async () => {
    if (sketchUrl.length > 0) {
      try {
        await axiosInstance.post('/trips/save_image/', {
          trip_id: tripId,
          image_url: sketchUrl,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  let imageContent;
  if (sketchUrl.length > 0) {
    imageContent = <img src={sketchUrl} alt="AI Sketch" style={{ maxWidth: '100%', maxHeight: '400px' }} />;
  } else if (uploadedUrl.length > 0) {
    imageContent = <img src={uploadedUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '400px' }} />;
  } else if (imageUrl) {
    imageContent = <img src={imageUrl} alt="AI Sketch" style={{ maxWidth: '100%', maxHeight: '400px' }} />;
  }

  let imageButton;
  if (sketchUrl.length > 0) {
    imageButton = <Button className='save-btn' variant='contained' size='large' onClick={saveImage}>사진 저장</Button>
  } else {
    imageButton = <Button className='save-btn' variant='contained' size='large' onClick={createImage}>사진 생성</Button>
  }

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
          <div className='modal-title'>AI 스케치</div>

          {/* AI 스케치 이미지 또는 업로드한 이미지 미리보기 */}
          {imageContent}

          {/* 이미지 업로드 버튼 */}
          <div className='file-upload'>
            <div>{fileName || '파일을 선택해주세요'}</div>
            <Button component='label' startIcon={<CloudUploadIcon />}>
              <input type="file" hidden onChange={uploadFile} />
            </Button>
          </div>

          {imageButton}
        </div>
      </Fade>
    </Modal>
  );
}

export default SketchModal;
