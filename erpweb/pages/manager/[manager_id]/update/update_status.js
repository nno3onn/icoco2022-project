/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';

import Helmet from 'components/helmet';
import Radiobox from 'components/radiobox';
import ButtonComponent from 'components/button';
import showItem from 'utils/common/show';

import updateManager from 'utils/manager/update';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const ManagerUpdateStatusPage = () => {
  const router = useRouter();
  const managerId = router.query.manager_id;

  const [data, setData] = useState();
  const [profileImage, setProfileImage] = useState();
  const [status, setStatus] = useState();

  const [dispatchStartYear, setDispatchStartYear] = useState('');
  const [dispatchStartMonth, setDispatchStartMonth] = useState('');
  const [dispatchStartDay, setDispatchStartDay] = useState('');

  const [dispatchEndYear, setDispatchEndYear] = useState('');
  const [dispatchEndMonth, setDispatchEndMonth] = useState('');
  const [dispatchEndDay, setDispatchEndDay] = useState('');

  const handleUpdate = () => {
    if (window.confirm('정말 수정하시겠습니까?')) {
      const onSuccess = () => {
        alert('정상 반영되었습니다.');
        router.push(`/manager/${managerId}`);
      };

      const managerInfo = {
        managerId,
        status,
        dispatchStartDate: `${dispatchStartYear}.${dispatchStartMonth}.${dispatchStartDay}`,
        dispatchEndDate: `${dispatchEndYear}.${dispatchEndMonth}.${dispatchEndDay}`,
      };

      updateManager(managerInfo, onSuccess);
    }
  };

  useEffect(() => {
    const onSuccess = (info) => {
      setData(info);
    };
    showItem({ collectionName: 'Manager', docId: managerId }, onSuccess);
  }, []);

  useEffect(() => {
    if (!data) return;

    setStatus(data.status);

    if (data.profileImage) {
      setProfileImage(data.profileImage);
    }

    if (data.dispatchStartDate) {
      setDispatchStartYear(data.dispatchStartDate.split('.')[0]);
      setDispatchStartMonth(data.dispatchStartDate.split('.')[1]);
      setDispatchStartDay(data.dispatchStartDate.split('.')[2]);
    }

    if (data.dispatchEndDate) {
      setDispatchEndYear(data.dispatchEndDate.split('.')[0]);
      setDispatchEndMonth(data.dispatchEndDate.split('.')[1]);
      setDispatchEndDay(data.dispatchEndDate.split('.')[2]);
    }
  }, data);

  return (
    <>
      {`${dispatchStartYear}.${dispatchStartMonth}.${dispatchStartDay}`}
      {`${dispatchEndYear}.${dispatchEndMonth}.${dispatchEndDay}`}
      <Helmet title={titleConfigs.managerUpdateStatusTitle} />
      <div className={styles.container}>
        <Link href={`/manager/${managerId}`}>
          <a>
            <img alt="arrow" className={styles.arrow} src="/icons/arrow-left-g.png" />
          </a>
        </Link>
        {data ? (
          <>
            <div className={styles['thumbnail-section']}>
              <div
                className={styles.thumbnail}
                style={{
                  backgroundImage: `url(${profileImage || '/icons/manager.png'})`,
                }}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles['content-label']}>기본 정보</div>
            <div className={styles['table-wrapper']}>
              <div className={styles['td-top']}>
                <div className={styles['td-label']}>관리사명</div>
                <div className={styles.value}>
                  <div className={styles.text}>{data.name}</div>
                </div>
              </div>
              <div className={styles.td}>
                <div className={styles['td-label']}>현재 상태</div>
                <div className={styles.value}>
                  <div className={styles.text}>
                    {data.status} 중
                    {data.status === '파견' &&
                      ` (${data.dispatchStartDate} - ${data.dispatchEndDate})`}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.divided2} />
            <div className={styles['content-label']}>일정 변경</div>
            <div className={styles['table-wrapper']}>
              <div className={styles['td-top']}>
                <div className={styles['td-label']}>다음 일정으로 변경</div>
                <div className={styles.value}>
                  <div className={styles['checkbox-wrapper2']}>
                    <Radiobox active={status} setter={setStatus} text="대기" />
                  </div>
                  {/* <div className={styles['checkbox-wrapper2']}>
                    <ChecRadioboxkBox active={status} setter={setStatus} text="휴가" />
                  </div> */}
                  <div className={styles['checkbox-wrapper2']}>
                    <Radiobox active={status} setter={setStatus} text="대기" />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['button-wrapper']}>
              <ButtonComponent
                onClick={handleUpdate}
                text="저장"
                buttonWidth={180}
                buttonHeight={46}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles['thumbnail-section']}>
              <Skeleton width={180} height={180} style={{ borderRadius: '12px' }} />
            </div>
            <div className={styles.divided} />
          </>
        )}
      </div>
    </>
  );
};

export default ManagerUpdateStatusPage;
