import { create } from 'zustand';
import paris from '@/assets/images/paris.jpeg';
import bali from '@/assets/images/bali.jpeg';
import cambodia from '@/assets/images/cambodia.jpg';

export const usePastTripStore = create((set) => ({
  // 과거 여행 정보
  pastTrips: [
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
  ],

  // 과거 여행 정보 저장
  setPastTrips: (tripInfo) => set(() => ({
    pastTrips: Array.isArray(tripInfo)
      ? tripInfo.map(trip => ({
        id: trip.id,
        startDate: trip.start_date,
        endDate: trip.end_date,
        tripName: trip.trip_name,
        locations: trip.locations,
      }))
      : [],
  })),
}));