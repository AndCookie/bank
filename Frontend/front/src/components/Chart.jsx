import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import axiosInstance from '@/axios'; // axiosInstance import
import { useParams } from 'react-router-dom';
import styles from './styles/Chart.module.css';

// 이미지 파일들을 import
import airplaneIcon from '@/assets/images/category/airplane.png';
import hotelIcon from '@/assets/images/category/hotel.png';
import vehicleIcon from '@/assets/images/category/vehicle.png';
import foodIcon from '@/assets/images/category/food.png';
import cafeIcon from '@/assets/images/category/cafe.png';
import shoppingIcon from '@/assets/images/category/shopping.png';
import tourIcon from '@/assets/images/category/tour.png';
import etcIcon from '@/assets/images/category/etc.png';

// 카테고리별 아이콘 경로
const icons = {
  항공: airplaneIcon,
  숙소: hotelIcon,
  교통: vehicleIcon,
  식비: foodIcon,
  카페: cafeIcon,
  쇼핑: shoppingIcon,
  관광: tourIcon,
  기타: etcIcon,
};

const Chart = () => {
  const { tripId } = useParams(); // URL에서 tripId 추출
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null); // eCharts 차트를 렌더링할 DOM을 참조하는 ref
  const chartInstance = useRef(null); // eCharts 인스턴스

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get('/payments/list/', {
          params: { trip_id: tripId },
        });
        const payments = response.data.payments_list;
  
        if (payments && payments.length > 0) {
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
  
          const categoryData = Object.entries(categoryTotals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
  
          if (chartRef.current) {
            if (chartInstance.current) {
              chartInstance.current.dispose(); // 기존 차트 제거
            }
            chartInstance.current = echarts.init(chartRef.current); // eCharts 차트 초기화
            
            const option = {
              tooltip: {
                trigger: 'item',
                formatter: function (params) {
                  const iconUrl = icons[params.name];
                  return `
                    <div style="display: flex; align-items: center;">
                      <img src="${iconUrl}" style="width: 20px; height: 20px; margin-right: 5px;" />
                      <strong style="font-size:14px;">${params.name}</strong>
                    </div>
                    <div style="font-size:16px; color:${params.color};">${params.value}원</div>
                    <div style="font-size:12px;">${params.percent}%</div>
                  `;
                },
              },
              series: [
                {
                  name: '지출',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '40%'],
                  data: categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }],
                },
              ],
            };
  
            chartInstance.current.setOption(option); // 옵션 적용
            chartInstance.current.resize(); // 차트 크기 조정
  
            // 창 크기 변경 시 차트 리사이즈
            window.addEventListener('resize', () => {
              if (chartInstance.current) {
                chartInstance.current.resize();
              }
            });
          }
        } else {
          // 데이터가 없을 때 기본 차트 생성
          if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
            chartInstance.current.setOption({
              series: [
                {
                  name: '지출',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '40%'],
                  data: [{ name: 'No Data', value: 1 }],
                },
              ],
            });
          }
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
  
    fetchPayments();
  
    return () => {
      // 창 크기 변경 이벤트 리스너 제거
      window.removeEventListener('resize', () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      });
      // 언마운트 시 차트 인스턴스 제거
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [tripId]);
  

  if (loading) return <div>차트 데이터를 불러오는 중...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.paymentTrip}>
      <div className={styles.title}>나의 지출</div>
      <div className={styles.content}>
        <div ref={chartRef} style={{ width: '100%', height: '400px', minHeight: '400px' }}></div>
      </div>
    </div>
  );
};

export default Chart;