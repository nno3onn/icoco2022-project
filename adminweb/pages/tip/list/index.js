/* eslint-disable operator-linebreak */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import TipListItem from 'components/listItem/tip';
import CreateButton from 'components/button/create';
import Radiobox from 'components/radiobox';

import titleConfigs from 'configs/title';
import pathConfigs from 'configs/path';

import getTipList from 'utils/tip/list';

import styles from 'pages/tip/list/list.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const TipListPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  const [filter, setFilter] = useState('전체');
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const getMoreTip = async () => {
    setLoading(true);

    const list = await getTipList({ filter, offset });

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
      getMoreTip();
    }
  };

  useEffect(() => {
    let observer;
    if (target && !loading) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.4,
      });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [loading]);

  useEffect(async () => {
    setData([]);
    setOffset(0);
    setLoading(true);

    const list = await getTipList({ filter, offset: 0 });

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
    getMoreTip();
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.tipListTitle} />
      <div className={styles.container}>
        <div className={styles.header}>육아팁</div>
        <div className={styles['filter-section']}>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="전체" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="도우미정보" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="육아정보" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="정부혜택" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="출산" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="신생아" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="영유아" />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox active={filter} setter={setFilter} text="지역정보" />
          </div>
        </div>
        <div className={styles.divided} />
        <div className={styles['list-wrapper']}>
          {data && data.length ? (
            <>
              {data.map((tip, i) => (
                <Link href={`/tip/${tip.objectID}`} key={String(tip.objectID)}>
                  <div className={styles[`${i % 3 === 1 ? 'tip-margin' : 'tip'}`]}>
                    <TipListItem data={tip} />
                  </div>
                </Link>
              ))}
              <div ref={setTarget} />
            </>
          ) : null}
          {loading &&
            new Array(6).fill().map((e, i) => (
              <div className={styles[`${i % 3 === 1 ? 'tip-margin' : 'tip'}`]}>
                <Skeleton width={273} height={390} />
              </div>
            ))}
        </div>
        <div className={styles['button-wrapper']}>
          <CreateButton onClick={() => router.push(pathConfigs.tip.create)} text="육아팁 추가" />
        </div>
      </div>
    </>
  );
};

export default TipListPage;
