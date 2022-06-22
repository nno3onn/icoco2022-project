/* eslint-disable react/jsx-one-expression-per-line */

import styles from 'components/listItem/tip.module.scss';
import miliToDate from 'utils/format/miliToDate';

const TipListItem = ({ data }) => {
  const isThumbnails = data.thumbnails && data.thumbnails.length;

  return (
    <div className={styles.container}>
      <div className={styles['header-wrapper']}>
        <div className={styles.profile}>
          <div
            className={styles.avatar}
            style={{
              backgroundImage: `url(${data.profileImage || null})`,
              backgroundColor: isThumbnails ? null : '#503aa9',
            }}
          />
          <p>{data.authorId}</p>
        </div>
        {miliToDate(data.date)}
      </div>
      <div
        className={styles.thumbnail}
        style={{
          backgroundImage: `url(${isThumbnails ? data.thumbnails[0] : null})`,
          backgroundColor: isThumbnails ? null : '#503aa9',
        }}
      />
      <div className={styles['content-wrapper']}>
        {data.keyword ? <div className={styles.keyword}># {data.keyword}</div> : null}
        <div className={styles.contents}>{data.contents}</div>
      </div>
    </div>
  );
};

export default TipListItem;
