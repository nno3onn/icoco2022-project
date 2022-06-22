import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import LoadingButton from 'components/button/loading';
import CostTable from 'components/table/cost';

import showItem from 'utils/common/show';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const CostInfoPage = () => {
  const router = useRouter();

  const [data, setData] = useState();

  useEffect(() => {
    const onSuccess = (res) => {
      setData(res);
    };
    showItem({ collectionName: 'Admin', docId: 'info' }, onSuccess);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.costInfoTitle} />
      <div className={styles.container}>
        <div className={styles.header}>요금표</div>
        {data ? (
          <>
            <div className={styles.label}>일반 서비스 요금표</div>
            <div className={styles['contents-wrapper']}>
              <div className={styles['table-wrapper']} style={{ marginBottom: 0 }}>
                <CostTable data={data} type="normal" />
              </div>
            </div>
            <div className={styles.border} />
            <div className={styles.label}>바우처 요금표</div>
            <div className={styles['contents-wrapper']}>
              <div className={styles['table-wrapper']}>
                <CostTable data={data} type="voucher" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.label}>일반 서비스 요금표</div>
            <Skeleton width="100%" height={166} />
            <div className={styles.border} />
            <div className={styles.label}>바우처 요금표</div>
            <Skeleton width="100%" height={1060} />
          </>
        )}
        <div className={styles['button-wrapper']}>
          <LoadingButton
            onClick={() => router.push('/cost/update')}
            text="요금표 수정하기"
            buttonWidth={376}
            loading={false}
            buttonHeight={46}
          />
        </div>
      </div>
    </>
  );
};

export default CostInfoPage;
