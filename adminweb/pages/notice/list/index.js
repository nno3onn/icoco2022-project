import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { v4 } from 'uuid';

import NoticeListItemComponent from 'components/listItem/notice';
import Helmet from 'components/helmet';
import CreateButton from 'components/button/create';

import titleConfigs from 'configs/title';
import pathConfigs from 'configs/path';

import getNoticeList from 'utils/notice/list';
import countNotice from 'utils/notice/count';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const NoticeListPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  const [target, setTarget] = useState(null);
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const getMoreNotice = async () => {
    setLoading(true);

    const res = await getNoticeList(offset);

    if (res) {
      if (res.length < 8) {
        setTarget(null);
      }
      setData(data.concat(res));
      setOffset(offset + res.length);
    }
    setLoading(false);
  };

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      getMoreNotice();
    }
  };

  useEffect(() => {
    let observer;
    if (target && !loading) {
      observer = new IntersectionObserver(onIntersect, { threshold: 0.4 });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [loading]);

  useEffect(() => {
    getMoreNotice();
    countNotice(setCount);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.noticeListTitle} />
      <div className={styles.container}>
        <div className={styles.header}>공지사항</div>
        <div className={styles['table-wrapper']}>
          <div className={styles['table-header']}>
            <div className={styles.f1}>번호</div>
            <div className={styles.f7}>제목</div>
            <div className={styles.f2}>작성일자</div>
          </div>
          {data && data.length ? (
            <>
              {data.map((notice, index) => (
                <Link href={`/notice/${notice.objectID}`} key={String(v4())}>
                  <div className={styles['notice-margin']}>
                    <NoticeListItemComponent index={count - index} data={notice} />
                  </div>
                </Link>
              ))}
              <div ref={setTarget} />
            </>
          ) : null}
          {loading && (
            <Skeleton className={styles['notice-margin']} width={996} height={78} count={5} />
          )}
        </div>
        <div className={styles['button-wrapper']}>
          <CreateButton
            onClick={() => router.push(pathConfigs.notice.create)}
            text="공지사항 추가"
          />
        </div>
      </div>
    </>
  );
};

export default NoticeListPage;
