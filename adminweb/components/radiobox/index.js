/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import styles from './index.module.scss';

const Radiobox = ({ active, setter, text, value = null, onChange = null }) => (
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
    <div className={styles.text}>{value || text}</div>
  </button>
);

export default Radiobox;
