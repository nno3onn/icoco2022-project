/* eslint-disable object-curly-newline */
import React from 'react';

import styles from './textarea.module.scss';

const TextArea = ({ onChange, value, placeholder, height }) => (
  <textarea
    className={styles['textarea-wrapper']}
    value={value || ''}
    onChange={onChange}
    placeholder={placeholder}
    style={{ height }}
  >
    {value}
  </textarea>
);

export default TextArea;
