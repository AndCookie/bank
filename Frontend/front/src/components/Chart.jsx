import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import './styles/Chart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  // 차트에 사용할 더미 데이터
  const data = {
    labels: ['항목 A', '항목 B', '항목 C'],
    datasets: [
      {
        label: '지출 내역',
        data: [300, 150, 200],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
