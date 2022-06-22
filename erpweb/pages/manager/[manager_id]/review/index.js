import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import Review from 'components/review';
import ReviewPagination from 'components/pagination/review';
import CreateButton from 'components/button/create';

import getReviews from 'utils/manager/getReviews';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const ReviewPage = () => {
  const router = useRouter();
  const managerId = router.query.manager_id;

  const [middleReview, setMiddleReview] = useState();
  const [middlePage, setMiddlePage] = useState('1');
  const [finalReview, setFinalReview] = useState();
  const [finalPage, setFinalPage] = useState('1');

  useEffect(() => {
    getReviews({ managerId, type: '중간', offset: (Number(middlePage) - 1) * 4 }, (reviews) => {
      setMiddleReview(reviews);
    });
  }, [middlePage]);

  useEffect(() => {
    getReviews({ managerId, type: '기말', offset: (Number(finalPage) - 1) * 4 }, (reviews) => {
      setFinalReview(reviews);
    });
  }, [finalPage]);

  return (
    <>
      <Helmet title={titleConfigs.managerReveiwTitle} />
      <div className={styles.container}>
        <Link href={`/manager/${managerId}`}>
          <a>
            <img alt="arrow" className={styles.arrow} src="/icons/arrow-left-g.png" />
          </a>
        </Link>
        {middleReview ? (
          <>
            <div className={styles.title}>
              중간 평가
              <span>{middleReview.total}</span>
            </div>
            {middleReview.reviewList.map((review) => (
              <Review review={review} />
            ))}
            {middleReview.total ? (
              <ReviewPagination
                total={middleReview.total}
                page={middlePage}
                pageSetter={setMiddlePage}
              />
            ) : null}
          </>
        ) : (
          <>
            <div className={styles.title}>중간 평가</div>
            <Skeleton width={588} height={150} style={{ marginBottom: 16 }} count={4} />
          </>
        )}
        <div className={styles.border} />
        {finalReview ? (
          <>
            <div className={styles.title}>
              기말 평가
              <span>{finalReview.total}</span>
            </div>
            {finalReview.reviewList
              ? finalReview.reviewList.map((review) => <Review review={review} />)
              : null}
            {finalReview.total ? (
              <ReviewPagination
                total={finalReview.total}
                page={finalPage}
                pageSetter={setFinalPage}
              />
            ) : null}
          </>
        ) : (
          <>
            <div className={styles.title}>기말 평가</div>
            <Skeleton width={588} height={150} style={{ marginBottom: 16 }} count={4} />
          </>
        )}
      </div>
      <div className={styles['button-wrapper']}>
        <Link href={`/manager/${managerId}/review/create`}>
          <a>
            <CreateButton text="리뷰 추가" />
          </a>
        </Link>
      </div>
    </>
  );
};
export default ReviewPage;
