/* eslint-disable object-curly-newline */
import React from 'react';

import styles from './pagination.module.scss';

const PaginationButton = ({ text, onClick, isActive }) => (
  <button type="button" className={styles[`${isActive ? '' : 'non-'}active`]} onClick={onClick}>
    {text}
  </button>
);

export default PaginationButton;
