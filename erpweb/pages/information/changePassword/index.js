import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Helmet from 'components/helmet';
import Input from 'components/input';
import LoadingButton from 'components/button/loading';

import verifyPassword from 'utils/input/verifyPassword';
import accountChangePassword from 'utils/account/changePassword';

import titleConfigs from 'configs/title';
import errorConfigs from 'configs/error';

import styles from './index.module.scss';

const ChangePassword = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = () => {
    if (!newPassword && !password) {
      return alert('비밀번호를 입력해주세요.');
    }
    if (!verifyPassword(newPassword)) {
      return alert(errorConfigs.invalidPassword);
    }

    setLoading(true);

    const onSuccess = () => {
      alert('정상 반영되었습니다.');
      router.push('/information');
    };

    const onError = ({ code }) => {
      switch (code) {
        case errorConfigs.wrongPassword.code:
          alert('기존 비밀번호가 일치하지 않습니다.');
          break;
        case errorConfigs.later.code:
          alert(errorConfigs.later.msg);
          break;
        default:
          alert('다시 시도해주세요.');
          break;
      }
    };

    const passwordInfo = {
      password,
      newPassword,
    };

    accountChangePassword(passwordInfo, onSuccess, onError);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.passwordUpdateTitle} />
      <div className={styles.container}>
        <Link href="/information">
          <a>
            <img alt="arrow-left" src="/icons/arrow-left-g.png" className={styles.arrow} />
          </a>
        </Link>
        <div className={styles.heading}>비밀번호 변경</div>
        <div className={styles['input-wrapper']}>
          <Input
            placeholder="기존 비밀번호를 입력해주세요"
            value={password}
            inputType="password"
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <Input
            placeholder="변경하실 비밀번호를 입력해주세요"
            value={newPassword}
            inputType="password"
            onChange={({ target: { value } }) => setNewPassword(value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles['action-section']}>
          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            buttonHeight={46}
            text="비밀번호 변경"
          />
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
