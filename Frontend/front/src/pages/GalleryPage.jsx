import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import PreviousTrip from '../components/PreviousTrip';
import Chart from '../components/Chart';
import Sketch from '../components/Sketch';

import '@/styles/GalleryPage.css'

const GalleryPage = () => {
  return (
    <div className="main-container">
      <PreviousTrip />
      <Chart />
      <Sketch />
    </div>
  );
};

export default GalleryPage;