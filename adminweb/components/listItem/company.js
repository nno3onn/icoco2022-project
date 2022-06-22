import styles from 'components/listItem/company.module.scss';

const CompanyListItem = ({ data }) => (
  <div className={styles['company-wrapper']}>
    <div className={styles.f15} style={{ fontWeight: 'bold' }}>
      {data.companyName || '-'}
    </div>
    <div className={styles.f3}>{data.address || '-'}</div>
    <div className={styles.f15}>{data.phone || '-'}</div>
    <div className={styles.f1}>{data.totalManagers ? data.totalManagers.toLocaleString() : 0}</div>
    <div className={styles.f1}>
      {data.totalReservation ? data.totalReservation.toLocaleString() : 0}
    </div>
  </div>
);

export default CompanyListItem;
