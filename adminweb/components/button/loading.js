import React from 'react';
import ReactLoading from 'react-loading';

import styles from 'components/button/loading.module.scss';

const LoadingButton = ({
  loading,
  onClick,
  text,
  textColor = 'white',
  buttonHeight,
  buttonWidth,
  loadingSize = 24,
  loadingColor = 'white',
}) => (
  <button
    type="button"
    onClick={onClick}
    className={styles.container}
    style={{ color: textColor, height: buttonHeight, width: buttonWidth }}
  >
    <div style={{ width: loadingSize, height: loadingSize }} />
    {text}
    {loading ? (
      <ReactLoading type="spin" color={loadingColor} width={loadingSize} height={loadingSize} />
    ) : (
      <div style={{ width: loadingSize, height: loadingSize }} />
    )}
  </button>
);

export default LoadingButton;
