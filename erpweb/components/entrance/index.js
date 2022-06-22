import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import LoadingButton from 'components/button/loading';
import EntranceModal from 'components/modal/entrance';
import Helmet from 'components/helmet';
import Input from 'components/input';

import accountSignOut from 'utils/account/signOut';

import titleConfigs from 'configs/title';
import errorConfigs from 'configs/error';

import styles from './index.module.scss';

const Entrance = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (email.length === 0 || password.length === 0) {
      alert(errorConfigs.emptyValues.msg);
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const r = await user.getIdTokenResult();

      router.reload();

      if (!r.claims.isCompany) {
        accountSignOut();
        alert(errorConfigs.permissionDenied.msg);
      }
    } catch ({ code }) {
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
        default:
          alert(errorConfigs.default.msg);
      }
      setLoading(false);
    }
  };

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 13) handleSubmit();
  };

  return (
    <>
      {isOpen && <EntranceModal opener={setIsOpen} />}
      <Helmet title={titleConfigs.signInTitle} />
      <div className={styles['global-wrapper']}>
        <div className={styles['global-upper']}>
          <img src="/images/logo.png" className={styles.logo} alt="icoco-logo" />
          <div className={styles['input-wrapper']}>
            <div className={styles.label}>아이디</div>
            <Input
              placeholder="아이디를 입력해주세요"
              inputType="text"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className={styles['input-wrapper']}>
            <div className={styles.label}>비밀번호</div>
            <Input
              placeholder="비밀번호를 입력해주세요"
              inputType="password"
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className={styles['entrance-button-wrapper']}>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit}
              text="로그인하기"
              buttonHeight={46}
            />
          </div>
          <button
            type="button"
            className={styles['entrance-action-label']}
            onClick={() => setIsOpen(true)}
          >
            로그인 및 업체가입 문의
          </button>
        </div>
      </div>
    </>
  );
};

export default Entrance;
