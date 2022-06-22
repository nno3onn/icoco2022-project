/* eslint-disable object-curly-newline */
import React from 'react';

import styles from './index.module.scss';

const CheckBox = ({ text, onClick = null, isChecked = null, isShow = false, margin = null }) => (
  <button
    type="button"
    className={styles.container}
    onClick={onClick}
    style={{ cursor: isShow ? null : 'pointer', margin }}
  >
    <img alt="check" src={`/icons/${isChecked ? '' : 'in-'}active.png`} />
    <div>{text}</div>
  </button>
);

export default CheckBox;
