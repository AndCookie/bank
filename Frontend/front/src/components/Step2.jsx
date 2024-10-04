import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axios'; // axiosInstance import
import styles from './styles/Steps.module.css'

const StepTwo = ({ formData, updateFormData }) => {
  const [memberEmail, setMemberEmail] = useState('');
  const [friends, setFriends] = useState([]); // friends 데이터 관리할 상태

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

  const addMember = () => {
    if (memberEmail && !formData.members.some(member => member.email === memberEmail)) {
      updateFormData({
        members: [...formData.members, { email: memberEmail }]
      });
      setMemberEmail('');
    }
  };

  const removeMember = (index) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    updateFormData({ members: updatedMembers });
  };

  return (
    <div>
      <h2>멤버 선택하기</h2>

      {/* 친구 목록 렌더링 */}
      <div>
        <h3>친구 목록</h3>
        <ul>
          {friends.map((friend, index) => (
            <li key={index}>{friend.name} ({friend.email})</li>
          ))}
        </ul>
      </div>

      <input
        type="text"
        placeholder="Add Member Email"
        value={memberEmail}
        onChange={(e) => setMemberEmail(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && addMember()}
      />
      <button onClick={addMember}>+ 멤버 추가</button>

      {/* 멤버 리스트 */}
      <ul>
        {formData.members.map((member, index) => (
          <li key={index}>
            {member.email} <button onClick={() => removeMember(index)}>X</button>
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