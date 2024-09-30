import React, { useEffect, useState, useRef, startTransition } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useRouteError } from 'react-router-dom';
import '@/styles/TripPage.css';

import { useUserStore } from '@/stores/userStore';
import { useTripStore } from '@/stores/tripStore';
import { usePastTripStore } from '@/stores/pastTripStore';
import { useFutureTripStore } from '@/stores/futureTripStore';

import SketchModal from '@/components/SketchModal';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import cambodia from '@/assets/images/cambodia.jpg';
import paris from '@/assets/images/paris.jpeg';
import bali from '@/assets/images/bali.jpeg';
import soldier from '@/assets/images/soldier.jpg';
import hwaseong from '@/assets/images/hwaseong.jpg';


const TripPage = () => {
  const fetchToken = useUserStore((state) => state.fetchToken);
  const fetchTrips = useTripStore((state) => state.fetchTrips);

  // const currentTrip = useTripStore((state) => state.currentTrip);
  // const pastTrips = usePastTripStore((state) => state.pastTrips);
  // const futureTrips = useFutureTripStore((state) => state.futureTrips);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchToken();
        await fetchTrips();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [fetchToken, fetchTrips]);

  const currentTrips = [
    {
      "id": 5,
      "start_date": "2024-09-15",
      "end_date": "2024-10-15",
      "trip_name": "SSAFY 특화 프로젝트",
      "image_url": soldier,
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
      "image_url": hwaseong,
      "locations": [
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
    },
    {
      id: 8,
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
      "id": 4,
      "start_date": "2023-11-15",
      "end_date": "2023-11-24",
      "trip_name": "Bubble Gum",
      "image_url": cambodia,
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
      "image_url": paris,
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
      "image_url": bali,
      "locations": [
        {
          "country": "오키나와"
        },
        {
          "country": "미야코지마"
        }
      ]
    }
  ]

  // AI 스케치 모달 창
  const [isSketchOpen, setisSketchOpen] = useState(false);
  const [sketchTripId, setSketchTripId] = useState(null);
  const [sketchImageUrl, setSketchImageUrl] = useState('');

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

  const openModal = (event, tripId, imageUrl) => {
    // 이벤트 버블링 방지
    event.stopPropagation();
    setisSketchOpen(true);
    setSketchTripId(tripId);
    setSketchImageUrl(imageUrl);
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

        {/* 현재 여행 */}
        {currentTrips.map((trip) => (
          <div className='current-trip' key={trip.id} onClick={() => toDetail(trip.id)}>
            {trip.image_url && <img src={trip.image_url} alt={trip.trip_name} className="trip-circle-image" />}
          </div>
        ))}

        {/* 미래 여행 */}
        {futureTrips.map((trip) => (
          <div className='future-trip' key={trip.id} onClick={() => toDetail(trip.id)}>
            {trip.image_url && <img src={trip.image_url} alt={trip.trip_name} className="trip-circle-image" />}
          </div>
        ))}
      </div>

      {/* 과거 여행 */}
      <div className='past'>
        {/* pastTrips 배열 순회 */}
        {pastTrips.map((trip) => (
          <div key={trip.id} className="past-trip" onClick={() => toGallery(trip.id)}>
            {/* 이미지 표시 */}
            {trip.image_url && <img src={trip.image_url} alt={trip.trip_name} className="trip-image" />}
            
            {/* 텍스트와 AI 스케치 버튼 */}
            <div className="past-trip-content">
              <div className='location'>{trip.locations[0].country} {trip.locations[1]?.country ? `· ${trip.locations[1].country}` : ""}</div>
              <div className='date-length'>{dayDifference(trip.start_date, trip.end_date) - 1}박 {dayDifference(trip.start_date, trip.end_date)}일</div>
              <div className='date'>시작일 : {trip.start_date}</div>
              <div className='date'>종료일 : {trip.end_date}</div>
            </div>

            {/* AI 스케치 버튼 */}
            <IconButton className='sketch-btn' onClick={(event) => openModal(event, trip.id, trip.imageUrl)}>
              <AddIcon />
            </IconButton>
          </div>
        ))}
      </div>

      {/* AI 스케치 모달 창 */}
      <SketchModal isOpen={isSketchOpen} onClose={closeModal} tripId={sketchTripId} imageUrl={sketchImageUrl} />
    </div>
  )
}


export default TripPage;