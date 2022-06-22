/* eslint-disable object-curly-newline */
import React from 'react';

import ModalButton from 'components/button/modal';

import styles from './index.module.scss';

const Modal = ({ opener, onClick, page, type = 'delete' }) => {
  let text;
  let pageName;

  const handleCancel = () => {
    opener(false);
  };

  if (!page) return;

  switch (page) {
    case 'event':
      pageName = '이벤트를';
      break;
    case 'notice':
      pageName = '공지사항을';
      break;
    case 'tip':
      pageName = '육아팁을';
      break;
    case 'image':
      pageName = '이미지를';
      break;
    default:
      break;
  }

  if (page === 'company') {
    text = '해당 업체의 모든 정보를 삭제하시겠습니까? 삭제 시, 복구가 불가능합니다';
  } else {
    text = `해당 ${pageName} ${type === 'delete' ? '삭제' : '수정'}하시겠습니까?`;
  }

  return (
    <div className={styles.container}>
      <div className={styles['modal-wrapper']}>
        {type === 'delete' ? (
          <div className={styles['modal-icon']}>
            <img alt="delete" src="/icons/delete.png" width="46" />
          </div>
        ) : null}
        <div className={styles.text}>{text}</div>
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
            text={type === 'delete' ? '삭제' : '수정'}
            isWarning={type === 'delete'}
            isPrimary={type === 'update'}
            buttonWidth={164}
            buttonHeight={46}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
