import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import '@/styles/LoadingPage.css'

const LoadingPage = () => {

  return (
    <div className="loading">
      <div className="spinner"></div>
    </div>
  )
};

export default LoadingPage;