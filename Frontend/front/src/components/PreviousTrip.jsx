import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/axios"; // axiosInstance import
import { format, parseISO } from "date-fns"; // parseISO 함수 추가
import styles from "./styles/PreviousTrip.module.css";
import member1 from "../assets/images/member/member1.png";
import member2 from "../assets/images/member//member2.png";
import member3 from "../assets/images/member/member3.png";
import member4 from "../assets/images/member/member4.png";

const PreviousTrip = () => {
  const { tripId } = useParams(); // URL에서 tripId 추출
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState("");

  const images = [member1, member2, member3, member4];

  // 여행 상세 정보를 가져오는 함수
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axiosInstance.get("/trips/detail/", {
          params: { trip_id: tripId }, // tripId를 파라미터로 전달
        });
        const tripData = response.data;

        setSelectedTrip(tripData); // 여행 데이터를 상태에 저장
        setLoading(false);

        // 여행 기간 계산
        const { start_date, end_date } = tripData;
        if (start_date && end_date) {
          const start = parseISO(start_date);
          const end = parseISO(end_date);
          const diffTime = end.getTime() - start.getTime();
          const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const totalNights = totalDays - 1;
          setDuration(`${totalNights}박 ${totalDays}일`);
        }
      } catch (err) {
        console.error(err);
        setError("여행 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  // 로딩 중일 때 로딩 메시지 표시
  if (loading) return <div>로딩 중...</div>;

  // 에러가 발생했을 때 에러 메시지 표시
  if (error) return <div>{error}</div>;

  // 여행 데이터가 없을 경우 처리
  if (!selectedTrip) return <div>해당 여행 데이터를 찾을 수 없습니다.</div>;

  const { start_date, end_date, locations, members } = selectedTrip;

  // 날짜 포맷 함수
  const formatDay = (date) => format(parseISO(date), "yyyy년 MM월 dd일");

  // 멤버 이미지
  const getImagePath = (index) => {
    return images[index % images.length];
  };

  // member1과 member2는 padding-left를 20px로 설정
  const calculatePaddingLeft = (index) => {
    if (index === 0) {
      return "25px";
    } else if (index === 1) {
      return "18px";
    } else if (index === 2) {
      return "6px";
    }
    return "5px";
  };

  return (
    <>
      {/* 여행 별칭 섹션 */}
      <div className={(styles.nickname, styles.trip)}>
        <div className={styles.tripName}>
          {selectedTrip.trip_name}
        </div>
       
      </div>

      {/* 여행 날짜 섹션 */}
      <div className={(styles.date, styles.trip)}>
        <div className={styles.title}>
          <div>날짜</div>
          <div className={styles.subtitle}>{duration}</div>
        </div>
        <div className={styles.content}>
          <div>시작일 &nbsp; | &nbsp; {formatDay(start_date)}</div>
          <div>종료일 &nbsp; | &nbsp; {formatDay(end_date)}</div>
        </div>
      </div>

      {/* 여행 국가 섹션 */}
      <div className={(styles.country, styles.trip)}>
        <div className={styles.title}>
          <div>국가</div>
          <div className={styles.subtitle}>{locations.length}개</div>
        </div>
        <div className={styles.content}>
          {locations.map((location, index) => (
            <div key={index}>{location.country}</div>
          ))}
        </div>
      </div>

      {/* 멤버 리스트 섹션 */}
      <div className={(styles.member, styles.trip)}>
        <div className={styles.title}>
          <div>멤버</div>
          <div className={styles.subtitle}>{members.length}명</div>
        </div>
        <div className={(styles.content, styles.backgroundMember)}>
          {members.map((member, index) => (
            <div
              key={index}
              className={styles.memberList}
              style={{
                backgroundImage: `url(${getImagePath(index)})`,
                paddingLeft: calculatePaddingLeft(index),
              }}
            >
              <div className={styles.memberImage}>
                <div className={styles.memberName}>{member.first_name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PreviousTrip;
