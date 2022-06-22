import React from 'react';

import styles from './index.module.scss';

const Input = ({
  label,
  placeholder = '',
  inputType = 'text',
  width,
  value,
  onChange,
  onKeyDown = null,
  maxLength,
  readOnly = false,
  disabled = false,
}) => (
  <div className={styles.container} style={{ width }}>
    {label && <div className={styles.label}>{label}</div>}
    <input
      style={{
        backgroundColor: disabled ? '#d9d7e0' : '#ecebf0',
        fontWeight: disabled ? 'bold' : null,
      }}
      className={styles.input}
      maxLength={maxLength}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={inputType}
      onKeyDown={onKeyDown}
      disabled={disabled}
      readOnly={readOnly}
    />
  </div>
);

export default Input;
