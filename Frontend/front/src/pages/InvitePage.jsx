import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams를 import
import axiosInstance from '@/axios.js';
import styles from '@/styles/InvitePage.module.css'; // 스타일 파일

const InvitePage = () => {
  const { tripId } = useParams(); // URL에서 tripId 가져오기
  const [bankAccounts, setBankAccounts] = useState([]); // 계좌 목록 상태
  const [selectedAccount, setSelectedAccount] = useState(''); // 선택된 계좌 번호
  const [selectedBankName, setSelectedBankName] = useState(''); // 선택된 은행 이름
  const [budget, setBudget] = useState(''); // 예산 입력 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const response = await axiosInstance.get('/bank_accounts/');
        setBankAccounts(response.data); // 계좌 목록을 state에 저장
        setLoading(false); // 로딩 완료
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
        setLoading(false); // 오류 발생 시에도 로딩 완료
      }
    };

    fetchBankAccounts(); // 컴포넌트가 마운트될 때 계좌 목록 요청
  }, []);

  const handleAccountSelect = (e) => {
    const selectedAccountNo = e.target.value;
    const selectedAccountData = bankAccounts.find(account => account.accountNo === selectedAccountNo);

    if (selectedAccountData) {
      setSelectedAccount(selectedAccountData.accountNo); // 선택된 계좌 번호 설정
      setSelectedBankName(selectedAccountData.bankName); // 선택된 은행 이름 설정
    }
  };

  const handleBudgetChange = (e) => {
    setBudget(e.target.value); // 예산 설정
  };

  const handleSubmit = () => {
    // POST 요청에 포함할 request body
    const payload = {
      trip_id: tripId,
      budget,
      bank_account: selectedAccount,
      bank_name: selectedBankName
    };

    axiosInstance.post('/trips/invite/', payload)
      .then(response => {
        console.log('Invite accepted:', response.data);
        // 성공 시 처리 로직
      })
      .catch(error => {
        console.error('Error accepting invite:', error);
        // 오류 처리
      });
  };

  return (
    <div>
      <h4>초대 수락하기</h4>
      {loading ? (
        <p>계좌 목록을 불러오는 중...</p>
      ) : (
        <div>
          <select
            value={selectedAccount}
            onChange={handleAccountSelect}
            className={styles.dropdown}
          >
            <option value="" disabled>계좌를 선택하세요</option>
            {bankAccounts.map((account, index) => (
              <option key={index} value={account.accountNo}>
                {account.bankName}: {account.accountNo}
              </option>
            ))}
          </select>

          {/* 예산 입력 */}
          <input
            type="number"
            placeholder="예산 입력"
            value={budget}
            onChange={handleBudgetChange}
            className={styles.budgetInput}
          />

          {/* 초대 수락 버튼 */}
          <button onClick={handleSubmit} className={styles.submitButton}>
            초대 수락
          </button>
        </div>
      )}
    </div>
  );
};

export default InvitePage;
