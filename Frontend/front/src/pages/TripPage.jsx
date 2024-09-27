import React, { useEffect, useState, useRef, startTransition } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import '@/styles/TripPage.css';

import { useTripStore } from '@/stores/tripStore';
import { usePastTripStore } from '@/stores/pastTripStore';
import { useFutureTripStore } from '@/stores/futureTripStore';

import SketchModal from '@/components/SketchModal';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

const TripPage = () => {
  const fetchTrips = useTripStore((state) => state.fetchTrips);

  // const currentTrip = useTripStore((state) => state.currentTrip);
  // const pastTrips = usePastTripStore((state) => state.pastTrips);
  // const futureTrips = useFutureTripStore((state) => state.futureTrips);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const currentTrips = [
    {
      id: 4,
      startDate: "2024-09-15",
      endDate: "2024-10-15",
      tripName: "SSAFY 특화 프로젝트",
      imageUrl: "",
      locations: [
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
      id: 5,
      startDate: "2024-11-01",
      endDate: "2024-12-01",
      tripName: "화성 갈끄니깐",
      imageUrl: "",
      locations: [
        {
          "country": "화성"
        }
      ]
    },
    {
      id: 6,
      startDate: "2024-11-01",
      endDate: "2024-12-01",
      tripName: "화성 갈끄니깐",
      imageUrl: "",
      locations: [
        {
          "country": "화성"
        }
      ]
    },
    {
      id: 7,
      startDate: "2024-11-01",
      endDate: "2024-12-01",
      tripName: "화성 갈끄니깐",
      imageUrl: "",
      locations: [
        {
          "country": "화성"
        }
      ]
    }
  ]

  const pastTrips = [
    {
      id: 4,
      startDate: "2023-11-15",
      endDate: "2023-11-24",
      tripName: "Bubble Gum",
      imageUrl: "",
      locations: [
        {
          "country": "캄보디아"
        },
        {
          "country": "태국"
        }
      ]
    },
    {
      id: 3,
      startDate: "2024-01-01",
      endDate: "2024-01-12",
      tripName: "How Sweet",
      imageUrl: "",
      locations: [
        {
          "country": "영국"
        },
        {
          "country": "프랑스"
        }
      ]
    },
    {
      id: 2,
      startDate: "2024-07-08",
      endDate: "2024-07-12",
      tripName: "Supernatural",
      imageUrl: "",
      locations: [
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
    <div className='main-container'>
      {/* 좌우 스크롤 */}
      <div className='d-flex upper'>
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
            <div>{dayDifference(trip.startDate, trip.endDate) - 1}박 {dayDifference(trip.start_date, trip.end_date)}일</div>
            <div>시작일 : {trip.startDate}</div>
            <div>종료일 : {trip.endDate}</div>

            {/* AI 스케치 버튼 */}
            <IconButton className='sketch-btn' onClick={openModal}>
              <AddIcon />
            </IconButton>
          </div>
        ))}
      </div>

      {/* AI 스케치 모달 창 */}
      <SketchModal isOpen={isSketchOpen} onClose={closeModal} />
    </div>
  )
}


export default TripPage;