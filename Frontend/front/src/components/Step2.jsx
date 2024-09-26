import React, { useState } from 'react';

const StepTwo = ({ formData, updateFormData }) => {
  const [memberEmail, setMemberEmail] = useState('');

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
        value={formData.trip_name}
        onChange={(e) => updateFormData({ trip_name: e.target.value })}
      />
    </div>
  );
};

export default StepTwo;