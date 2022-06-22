/* eslint-disable object-curly-newline */
import React from 'react';

import styles from './mini.module.scss';

const MiniButton = ({ onClick, text, buttonWidth, buttonHeight }) => (
  <button
    type="button"
    onClick={onClick}
    className={styles.container}
    style={{ width: buttonWidth, height: buttonHeight }}
  >
    {text}
  </button>
);

export default MiniButton;
