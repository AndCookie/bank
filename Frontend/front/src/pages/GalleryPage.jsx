import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import PreviousTrip from '../components/PreviousTrip';
import Chart from '../components/Chart';

import '@/styles/GalleryPage.css'

const GalleryPage = () => {
  return (
    <div className="main-container">
      <PreviousTrip />
      <Chart />
    </div>
  );
};

export default GalleryPage;