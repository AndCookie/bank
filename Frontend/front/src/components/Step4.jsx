import React from 'react';
import axiosInstance from '@/axios.js'; // Axios 인스턴스 가져오기
import styles from './styles/Steps.module.css'
import LoadingPage from '@/pages/LoadingPage'

const StepFour = ({ formData }) => {
  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/trips/', formData);
      console.log('Trip Created:', response.data); // 성공 시 처리
    } catch (error) {
      console.error('Error creating trip:', error); // 에러 처리
    }
  };

  return (
    <div>
      <h2>Step 4: Review and Submit</h2>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      <button onClick={handleSubmit}>Create Trip</button>
    </div>
  );
};

export default StepFour;