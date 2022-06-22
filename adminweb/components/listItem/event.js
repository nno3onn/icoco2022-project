/* eslint-disable react/jsx-one-expression-per-line */
import styles from 'components/listItem/event.module.scss';

const EventListItem = ({ data }) => (
  <div className={styles.container}>
    <div
      className={styles.thumbnail}
      style={{
        backgroundImage: `url(${data.thumbnail ? data.thumbnail : '/images/logo.png'})`,
      }}
    />
    <div className={styles.title}>{data.title}</div>
    {data.startDate && data.endDate ? (
      <div className={styles.dates}>
        이벤트 기간 | {data.startDate} ~ {data.endDate}
      </div>
    ) : null}
  </div>
);

export default EventListItem;
