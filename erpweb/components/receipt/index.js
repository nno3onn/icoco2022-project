/* eslint-disable indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */

import React from 'react';

import styles from './index.module.scss';

const Receipt = ({ data }) => (
  <div className={styles.container}>
    <div className={styles.row}>
      <div className={styles.label}>서비스 기본요금</div>
      <div className={styles.value}>
        {data.totalCost ? (data.totalCost - data.extraCost).toLocaleString() : 0}원
      </div>
    </div>
    <div className={styles.divided} />
    <div className={styles.row}>
      <div className={styles.label}>총 추가요금</div>
      <div className={styles.value}>
        {data.extraCost ? Number(data.extraCost).toLocaleString() : 0}원
      </div>
    </div>
    {data.extraCost &&
    data.allAdditionalFamily.preschooler &&
    Number(data.allAdditionalFamily.preschooler) !== 0 ? (
      <div className={styles.row}>
        <div className={styles.label}>
          24개월 미만 아동
          <span>{data.allAdditionalFamily.preschooler}명</span>
        </div>
        <div className={styles.value}>
          {data.allAdditionalFamily
            ? Number(data.allAdditionalFamily.preschooler * 11000).toLocaleString()
            : 0}
          원
        </div>
      </div>
    ) : null}
    {data.extraCost &&
    data.allAdditionalFamily.kindergartener &&
    Number(data.allAdditionalFamily.kindergartener) !== 0 ? (
      <div className={styles.row}>
        <div className={styles.label}>
          미취학 아동<span>{data.allAdditionalFamily.kindergartener}명</span>
        </div>
        <div className={styles.value}>
          {data.allAdditionalFamily
            ? Number(data.allAdditionalFamily.kindergartener * 5000).toLocaleString()
            : 0}
          원
        </div>
      </div>
    ) : null}
    {data.extraCost &&
    data.allAdditionalFamily.schooler &&
    Number(data.allAdditionalFamily.schooler) !== 0 ? (
      <div className={styles.row}>
        <div className={styles.label}>
          취학 아동<span>{data.allAdditionalFamily.schooler}명</span>
        </div>
        <div className={styles.value}>
          {data.allAdditionalFamily
            ? Number(data.allAdditionalFamily.schooler * 5000).toLocaleString()
            : 0}
          원
        </div>
      </div>
    ) : null}
    {data.extraCost &&
    data.allAdditionalFamily.extraFamily &&
    Number(data.allAdditionalFamily.extraFamily) !== 0 ? (
      <div className={styles.row}>
        <div className={styles.label}>
          기타 가족<span>{data.allAdditionalFamily.extraFamily}명</span>
        </div>
        <div className={styles.value}>
          {data.allAdditionalFamily
            ? Number(data.allAdditionalFamily.extraFamily * 5000).toLocaleString()
            : 0}
          원
        </div>
      </div>
    ) : null}
    <div className={styles.divided} />
    <div className={styles.row}>
      <div className={styles.label}>총 서비스 요금</div>
      <div className={styles.value}>
        {data.totalCost ? Number(data.totalCost).toLocaleString() : 0}원
      </div>
    </div>
    <div className={styles.row}>
      <div className={styles.label}>정부 지원금</div>
      <div className={styles.value}>
        {data.revenueCost ? Number(data.revenueCost).toLocaleString() : 0}원
      </div>
    </div>
    <div className={styles.divided} />
    <div className={styles.row}>
      <div className={styles.label}>최종 자부담금</div>
      <div className={styles.value}>
        {data.userCost ? Number(data.userCost).toLocaleString() : 0}원
      </div>
    </div>
    <div className={styles.divided} />
    <div className={styles['action-row']}>
      <div className={styles['label-wrapper']}>
        <div className={styles.label}>예약금</div>
        <div className={styles[`${data.isFinishedDeposit === '입금완료' ? 'success' : 'fail'}`]}>
          - 결제 {data.isFinishedDeposit === '입금완료' ? '' : '미'}
          완료
        </div>
      </div>
      <div className={styles.value}>
        {data.depositCost ? Number(data.depositCost).toLocaleString() : 0}원
      </div>
    </div>
    <div className={styles['action-row']}>
      <div className={styles['label-wrapper']}>
        <div className={styles.label}>잔금</div>
        <div className={styles[`${data.isFinishedBalance === '입금완료' ? 'success' : 'fail'}`]}>
          - 결제 {data.isFinishedBalance === '입금완료' ? '' : '미'}
          완료
        </div>
      </div>
      <div className={styles.value}>
        {data.balanceCost ? Number(data.balanceCost).toLocaleString() : 0}원
      </div>
    </div>
  </div>
);

export default Receipt;
