import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import './styles/Chart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  // 차트에 사용할 더미 데이터
  const data = {
    labels: ['항공', '식비', '교통'],
    datasets: [
      {
        label: '지출 내역',
        data: [300, 150, 200],
        backgroundColor: ['#CA7172', '#FBCC98', '#D5FB98'],
        hoverBackgroundColor: ['#CA7172', '#FBCC98', '#D5FB98'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="paymentTrip">
      <div className="title">나의 지출</div>
      <div className="content">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;
