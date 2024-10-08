import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axiosInstance from '@/axios'; // axiosInstance import
import { useParams } from 'react-router-dom';
import styles from './styles/Chart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  const { tripId } = useParams(); // URL에서 tripId 추출

  // React Query로 /payments/list/ 엔드포인트에 GET 요청
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get('/payments/list/', {
          params: { trip_id: tripId }, // trip_id를 params로 전달
        });
        const payments = response.data.payments_list;

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
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPayments();
  }, [tripId]);

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

  if (loading) return <div>차트 데이터를 불러오는 중...</div>;
  if (error) return <div>Error: {error.message}</div>;
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
