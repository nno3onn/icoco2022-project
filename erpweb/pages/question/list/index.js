import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import QuestionTable from 'components/table/question';
import Radiobox from 'components/radiobox';

import titleConfigs from 'configs/title';

import getQuestionList from 'utils/question/list';
import countQuestion from 'utils/question/count';
import resetUnRead from 'utils/common/resetUnRead';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const QuestionListPage = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [numbers, setNumbers] = useState();

  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [stopGet, setStopGet] = useState(false);

  const getMoreQuestion = async () => {
    setLoading(true);

    const onSuccess = (res) => {
      if (res) {
        if (res.length < 8) {
          setStopGet(true);
        }
        setData(data.concat(res));
        setOffset(offset + res.length);
      }
      setLoading(false);
    };

    const onError = () => {
      setLoading(false);
    };

    getQuestionList({ filter, offset }, onSuccess, onError);
  };

  const onIntersect = ([entry], observer) => {
    if (entry.isIntersecting) {
      getMoreQuestion();
      observer.observe(entry.target);
    }
  };

  useEffect(() => {
    let observer;
    if (numbers && numbers[filter] === 0) return setLoading(false);

    if (!stopGet && target && !loading) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.4,
      });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [loading]);

  useEffect(() => {
    setOffset(0);
    setLoading(true);
    setData([]);
    setStopGet(false);

    const onSuccess = (res) => {
      if (!res) return setData([]);

      if (res) {
        if (res.length < 8) {
          setStopGet(true);
        }
        setData(res);
        setOffset(res.length);
      }
      setLoading(false);
    };

    const onError = () => setLoading(false);

    getQuestionList({ filter, offset: 0 }, onSuccess, onError);
  }, [filter]);

  useEffect(async () => {
    getMoreQuestion();
    resetUnRead({ type: 'question' });

    const count = await countQuestion();
    if (count) setNumbers(count);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.questionListTitle} />
      <div className={styles.container}>
        <div className={styles.header}>문의사항</div>
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
              text="답변 대기 중"
              count={numbers && numbers['답변대기중']}
            />
          </div>
          <div className={styles['filter-wrapper']}>
            <Radiobox
              active={filter}
              setter={setFilter}
              text="답변 완료"
              count={numbers && numbers['답변완료']}
            />
          </div>
        </div>
        <div className={styles['table-header']}>
          <div className={styles.f1}>번호</div>
          <div className={styles.f2}>관리사이름</div>
          <div className={styles.f2}>산모이름</div>
          <div className={styles.f3}>작성일자</div>
          <div className={styles.f2}>문의상태</div>
        </div>
        {data && !loading ? (
          <QuestionTable
            data={data}
            setTarget={setTarget}
            total={numbers ? numbers[filter.replaceAll(' ', '')] : 0}
            offset={offset}
          />
        ) : (
          <Skeleton width={996} height={78} style={{ marginBottom: 16 }} count={6} />
        )}
      </div>
    </>
  );
};

export default QuestionListPage;
