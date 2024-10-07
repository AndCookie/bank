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

  const toggleAccount = (accountNo) => {
    if (formData.bank_account === accountNo) {
      updateFormData({ bank_account: '' }); // 선택 해제
    } else {
      updateFormData({ bank_account: accountNo }); // 계좌 선택
    }
  };

  return (
    <div className={styles.mainContainer}>

      <div className={styles.third}>
        <div className={styles.question}>어떤 계좌를 사용하시나요?</div>

        {/* 선택된 계좌 표시 및 삭제 */}
        {/* <div className={styles.selected}>
          {formData.bank_account ? (
            <div className={styles.selectedAccount}>
              <span>{bankAccounts.find(account => account.accountNo === formData.bank_account)?.bankName}: {formData.bank_account}</span>
              <button onClick={() => updateFormData({ bank_account: '' })}>X</button>
            </div>
          ) : (
            <p>계좌를 선택하세요</p>
          )}
        </div> */}

        <div className={styles.candidates}>
          {/* 계좌 목록 항상 표시 */}
          <div className={styles.dropdownContainer}>
            <div className={styles.accountListContainer}>
              {loading ? (
                <p>계좌 목록을 불러오는 중입니다...</p>
              ) : (
                <ul className={styles.accountList}>
                  {bankAccounts.map((account, index) => {
                    const isSelected = formData.bank_account === account.accountNo;
                    return (
                      <li
                        key={index}
                        className={`${styles.accountItem} ${isSelected ? styles.selected : ''}`}
                        onClick={() => toggleAccount(account.accountNo)}
                      >
                        {account.bankName}: {account.accountNo}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
