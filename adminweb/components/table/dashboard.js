import React from 'react';
import { v4 } from 'uuid';

import styles from './dashboard.module.scss';

const DashBoardTable = ({ title, unit, data }) => (
  <div className={styles.container}>
    <div className={styles['label-wrapper']}>
      <div className={styles.title}>{title}</div>
      <div className={styles.unit}>{unit}</div>
    </div>
    <div className={styles.divided} />
    <div className={styles['contents-wrapper']}>
      {data.map((d) => (
        <div className={styles['count-wrapper']} key={String(v4())}>
          <div className={styles.label}>{d.label}</div>
          <div className={styles.value}>{d.value || 0}</div>
        </div>
      ))}
    </div>
  </div>
);

export default DashBoardTable;
