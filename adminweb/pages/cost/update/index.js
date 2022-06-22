/* eslint-disable operator-linebreak */
/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import LoadingButton from 'components/button/loading';
import CostUpdateTable from 'components/table/costUpdate';

import updateCost from 'utils/cost/update';
import showItem from 'utils/common/show';
import checkObjectFull from 'utils/format/checkObjectFull';

import titleConfigs from 'configs/title';
import dataConfigs from 'configs/data';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const CostInfoPage = () => {
  const router = useRouter();

  const defaultArray = new Array(5).fill(null);
  const gradesObj = {};
  dataConfigs.gradesType.forEach((e) => (gradesObj[e] = defaultArray));

  const normalGradesObj = {};
  dataConfigs.normalType.forEach((e) => (normalGradesObj[e] = defaultArray));

  const [data, setData] = useState();
  const [serviceCostInfo, setServiceCostInfo] = useState({ ...gradesObj, ...normalGradesObj });
  const [revenueCostInfo, setRevenueCostInfo] = useState({ ...gradesObj });
  const [userCostInfo, setUserCostInfo] = useState({ ...gradesObj });

  useEffect(() => {
    const onSuccess = (info) => {
      setData(info);

      if (info.serviceCostInfo) {
        setServiceCostInfo(info.serviceCostInfo);
      }
      if (info.revenueCostInfo) {
        setRevenueCostInfo(info.revenueCostInfo);
      }
      if (info.userCostInfo) {
        setUserCostInfo(info.userCostInfo);
      }
    };
    showItem({ collectionName: 'Admin', docId: 'info' }, onSuccess);
  }, []);

  const handleUpdate = async () => {
    if (
      !checkObjectFull(serviceCostInfo) ||
      !checkObjectFull(revenueCostInfo) ||
      !checkObjectFull(userCostInfo)
    ) {
      // return alert('모든 값을 채워주세요.');
    }

    if (window.confirm('수정하시겠습니까?')) {
      await updateCost({
        serviceCostInfo,
        revenueCostInfo,
        userCostInfo,
      });

      alert('수정 되었습니다.');
      return router.push('/cost/info');
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.costInfoTitle} />
      <div className={styles.container}>
        <div className={styles.header}>요금표 수정</div>
        {data ? (
          <>
            <div className={styles.label}>일반 서비스 요금표</div>
            <CostUpdateTable
              type="normal"
              serviceCostInfo={serviceCostInfo}
              setServiceCostInfo={setServiceCostInfo}
            />
            <div className={styles.border} />
            <div className={styles.label}>바우처 요금표</div>
            <CostUpdateTable
              type="voucher"
              serviceCostInfo={serviceCostInfo}
              revenueCostInfo={revenueCostInfo}
              userCostInfo={userCostInfo}
              setServiceCostInfo={setServiceCostInfo}
              setRevenueCostInfo={setRevenueCostInfo}
              setUserCostInfo={setUserCostInfo}
            />
            <div className={styles['button-wrapper']}>
              <LoadingButton
                onClick={handleUpdate}
                text="수정 완료"
                buttonWidth={376}
                loading={false}
                buttonHeight={46}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.label}>일반 서비스 요금표</div>
            <Skeleton width="100%" height={214} />
            <div className={styles.border} />
            <div className={styles.label}>바우처 요금표</div>
            <Skeleton width="100%" height={1060} />
          </>
        )}
      </div>
    </>
  );
};

export default CostInfoPage;
