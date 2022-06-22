/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import Thumbnail from 'components/thumbnail';

import styles from './index.module.scss';

const Review = ({ review }) => (
  <div className={styles.review}>
    <div className={styles['review-name']}>{review.userName || 'OOO'}님</div>
    <div className={styles['review-section']}>
      {review.reviewRate ? (
        <div className={styles['review-rate']}>
          {new Array(review.reviewRate).fill().map(() => (
            <img alt="dashboard" src="/icons/star-full.png" style={{ marginRight: '2px' }} />
          ))}
          {new Array(5 - review.reviewRate).fill().map(() => (
            <img alt="dashboard" src="/icons/star-empty.png" style={{ marginRight: '2px' }} />
          ))}
        </div>
      ) : null}
      <div className={styles['review-date']}>{review.date || null}</div>
    </div>
    <div className={styles['review-specialty']}>{review.specialtyItems || null}</div>
    {review.thumbnails && review.thumbnails.length !== 0 ? (
      <div className={styles['review-thumbnail']}>
        {review.thumbnails.map((url, i) =>
          i % 3 === 2 ? (
            <div className={styles['review-thumbnail']}>
              <Thumbnail imageUrl={url} />
            </div>
          ) : (
            <Thumbnail imageUrl={url} />
          ),
        )}
      </div>
    ) : null}
    <div className={styles['review-contents']}>{review.contents || null}</div>
  </div>
);

export default Review;
