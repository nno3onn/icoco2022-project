/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import styles from './index.module.scss';

const Thumbnail = ({ imageUrl }) => (
  <div
    className={styles['thumbnail-wrapper']}
    onClick={() => {
      window.open(imageUrl, '', 'width=800,height=800,location=no,status=no,scrollbars=yes');
    }}
  >
    <div
      className={styles['thumbnail-bg']}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    />
    <div className={styles['thumbnail-look']}>크게 보기</div>
  </div>
);

export default Thumbnail;
