import React from 'react';

import styles from './modal.module.scss';

const ModalButton = ({
  onClick,
  text,
  isPrimary = false,
  isWarning = false,
  buttonWidth,
  buttonHeight,
}) => {
  let type = 'secondary-';
  if (isPrimary) type = 'primary-';
  if (isWarning) type = 'warning-';

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles[`${type}container`]}
      style={{
        width: buttonWidth,
        height: buttonHeight,
      }}
    >
      <div>{text}</div>
    </button>
  );
};

export default ModalButton;
