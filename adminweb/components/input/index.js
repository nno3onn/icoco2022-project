/* eslint-disable object-curly-newline */
import React from 'react';

import styles from 'components/input/index.module.scss';

const Input = ({
  label,
  placeholder = '',
  inputType = 'text',
  value,
  onChange,
  onKeyDown,
  disabled = false,
}) => (
  <div className={styles.container}>
    {label ? <div className={styles.label}>{label}</div> : null}
    <input
      style={{
        backgroundColor: disabled ? '#d9d7e0' : '#ecebf0',
        fontWeight: disabled ? 'bold' : null,
      }}
      className={styles.input}
      placeholder={placeholder}
      value={value || ''}
      onChange={onChange}
      type={inputType}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  </div>
);

export default Input;
