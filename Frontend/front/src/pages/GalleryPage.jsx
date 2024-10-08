import React from 'react';
import PreviousTrip from '../components/PreviousTrip';
import Chart from '../components/Chart';

import '@/styles/GalleryPage.module.css';

const GalleryPage = () => {
  return (
    <div className="main-container">
      <PreviousTrip />
      <Chart /> {/* Chart에서 payments 데이터를 직접 불러옴 */}
    </div>
  );
};

export default GalleryPage;
