import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import PreviousTrip from '../components/PreviousTrip';
import Chart from '../components/Chart';
import Sketch from '../components/Sketch';

const GalleryPage = () => {
  // const params = useParams();
  return (
    <>
      <PreviousTrip />
      <Chart />
      <Sketch />
    </>
  )
}


export default GalleryPage;