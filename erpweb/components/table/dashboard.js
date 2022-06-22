/* eslint-disable array-callback-return */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React from 'react';

import styles from './dashboard.module.scss';

const DashBoardTable = ({ title, unit, data }) => (
  <div className={styles['board-info-inner']}>
    <div className={styles['label-wrapper']}>
      <div className={styles.title}>{title}</div>
      <div className={styles.unit}>{unit}</div>
    </div>
    <div className={styles.divided} />
    <div className={styles['contents-wrapper']}>
      {data
        ? data.map((d) => (
            <div className={styles['count-wrapper']}>
              <div className={styles.label}>{d.label}</div>
              <div className={styles.value}>{d.value || 0}</div>
            </div>
          ))
        : null}
    </div>
  </div>
);

export default DashBoardTable;
