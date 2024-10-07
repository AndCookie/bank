import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axios.js'; // Axios 인스턴스 가져오기
import LoadingPage from '@/pages/LoadingPage';
import { useErrorStore } from '@/stores/errorStore'; // 에러 스토어 가져오기
import { useUserStore } from '@/stores/userStore'; // userStore 가져오기
import styles from './styles/Steps.module.css';

const StepFour = ({ formData }) => {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [isSuccess, setIsSuccess] = useState(false); // 성공 여부 상태 관리
  const setError = useErrorStore((state) => state.setError); // 에러 상태 설정 함수
  const userInfo = useUserStore((state) => state.userInfo); // userInfo 가져오기

  // 컴포넌트가 마운트될 때 여행 생성 요청을 자동으로 보냄
  useEffect(() => {
    const handleSubmit = async () => {
      setIsLoading(true); // 로딩 시작

      // userInfo를 members에 추가 (uuid는 빈 문자열로 설정)
      const updatedFormData = {
        ...formData,
        members: [
          ...(formData.members || []),
          {
            id: userInfo.id,
            profile_nickname: userInfo.nickName,
            profile_thumbnail_image: userInfo.profileImage,
            uuid: '', // uuid는 빈 문자열로 설정
          },
        ],
      };

      try {
        const response = await axiosInstance.post('/trips/', updatedFormData);
        console.log('Trip Created:', response.data); // 성공 시 처리
        setIsSuccess(true); // 성공 상태 설정
        setIsLoading(false); // 로딩 종료
      } catch (error) {
        console.error('Error creating trip:', error); // 에러 처리
        setError('여행 생성에 실패했습니다. 다시 시도해주세요.'); // 에러 상태 업데이트
        setIsLoading(false); // 로딩 종료
      }
    };

    handleSubmit(); // 여행 생성 요청 실행
  }, [formData, userInfo, setError]);

  if (isLoading) {
    return <LoadingPage />; // 로딩 페이지 출력
  }

  return (
    <div>
      <h2>Step 4: Review and Submit</h2>
      {isSuccess ? (
        <p>여행 생성 완료!</p> // 성공 시 메시지 출력
      ) : (
        <p>여행 생성 중 문제가 발생했습니다.</p> // 실패 시 기본 메시지 출력
      )}
    </div>
  );
};

export default StepFour;
