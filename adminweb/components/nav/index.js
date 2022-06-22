import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import accountSignOut from 'utils/account/signOut';

import pathConfigs from 'configs/path';

import styles from './index.module.scss';

const Nav = () => {
  const router = useRouter();
  const { pathname } = router;

  const handleSignOut = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      accountSignOut();
      router.reload();
    }
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
          <Link href={pathConfigs.company.default}>
            <button type="button" className={styles[tabStyle('company')]}>
              <img alt="company" src="/icons/company.png" />
              <div>업체관리</div>
            </button>
          </Link>
          <Link href={pathConfigs.tip.default}>
            <button type="button" className={styles[tabStyle('tip')]}>
              <img alt="tip" src="/icons/tip.png" />
              <div>육아팁</div>
            </button>
          </Link>
          <Link href={pathConfigs.notice.default}>
            <button type="button" className={styles[tabStyle('notice')]}>
              <img alt="notice" src="/icons/notice.png" />
              <div>공지사항</div>
            </button>
          </Link>
          <Link href={pathConfigs.event.default}>
            <button type="button" className={styles[tabStyle('event')]}>
              <img alt="event" src="/icons/event.png" />
              <div>이벤트</div>
            </button>
          </Link>
          <Link href={pathConfigs.cost.default}>
            <button type="button" className={styles[tabStyle('cost')]}>
              <img alt="cost" src="/icons/cost.png" />
              <div>요금표</div>
            </button>
          </Link>
        </div>
        <button type="button" className={styles['contents-bottom']} onClick={handleSignOut}>
          로그아웃
        </button>
      </div>
    </div>
  );
};
export default Nav;
