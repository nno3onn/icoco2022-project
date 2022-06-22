import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import Input from 'components/input';
import Radiobox from 'components/radiobox';
import Label from 'components/label';
import ReservationTable from 'components/table/reservation';
import CreateButton from 'components/button/create';

import searchReservation from 'utils/reservation/search';
import countReservation from 'utils/reservation/count';
import resetUnRead from 'utils/common/resetUnRead';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const ReservationListPage = () => {
  const [filter, setFilter] = useState('전체');
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [numbers, setNumbers] = useState();

  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const getMoreReservation = async () => {
    setLoading(true);

    const list = await searchReservation({ filter, keyword, offset });

    if (list) {
      if (list.length < 8) {
        setTarget(null);
      }
      setData(data.concat(list));
      setOffset(offset + list.length);
    }
    setLoading(false);
  };

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      getMoreReservation();
    }
  };

  const handleSearch = async () => {
    setData([]);
    setOffset(0);
    setLoading(true);

    const list = await searchReservation({ filter, keyword, offset: 0 });

    if (list) {
      if (list.length < 8) {
        setTarget(null);
      }
      setData(list);
      setOffset(list.length);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  useEffect(() => {
    let observer;
    if (numbers && numbers[filter] === 0) return setLoading(false);

    if (target && !loading) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.4,
      });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [loading]);

  useEffect(() => {
    handleSearch();
  }, [filter]);

  useEffect(async () => {
    getMoreReservation();
    resetUnRead({ type: 'reservation' });

    const num = await countReservation();
    if (num) setNumbers(num);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.reservationListTitle} />
      <div className={styles.container}>
        <div className={styles.heading}>예약관리</div>
        <div className={styles['input-wrapper']}>
          <Input
            value={keyword}
            onChange={({ target: { value } }) => setKeyword(value)}
            onKeyDown={handleKeyDown}
            placeholder="예약 번호 또는 산모명, 도우미명으로 검색할 수 있습니다."
          />
          <button type="button" onClick={handleSearch}>
            <img alt="search" src="/icons/search.png" className={styles.icon} />
          </button>
        </div>
        <div className={styles.divided} />
        <div className={styles['filter-section']}>
          <div className={styles['filter-wrapper']}>
            <Radiobox
              active={filter}
              setter={setFilter}
              text="전체"
              count={numbers && numbers['전체']}
            />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox
              active={filter}
              setter={setFilter}
              text="예약출산일미확정"
              count={numbers && numbers['예약출산일미확정']}
            />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox
              active={filter}
              setter={setFilter}
              text="예약출산일확정"
              count={numbers && numbers['예약출산일확정']}
            />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox
              active={filter}
              setter={setFilter}
              text="파견중"
              count={numbers && numbers['파견중']}
            />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox
              active={filter}
              setter={setFilter}
              text="서비스취소"
              count={numbers && numbers['서비스취소']}
            />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox
              active={filter}
              setter={setFilter}
              text="서비스종료"
              count={numbers && numbers['서비스종료']}
            />
          </div>
        </div>
        <div className={styles['label-section']}>
          <Label active={filter} />
        </div>
        <div className={styles.divided2} />
        <div className={styles['table-section']}>
          {data && data.length !== 0 && <ReservationTable data={data} types={filter} />}
          <div className={styles.loading}>
            {loading && (
              <Skeleton width={996} height={78} count={6} style={{ marginBottom: '20px' }} />
            )}
          </div>
          <div ref={setTarget} />
        </div>
        <div className={styles['button-wrapper']}>
          <Link href="/reservation/create">
            <a>
              <CreateButton text="예약 추가" />
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ReservationListPage;
