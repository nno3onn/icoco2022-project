/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import configs from 'configs/data';

import styles from './index.module.scss';

const Label = ({ active }) => {
  const labelName =
    active === '예약출산일미확정'
      ? '예약 (출산일 미확정)'
      : active === '예약출산일확정'
      ? '예약 (출산일 확정)'
      : active;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{labelName}:</div>
      <div className={styles.desc}>{configs.FILTER_DESC[labelName]}</div>
    </div>
  );
};

export default Label;
