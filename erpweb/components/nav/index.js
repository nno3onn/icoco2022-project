import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import accountSignOut from 'utils/account/signOut';
import getUnread from 'utils/common/getUnread';

import pathConfigs from 'configs/path';

import styles from './index.module.scss';

const Nav = () => {
  const router = useRouter();
  const { pathname } = router;

  const [unReadR, setUnReadR] = useState();
  const [unReadQ, setUnReadQ] = useState();

  useEffect(async () => {
    const data = await getUnread();
    if (!data) return;

    const { unReadReservation, unReadQuestion } = data;
    setUnReadR(unReadReservation);
    setUnReadQ(unReadQuestion);
  }, [pathname]);

  const handleSignOut = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      accountSignOut();
      router.reload();
    }
  };

  const handleUnRead = (unRead) => {
    if (!unRead) return;

    if (unRead > 99) {
      return <div className={styles.unread}>99+</div>;
    }
    return <div className={styles.unread}>{unRead}</div>;
  };

  const tabStyle = (tab) => `nav-tab${pathname.includes(`/${tab}`) ? '-active' : ''}`;

  return (
    <div className={styles.container}>
      <button type="button" className={styles['logo-wrapper']}>
        <Link href="/">
          <img className={styles.logo} alt="logo" src="/images/logo-white.png" />
        </Link>
      </button>
      <div className={styles['contents-wrapper']}>
        <div className={styles['contents-top']}>
          <Link href={pathConfigs.dashboard}>
            <button type="button" className={styles[tabStyle('dashboard')]}>
              <img alt="dashboard" src="/icons/dashboard.png" />
              <div>대시보드</div>
            </button>
          </Link>
          <Link href={pathConfigs.reservation.default}>
            <button type="button" className={styles[tabStyle('reservation')]}>
              <img alt="plan" src="/icons/plan.png" />
              <div style={{ marginRight: 10 }}>예약관리</div>
              {handleUnRead(unReadR)}
            </button>
          </Link>
          <Link href={pathConfigs.manager.default}>
            <button type="button" className={styles[tabStyle('manager')]}>
              <img alt="manager" src="/icons/manager.png" />
              <div>관리사 관리</div>
            </button>
          </Link>
          <Link href={pathConfigs.question.default}>
            <button type="button" className={styles[tabStyle('question')]}>
              <img alt="question" src="/icons/question.png" />
              <div style={{ marginRight: 10 }}>문의사항</div>
              {handleUnRead(unReadQ)}
            </button>
          </Link>
          <Link href={pathConfigs.information.prefix}>
            <button type="button" className={styles[tabStyle('information')]}>
              <img alt="information" src="/icons/setting.png" />
              <div>업체정보</div>
            </button>
          </Link>
        </div>
        <div className={styles['contents-bottom']}>
          <button type="button" className={styles.button} onClick={handleSignOut}>
            로그아웃
          </button>
          <div className={styles.call}>
            고객센터
            <br />
            010-1234-5678
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
