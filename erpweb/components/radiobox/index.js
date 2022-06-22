/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import styles from './index.module.scss';

const Radiobox = ({ active, setter, text, count, value = null, onChange = null }) => (
  <button
    type="button"
    className={styles.container}
    onClick={() => {
      setter(text);

      if (onChange) {
        onChange();
      }
    }}
  >
    <img src={`/icons/check-${active === text ? '' : 'in'}active.png`} />
    {text === '예약출산일미확정' ? (
      <div className={styles.text}>
        예약
        <span>(출산일 미확정)</span>
      </div>
    ) : text === '예약출산일확정' ? (
      <div className={styles.text}>
        예약
        <span>(출산일 확정)</span>
      </div>
    ) : (
      <div className={styles.text}>{value || text}</div>
    )}
    <div className={styles.count}>{count}</div>
  </button>
);

export default Radiobox;
