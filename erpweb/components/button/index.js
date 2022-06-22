/* eslint-disable object-curly-newline */
import React from 'react';

import styles from './index.module.scss';

const ButtonComponent = ({ onClick, text, isPrimary = true, buttonWidth, buttonHeight }) => (
  <button
    type="button"
    onClick={onClick}
    className={styles[`${isPrimary ? 'primary-container' : 'secondary-container'}`]}
    style={{ width: buttonWidth, height: buttonHeight }}
  >
    {text}
  </button>
);

export default ButtonComponent;
