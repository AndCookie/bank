import React, { useEffect, useState, useRef, startTransition } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import './styles/TripPage.css';
// import useTripStore from '@/stores/tripStore'  

const TripPage = () => {
  // const tripStore = useTripStore();
  // const { data: pastTrips} = useQuery('pastTrips', tripStore.getPastTrips())

  const currentTrips = [
    { id: 1,
      trip_name: '현재 여행 1',
      location: '한국',
      start_date: '2024-09-01',
      end_date: '2024-10-10'
    }
  ]

  const futureTrips = [
    { id: 1,
      trip_name: '미래 여행 1',
      location: '일본',
      start_date: '2024-10-30',
      end_date: '2024-11-10'
    },
    { id: 2,
      trip_name: '미래 여행 2',
      location: '베트남',
      start_date: '2024-11-01',
      end_date: '2024-11-20'
    }
  ]

  const pastTrips = [
    { id: 1, 
      trip_name: '과거 여행 1', 
      location: '미국', 
      start_date: '2024-08-30', 
      end_date: '2024-09-05'
    },
    { id: 2, 
      trip_name: '과거 여행 2', 
      location: '프랑스', 
      start_date: '2024-08-31', 
      end_date: '2024-09-06'
    },
    { id: 3, 
      trip_name: '과거 여행 3', 
      location: '스페인', 
      start_date: '2024-08-20', 
      end_date: '2024-09-15'
    },
  ]
  const navigate = useNavigate();
  const toGallery = (tripId) => {
    navigate(`/gallery/${tripId}`); // 각 trip의 tripId에 따라 페이지 이동
  };
  const toCreate = () => {
    navigate('/trip/create');
  }

  return (
    <>
      <div className='main-container'>
        <div className='profile'>
          {/* 프로필 작업 */}
          {/* <img src="{profileImageUrl}" alt="" /> */}
          <button onClick={toCreate}>
          {/* 여행 만들기 버튼 */}
            +
          </button>
        </div>
        <div className='non-past'>
          {/* 차후 조건문으로 진행중인 여행 여부 들어감 */}
        </div>
        <div className='past'>
          {/* 과거 여행을 상하 슬라이드로 넣음 */}
          <h2>과거 여행</h2>
          <div className="past-trips">
            {/* pastTrips 배열을 반복하여 각 trip 카드를 표시 */}
            {pastTrips.map((trip) => (
              <div
                key={trip.id}
                className="trip-card"
                onClick={() => toGallery(trip.id)} // 클릭 시 해당 tripId로 이동
              >
                <h3>{trip.trip_name}</h3>
                <p>Location: {trip.location}</p>
                <p>Start Date: {trip.start_date}</p>
                <p>End Date: {trip.end_date}</p>
              </div>
            ))}
         </div>
        </div>
      </div>
    </>
  )
}


export default TripPage;