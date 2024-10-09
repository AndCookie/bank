import { create } from 'zustand';

// assets 폴더에서 이미지 불러오기
import img1 from '@/assets/images/random/img1.jpg';
import img2 from '@/assets/images/random/img2.jpg';
import img3 from '@/assets/images/random/img3.jpg';
import img4 from '@/assets/images/random/img4.jpg';
import img5 from '@/assets/images/random/img5.jpg';
import img6 from '@/assets/images/random/img6.jpg';
export const useFutureTripStore = create((set) => ({
  // 미래 여행 정보
  futureTrips: [],

  // 랜덤 이미지를 선택하는 함수
  getRandomImage: () => {
    const images = [img1, img2, img3, img4, img5, img6];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  },

  // 미래 여행 정보 저장
  setFutureTrips: (tripInfo) => set(() => ({
    futureTrips: Array.isArray(tripInfo)
      ? tripInfo.map(trip => ({
        id: trip.id,
        startDate: trip.start_date,
        endDate: trip.end_date,
        tripName: trip.trip_name,
        locations: trip.locations,
        // 이미지가 없으면 랜덤 이미지 사용
        image_url: trip.image_url || useFutureTripStore.getState().getRandomImage(),
      }))
      : [],
  })),
}));