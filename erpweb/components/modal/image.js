/* eslint-disable object-curly-newline */
import React from 'react';

import ModalButton from 'components/button/modal';

import styles from './image.module.scss';

const Modal = ({ opener, onClick }) => {
  const handleCancel = () => {
    opener(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles['modal-wrapper']}>
        <div className={styles['modal-icon']}>
          <img alt="delete" src="/icons/delete.png" width="46" />
        </div>
        <div className={styles.text}>해당 이미지를 삭제하시겠습니까?</div>
        <div className={styles['button-wrapper']}>
          <ModalButton
            onClick={handleCancel}
            text="취소"
            isPrimary={false}
            buttonWidth={164}
            buttonHeight={46}
          />
          <ModalButton
            onClick={onClick}
            text="삭제"
            isWarning
            buttonWidth={164}
            buttonHeight={46}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
