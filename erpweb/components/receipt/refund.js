/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */

import React from 'react';

import styles from './index.module.scss';

const RefundReceipt = ({ data }) => (
  <div className={styles.container}>
    {data.map(({ k, v }, index) =>
      index === data.length - 1 ? (
        <div key={String(index)}>
          <div className={styles.divided} />
          <div className={styles.row} style={{ fontWeight: 'bold' }}>
            <div className={styles.label}>{k}</div>
            <div className={styles.value}>{v}</div>
          </div>
        </div>
      ) : (
        <div className={styles.row} key={String(index)}>
          <div className={styles.label}>{k}</div>
          <div className={styles.value}>{v}</div>
        </div>
      ),
    )}
  </div>
);

export default RefundReceipt;
