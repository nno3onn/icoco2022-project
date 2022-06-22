import React from 'react';

import PaginationButton from 'components/button/pagination';

import styles from './review.module.scss';

const ReviewPagination = ({ total, page, pageSetter }) => {
  const limit = 4;
  const numPages = Math.ceil(total / limit);
  const pageGroup = Math.ceil(page / 10);

  let last = pageGroup * 10;
  if (last > numPages) last = numPages;
  const first = last < 10 ? 1 : last - 9;

  const handleBefore = () => (page === '1' ? null : pageSetter((Number(page) - 1).toString()));

  const handleNext = () => {
    if (Number(page) % 10 === 0) {
      if (last > numPages) last = numPages;
    }
    if (Number(page) !== numPages) {
      pageSetter((Number(page) + 1).toString());
    }
  };

  return (
    <div className={styles.pagination}>
      <button type="button" onClick={handleBefore}>
        <img alt="arrow-left" src="/icons/arrow-left-g-1.png" className={styles['page-arrow']} />
      </button>
      {new Array(last - first + 1).fill().map((v, i) => (
        <PaginationButton
          text={first + i}
          onClick={({ target: { innerHTML } }) => pageSetter(innerHTML)}
          isActive={page === `${first + i}`}
        />
      ))}
      <button type="button" onClick={handleNext}>
        <img alt="arrow-right" src="/icons/arrow-right-g-1.png" className={styles['page-arrow']} />
      </button>
    </div>
  );
};

export default ReviewPagination;
