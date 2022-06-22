/* eslint-disable object-curly-newline */

import React from 'react';

import styles from './index.module.scss';

const TextArea = ({ onChange, value, placeholder, height, marginBottom }) => (
  <textarea
    className={styles['textarea-wrapper']}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{ height, marginBottom }}
  >
    {value}
  </textarea>
);

export default TextArea;
