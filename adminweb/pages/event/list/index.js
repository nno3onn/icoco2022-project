import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Skeleton from 'react-loading-skeleton';

import EventListItem from 'components/listItem/event';
import Helmet from 'components/helmet';
import CreateButton from 'components/button/create';
import Radiobox from 'components/radiobox';

import titleConfigs from 'configs/title';
import pathConfigs from 'configs/path';

import getEventList from 'utils/event/list';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const EventListPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  const [filter, setFilter] = useState('전체');
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const getMoreEvent = async () => {
    setLoading(true);

    const list = await getEventList({ filter, offset });

    if (list) {
      if (list.length < 6) {
        setTarget(null);
      }
      setData(data.concat(list));
      setOffset(offset + list.length);
    }
    setLoading(false);
  };

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      getMoreEvent();
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

  useEffect(async () => {
    setData([]);
    setOffset(0);
    setLoading(true);

    const list = await getEventList({ filter, offset: 0 });

    if (list) {
      if (list.length < 6) {
        setTarget(null);
      }
      setData(list);
      setOffset(list.length);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    getMoreEvent();
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.eventListTitle} />
      <div className={styles.container}>
        <div className={styles.header}>이벤트</div>
        <div className={styles['filter-section']}>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="전체" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="이벤트 진행" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="이벤트 종료" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="당첨자발표" />
          </div>
        </div>
        <div className={styles.divided} />
        <div className={styles['list-wrapper']}>
          {data && data.length ? (
            <>
              {data.map((e, i) => (
                <Link key={String(v4())} href={`/event/${String(e.objectID)}`}>
                  <div className={styles[`${i % 3 === 1 ? 'event-center' : 'event-margin'}`]}>
                    <EventListItem data={e} />
                  </div>
                </Link>
              ))}
              <div ref={setTarget} />
            </>
          ) : null}
          {loading && (
            <>
              {new Array(9).fill().map((e, i) => (
                <Skeleton
                  key={String(i)}
                  className={styles[`${i % 3 === 1 ? 'event-center' : 'event-margin'}`]}
                  width={273}
                  height={167}
                />
              ))}
            </>
          )}
        </div>
        <div className={styles['button-wrapper']}>
          <CreateButton onClick={() => router.push(pathConfigs.event.create)} text="이벤트 추가" />
        </div>
      </div>
    </>
  );
};

export default EventListPage;
