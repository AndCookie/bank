import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import '@/styles/HomePage.css';

const HomePage = () => {
  // const navigate = useNavigate();
  const toTrip = () => {
    window.location.href = 'https://j11a204.p.ssafy.io/api/auth/login/kakao/';
  };

  return (
    <div className='main-container'>
      <div>
        <p>정산부터 소비관리까지</p>
        <p>나만의 여행비서</p>
      </div>
      <div>
        <img src="../../public/main.png" alt="main logo" />
      </div>
      <div>
        <p>여행에서 가장 쉬운 정산 서비스</p>
        <p>요뜨</p>
      </div>
      <button onClick={toTrip}>카카오로 로그인</button>
    </div>
  );
};

export default HomePage;