import React, { useEffect, useState, useRef, startTransition } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useRouteError } from 'react-router-dom';
import styles from '@/styles/TripPage.module.css';

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
  const userInfo = useUserStore((state) => state.userInfo);
  const fetchTrips = useTripStore((state) => state.fetchTrips);

  // const currentTrip = useTripStore((state) => state.currentTrip);
  const pastTrips = usePastTripStore((state) => state.pastTrips);
  const futureTrips = useFutureTripStore((state) => state.futureTrips);
  const currentTrips = useTripStore((state) => state.currentTrip)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTrips();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    
  }, [fetchTrips]);

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
    <div className={styles.mainContainer}>
      {/* 좌우 스크롤 */}
      <div className={styles.upper}>
        {/* 사용자 프로필 */}
        <div className={styles.profile}>
          {userInfo.profileImage && <img src={userInfo.profileImage} alt={userInfo.nickName} className={styles.tripCircleImage} />}
          <IconButton className={styles.createButton} onClick={toCreate}>
            <AddIcon />
          </IconButton>
        </div>

        {/* 현재 여행 */}
        {currentTrips.map((trip) => (
          <div className={styles.currentTrip} key={trip.id} onClick={() => toDetail(trip.id)}>
            {trip.image_url && <img src={trip.image_url} alt={trip.trip_name} className={styles.tripCircleImage} />}
          </div>
        ))}

        {/* 미래 여행 */}
        {futureTrips.map((trip) => (
          <div className={styles.futureTrip} key={trip.id} onClick={() => toDetail(trip.id)}>
            {trip.image_url && <img src={trip.image_url} alt={trip.trip_name} className={styles.tripCircleImage} />}
          </div>
        ))}
      </div>

      {/* 과거 여행 */}
      <div className={styles.past}>
        {pastTrips.map((trip) => (
          <div key={trip.id} className={styles.pastTrip} onClick={() => toGallery(trip.id)}>
            {trip.image_url && <img src={trip.image_url} alt={trip.tripName} className={styles.tripImage} />}
            <div className={styles.pastTripContent}>
              <div className={styles.location}>
                {trip.locations[0].country} {trip.locations[1]?.country ? `· ${trip.locations[1].country}` : ""}
              </div>
              <div className={styles.dateLength}>{dayDifference(trip.startDate, trip.endDate) - 1}박 {dayDifference(trip.startDate, trip.endDate)}일</div>
              <div className={styles.date}>시작일 : {trip.startDate}</div>
              <div className={styles.date}>종료일 : {trip.endDate}</div>
            </div>
            <IconButton className={styles.sketchBtn} onClick={(event) => openModal(event, trip.id, trip.imageUrl)}>
              <AddIcon />
            </IconButton>
          </div>
        ))}
      </div>

      <SketchModal isOpen={isSketchOpen} onClose={closeModal} tripId={sketchTripId} imageUrl={sketchImageUrl} />
    </div>
  );
};


export default TripPage;