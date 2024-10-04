// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// import styles from './styles/Chart.module.css';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const Chart = () => {
//   // 차트에 사용할 더미 데이터
//   const data = {
//     labels: ['항공', '식비', '교통'],
//     datasets: [
//       {
//         label: '지출 내역',
//         data: [300, 150, 200],
//         backgroundColor: ['#CA7172', '#FBCC98', '#D5FB98'],
//         hoverBackgroundColor: ['#CA7172', '#FBCC98', '#D5FB98'],
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'bottom',
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//   };

//   return (
//     <div className={styles.paymentTrip}>
//       <div className={styles.title}>나의 지출</div>
//       <div className={styles.content}>
//         <Doughnut data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default Chart;

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { usePaymentStore } from '@/stores/paymentStore'; // paymentStore import
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './styles/Chart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  const { tripId } = useParams(); // URL에서 tripId 추출
  const { getPaymentsByTripId } = usePaymentStore(); // paymentStore에서 getPaymentsByTripId 가져오기
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // tripId에 해당하는 payments 데이터를 가져옴
    const payments = getPaymentsByTripId(tripId);
    
    if (payments && payments.length > 0) {
      // 각 category별로 지출 합계를 계산
      const categoryTotals = {};
      payments.forEach(payment => {
        const category = payment.category;
        const amount = payment.amount;
        
        if (categoryTotals[category]) {
          categoryTotals[category] += amount;
        } else {
          categoryTotals[category] = amount;
        }
      });

      // 차트 데이터 설정
      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);

      setChartData({
        labels,
        datasets: [
          {
            label: '지출 내역',
            data: data,
            backgroundColor: ['#CA7172', '#FBCC98', '#D5FB98', '#98CAF3', '#F3989E'],
            hoverBackgroundColor: ['#CA7172', '#FBCC98', '#D5FB98', '#98CAF3', '#F3989E'],
          },
        ],
      });
    }
  }, [tripId, getPaymentsByTripId]);

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

  // 차트 데이터가 없는 경우 처리
  if (!chartData) return <div>차트 데이터를 불러오지 못했습니다.</div>;

  return (
    <div className={styles.paymentTrip}>
      <div className={styles.title}>나의 지출</div>
      <div className={styles.content}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Chart;
