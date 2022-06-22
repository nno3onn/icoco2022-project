/* eslint-disable object-curly-newline */
import React from 'react';

import styles from './process.module.scss';

const ProcessButton = ({ text, onClick, type }) => (
  <button type="button" className={styles[type]} onClick={onClick}>
    {text}
  </button>
);

export default ProcessButton;
