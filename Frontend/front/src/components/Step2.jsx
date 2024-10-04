import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axios'; // axiosInstance import
import styles from './styles/Steps.module.css';

const StepTwo = ({ formData, updateFormData }) => {
  const [friends, setFriends] = useState([]); // friends 데이터 관리할 상태
  const [selectedMember, setSelectedMember] = useState(''); // 선택된 멤버 관리

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

  const addMember = (friend) => {
    // 이미 추가된 멤버가 아닌 경우에만 추가
    if (!formData.members.some(member => member.profile_nickname === friend.profile_nickname)) {
      updateFormData({
        members: [...formData.members, { 
          profile_nickname: friend.profile_nickname,
          profile_image: friend.profile_thumbnail_image
        }]
      });
      setSelectedMember(''); // 드롭다운 선택 초기화
    }
  };

  const removeMember = (index) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    updateFormData({ members: updatedMembers });
  };

  return (
    <div>
      <h2>멤버 선택하기</h2>

      {/* 드롭다운으로 친구 선택 */}
      <div>
        <h3>친구 목록</h3>
        <select 
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">친구를 선택하세요</option>
          {friends.map((friend, index) => (
            <option key={index} value={friend.profile_nickname}>
              {friend.profile_nickname}
            </option>
          ))}
        </select>
        <button 
          onClick={() => {
            const friend = friends.find(f => f.profile_nickname === selectedMember);
            if (friend) addMember(friend);
          }}
          disabled={!selectedMember} // 멤버가 선택되지 않으면 버튼 비활성화
        >
          + 멤버 추가
        </button>
      </div>

      {/* 선택된 멤버 리스트 및 프로필 사진 */}
      <h3>선택된 멤버</h3>
      <ul>
        {formData.members.map((member, index) => (
          <li key={index} className={styles.memberItem}>
            <img src={member.profile_image} alt={member.profile_nickname} className={styles.profileImage} />
            {member.profile_nickname}
            <button onClick={() => removeMember(index)}>X</button>
          </li>
        ))}
      </ul>

      {/* 여행 이름 입력 */}
      <input
        type="text"
        placeholder="Trip Name"
        value={formData.tripName}
        onChange={(e) => updateFormData({ tripName: e.target.value })}
      />
    </div>
  );
};

export default StepTwo;
