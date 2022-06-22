/* eslint-disable operator-linebreak */
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Input from 'components/input';
import Helmet from 'components/helmet';
import LoadingButton from 'components/button/loading';

import createCompany from 'utils/company/create';
import verifyEmail from 'utils/input/verifyEmail';
import verifyPassword from 'utils/input/verifyPassword';
import onlyNumber from 'utils/input/onlyNumber';

import errorConfigs from 'configs/error';
import titleConfigs from 'configs/title';

import styles from './index.module.scss';

const CompanyCreatePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [companyName, setCompanyName] = useState();
  const [registerNumber, setRegisterNumber] = useState();
  const [address, setAddress] = useState();
  const [phone, setPhone] = useState();
  const [bankName, setBankName] = useState();
  const [accountHolderName, setAccountHolderName] = useState();
  const [accountNumber, setAccountNumber] = useState();

  const handleSubmit = async () => {
    if (
      !email ||
      !password ||
      !companyName ||
      !registerNumber ||
      !address ||
      !phone ||
      !bankName ||
      !accountHolderName ||
      !accountNumber
    ) {
      return alert(errorConfigs.emptyValues.msg);
    }
    if (!verifyEmail(email)) {
      return alert(errorConfigs.invalidEmail.msg);
    }
    if (!verifyPassword(password)) {
      return alert(errorConfigs.invalidPassword.msg);
    }
    if (registerNumber.length !== 10) {
      return alert(errorConfigs.invalidRegisterNumber.msg);
    }
    if (phone.length < 10 || phone.length > 11) {
      return alert(errorConfigs.invalidPhone.msg);
    }

    setLoading(true);

    const onSuccess = (uid) => {
      alert('정상 반영되었습니다.');
      router.push(`/company/${uid}`);
    };

    const onError = ({ code }) => {
      switch (code) {
        case errorConfigs.userNotFound.code:
          alert(errorConfigs.userNotFound.msg);
          break;
        case errorConfigs.invalidEmail.code:
          alert(errorConfigs.invalidEmail.msg);
          break;
        case errorConfigs.userDisabled.code:
          alert(errorConfigs.userDisabled.msg);
          break;
        case errorConfigs.wrongPassword.code:
          alert(errorConfigs.wrongPassword.msg);
          break;
        case errorConfigs.existsEmail.code:
          alert(errorConfigs.existsEmail.msg);
          break;
        case errorConfigs.invalidPassword.code:
          alert(errorConfigs.invalidPassword.msg);
          break;
        default:
          alert(errorConfigs.default.msg);
      }
    };

    const companyInfo = {
      email,
      password,
      companyName,
      registerNumber,
      address,
      phone,
      accountHolderName,
      accountNumber,
      bankName,
    };
    createCompany(companyInfo, onSuccess, onError);
  };

  return (
    <>
      <Helmet title={titleConfigs.companyCreateTitle} />
      <div className={styles.container}>
        <div className={styles.header}>파견업체 추가</div>
        <div className={styles['input-wrapper']}>
          <Input
            label="이메일"
            inputType="text"
            placeholder="사용하실 이메일을 입력해주세요"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <Input
            label="비밀번호"
            inputType="password"
            placeholder="사용하실 비밀번호를 입력해주세요"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <Input
            label="업체이름"
            placeholder="업체명을 입력해주세요"
            inputType="text"
            value={companyName}
            onChange={({ target: { value } }) => setCompanyName(value)}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <Input
            label="사업자 등록번호"
            placeholder="업체의 사업자등록번호 10자리를 입력해주세요"
            inputType="text"
            value={registerNumber}
            onChange={({ target: { value } }) => setRegisterNumber(onlyNumber(value))}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <Input
            label="업체주소"
            placeholder="업체의 주소를 입력해주세요"
            inputType="text"
            value={address}
            onChange={({ target: { value } }) => setAddress(value)}
          />
        </div>
        <div className={styles['input-wrapper']} style={{ marginBottom: '48px' }}>
          <Input
            label="전화번호"
            placeholder="업체 담당자 전화번호를 입력해주세요"
            inputType="text"
            value={phone}
            onChange={({ target: { value } }) => setPhone(onlyNumber(value))}
          />
        </div>
        <div className={styles['input-wrapper']} style={{ marginBottom: '48px' }}>
          <Input
            label="은행명"
            placeholder="은행명을 입력해주세요"
            inputType="text"
            value={bankName}
            onChange={({ target: { value } }) => setBankName(value)}
          />
        </div>
        <div className={styles['input-wrapper']} style={{ marginBottom: '48px' }}>
          <Input
            label="예금주"
            placeholder="예금주를 입력해주세요"
            inputType="text"
            value={accountHolderName}
            onChange={({ target: { value } }) => setAccountHolderName(value)}
          />
        </div>
        <div className={styles['input-wrapper']} style={{ marginBottom: '48px' }}>
          <Input
            label="계좌번호"
            placeholder="계좌번호를 입력해주세요"
            inputType="text"
            value={accountNumber}
            onChange={({ target: { value } }) => setAccountNumber(value)}
          />
        </div>
        <LoadingButton
          onClick={handleSubmit}
          text="업체 추가"
          buttonHeight={46}
          loading={loading}
        />
      </div>
    </>
  );
};

export default CompanyCreatePage;
