import React from 'react';

import styles from 'components/listItem/notice.module.scss';
import miliToDate from 'utils/format/miliToDate';

const NoticeListItemComponent = ({ index, data }) => (
  <div className={styles['notice-wrapper']}>
    {data ? (
      <>
        <div className={styles.t1}>{index}</div>
        <div className={styles.t7}>{data.title}</div>
        <div className={styles.t2}>{miliToDate(data.date)}</div>
      </>
    ) : null}
  </div>
);

export default NoticeListItemComponent;
