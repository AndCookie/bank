import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axios'; // axiosInstance import
import styles from './styles/Steps.module.css';

const StepTwo = ({ formData, updateFormData }) => {
  const [friends, setFriends] = useState([]); // friends 데이터 관리할 상태
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 상태 관리

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get('/accounts/friend/');
        setFriends(response.data); // 응답 데이터를 friends에 저장
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends(); // 컴포넌트가 마운트될 때 friends 데이터 가져옴
  }, []);

  const toggleMember = (friend) => {
    const isSelected = formData.members.some(member => member.profile_nickname === friend.profile_nickname);

    if (isSelected) {
      // 선택 해제
      const updatedMembers = formData.members.filter(member => member.profile_nickname !== friend.profile_nickname);
      updateFormData({ members: updatedMembers });
    } else {
      // 선택 추가
      const updatedMembers = [...formData.members, friend]; // friend 전체 데이터를 members에 추가
      updateFormData({ members: updatedMembers });
    }
  };

  const removeMember = (index) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    updateFormData({ members: updatedMembers });
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown); // 드롭다운 토글
  };

  return (
    <div>
      <h2>멤버 선택하기</h2>

      {/* 친구 초대하기 버튼 */}
      <button onClick={handleDropdownToggle} className={styles.inviteButton}>
        친구 초대하기
      </button>

      {/* 드롭다운 형식으로 친구 선택 */}
      {showDropdown && (
        <div className={styles.dropdownContainer}>
          <h3>친구 목록</h3>
          <div className={styles.friendListContainer}>
            {friends.length > 0 ? (
              <ul className={styles.friendList}>
                {friends.map((friend, index) => {
                  const isSelected = formData.members.some(member => member.profile_nickname === friend.profile_nickname);
                  return (
                    <li 
                      key={index}
                      className={`${styles.friendItem} ${isSelected ? styles.selected : ''}`} // 선택 시 스타일 변경
                      onClick={() => toggleMember(friend)}
                    >
                      <img src={friend.profile_thumbnail_image} alt={friend.profile_nickname} className={styles.friendImage} />
                      {friend.profile_nickname}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>친구 목록을 불러오는 중입니다...</p>
            )}
          </div>
        </div>
      )}

      {/* 선택된 멤버 리스트 및 프로필 사진 */}
      <h3>선택된 멤버</h3>
      <ul>
        {formData.members.map((member, index) => (
          <li key={index} className={styles.memberItem}>
            <img src={member.profile_thumbnail_image} alt={member.profile_nickname} className={styles.profileImage} />
            {member.profile_nickname}
            <button onClick={() => removeMember(index)}>X</button>
          </li>
        ))}
      </ul>

      {/* 여행 이름 입력 */}
      <input
        type="text"
        placeholder="Trip Name"
        value={formData.trip_name}
        onChange={(e) => updateFormData({ trip_name: e.target.value })}
      />
    </div>
  );
};

export default StepTwo;
