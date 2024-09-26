import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import '@/styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const toTrip = () => {
    // window.location.href = 'https://j11a204.p.ssafy.io/api/auth/login/kakao/';
    navigate('/trip');

  };

  return (
    <div className='main-container'>
      <div className='top'>
        <div className='first'>정산부터 소비관리까지</div>
        <div className='second'>나만의 여행비서</div>
      </div>
      <div className='middle'>
        <img className='main-img' src="../../public/main.png" alt="main logo" />
      </div>
      <div className='bottom'>
        <div className='third'>여행에서 가장 쉬운 정산 서비스</div>
        <div className='title'>요&nbsp;&nbsp;뜨</div>
        <div className='login'>
          <button onClick={toTrip}>카카오톡 로그인</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;