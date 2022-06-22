import React from 'react';

import styles from 'components/modal/entrance.module.scss';

const EntranceModal = ({ opener }) => (
  <div className={styles.container}>
    <div className={styles['content-wrapper']}>
      <button type="button" className={styles.close} onClick={() => opener(false)}>
        <img alt="cancel" src="/icons/cancel.png" />
      </button>
      <div className={styles.header}>
        로그인 및 업체가입문의는 아이코코 관리자센터로 연락바랍니다.
      </div>
      <div className={styles.label}>아이코코 관리자센터</div>
      <div className={styles.number}>053-012-3456</div>
    </div>
  </div>
);

export default EntranceModal;
