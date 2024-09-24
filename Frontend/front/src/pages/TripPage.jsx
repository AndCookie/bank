import React, { useEffect, useState, useRef, startTransition } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import '@/styles/TripPage.css';
// import useTripStore from '@/stores/tripStore';

import SketchModal from '@/components/SketchModal';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

const TripPage = () => {
  // const tripStore = useTripStore();
  // const { data: pastTrips} = useQuery('pastTrips', tripStore.getPastTrips())

  const currentTrips = [
    {
      "id": 5,
      "start_date": "2024-09-15",
      "end_date": "2024-10-15",
      "trip_name": "SSAFY 특화 프로젝트",
      "image_url": "",
      "locations": [
        {
          "country": "기흥"
        },
        {
          "country": "역삼"
        }
      ]
    },
  ]

  const futureTrips = [
    {
      "id": 6,
      "start_date": "2024-11-01",
      "end_date": "2024-12-01",
      "trip_name": "화성 갈끄니깐",
      "image_url": "",
      "locations": [
        {
          "country": "화성"
        }
      ]
    }
  ]

  const pastTrips = [
    {
      "id": 4,
      "start_date": "2023-11-15",
      "end_date": "2023-11-24",
      "trip_name": "Bubble Gum",
      "image_url": "",
      "locations": [
        {
          "country": "캄보디아"
        },
        {
          "country": "태국"
        }
      ]
    },
    {
      "id": 3,
      "start_date": "2024-01-01",
      "end_date": "2024-01-12",
      "trip_name": "How Sweet",
      "image_url": "",
      "locations": [
        {
          "country": "영국"
        },
        {
          "country": "프랑스"
        }
      ]
    },
    {
      "id": 2,
      "start_date": "2024-07-08",
      "end_date": "2024-07-12",
      "trip_name": "Supernatural",
      "image_url": "",
      "locations": [
        {
          "country": "일본"
        },
        {
          "country": "한국"
        }
      ]
    }
  ]

  // AI 스케치 모달 창
  const [isSketchOpen, setisSketchOpen] = useState(false);

  const navigate = useNavigate();

  const toCreate = () => {
    navigate('/trip/create');
  }

  const toDetail = (tripId) => {
    navigate(`/trip/${tripId}`);
  }

  const toGallery = (tripId) => {
    navigate(`/gallery/${tripId}`);
  };

  const openModal = (event) => {
    // 이벤트 버블링 방지
    event.stopPropagation();
    setisSketchOpen(true);
  }

  const closeModal = () => {
    setisSketchOpen(false);
  }

  // 날짜 계산
  const dayDifference = (startDate, endDate) => {
    return (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
  }

  return (
    <>
      {/* 좌우 스크롤 */}
      <div className='d-flex'>
        {/* 사용자 프로필 */}
        <div className='profile'>
          <IconButton className='create-btn' onClick={toCreate}>
            <AddIcon />
          </IconButton>
        </div>

        {/* 현재와 미래 여행 */}
        {currentTrips.map((trip) => (
          <span className='current-trip' key={trip.id} onClick={() => toDetail(trip.id)}>
            {trip.locations[0].country}
          </span>
        ))}

        {futureTrips.map((trip) => (
          <span className='future-trip' key={trip.id} onClick={() => toDetail(trip.id)}>
            {trip.locations[0].country}
          </span>
        ))}
      </div>

      {/* 과거 여행 */}
      <div className='past'>
        {/* pastTrips 배열 순회 */}
        {pastTrips.map((trip) => (
          <div key={trip.id} className="past-trip" onClick={() => toGallery(trip.id)}>
            <div>{trip.locations[0].country}</div>
            <div>{dayDifference(trip.start_date, trip.end_date) - 1}박 {dayDifference(trip.start_date, trip.end_date)}일</div>
            <div>시작일 : {trip.start_date}</div>
            <div>종료일 : {trip.end_date}</div>

            {/* AI 스케치 버튼 */}
            <IconButton className='sketch-btn' onClick={openModal}>
              <AddIcon />
            </IconButton>
          </div>
        ))}
      </div>

      {/* AI 스케치 모달 창 */}
      <SketchModal isOpen={isSketchOpen} onClose={closeModal} />
    </>
  )
}


export default TripPage;