import React, { useState, useEffect } from 'react';
import styles from './styles/Steps.module.css';
import axiosInstance from '@/axios.js';

const StepThree = ({ formData, updateFormData }) => {
  const [bankAccounts, setBankAccounts] = useState([]); // 계좌 목록을 관리할 상태
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
    // 선택된 계좌 정보를 bankAccounts에서 찾음
    const selectedAccount = bankAccounts.find(account => account.accountNo === selectedAccountNo);

    if (selectedAccount) {
      updateFormData({
        bank_account: selectedAccount.accountNo, // 계좌 번호
        bank_name: selectedAccount.bankName, // 은행 이름 추가
      });
    }
  };

  return (
    <div>
      <h2>정산 계좌 선택</h2>
      {loading ? (
        <p>계좌 목록을 불러오는 중...</p>
      ) : (
        <select
          value={formData.bank_account || ''} // 선택된 계좌가 없으면 빈 값
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
      )}
    </div>
  );
};

export default StepThree;