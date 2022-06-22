/* eslint-disable indent */
/* eslint-disable react/jsx-indent */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import ButtonComponent from 'components/button';
import Helmet from 'components/helmet';
import InfoTable from 'components/table/info';
import CostTable from 'components/table/cost';

import showItem from 'utils/common/show';

import titleConfigs from 'configs/title';

import styles from 'pages/information/index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const Information = () => {
  const router = useRouter();
  const [data, setData] = useState();

  useEffect(() => {
    const auth = getAuth();
    const { uid } = auth.currentUser;

    const onSuccess = (info) => {
      setData(info);
    };

    showItem({ collectionName: 'Company', docId: uid }, onSuccess);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.companyShowTitle} />
      <div className={styles.container}>
        <div className={styles.header}>업체정보</div>
        <div className={styles['thumbnail-section']}>
          {data ? (
            <div
              className={styles.thumbnail}
              style={{ backgroundImage: `url(${data.thumbnail})` }}
            />
          ) : (
            <div className={styles['thumbnail-default']} />
          )}
        </div>
        <div className={styles.divided} />
        <div className={styles['info-section']}>
          {data ? (
            <>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>기본 정보</div>
                <InfoTable
                  data={[
                    { k: '업체명', v: data.companyName || '-' },
                    { k: '연락처', v: data.phone || '-' },
                    { k: '사업자등록번호', v: data.registerNumber || '-' },
                    { k: '주소', v: data.address || '-' },
                    { k: '이메일', v: data.email || '-' },
                  ]}
                />
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>계좌 정보</div>
                <InfoTable
                  data={[
                    { k: '은행명', v: data.bankName || '-' },
                    { k: '예금주', v: data.accountHolderName || '-' },
                    { k: '계좌번호', v: data.accountNumber || '-' },
                  ]}
                />
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>SNS 정보</div>
                <InfoTable
                  data={[
                    {
                      k: '홈페이지',
                      v: data.homepage ? (
                        <Link href={data.homepage}>
                          <a>{data.homepage}</a>
                        </Link>
                      ) : (
                        '-'
                      ),
                    },
                    {
                      k: '블로그',
                      v: data.blog ? (
                        <Link href={data.blog}>
                          <a>{data.blog}</a>
                        </Link>
                      ) : (
                        '-'
                      ),
                    },
                    {
                      k: '맘카페 제휴',
                      v: data.momcafe || '-',
                    },
                  ]}
                />
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>파견 가능 지역</div>
                <div
                  className={styles['td-extend']}
                  style={{ height: `${data.dispatchableArea.length * 46}px` }}
                >
                  <div className={styles['td-label']}>파견 가능 지역</div>
                  <div className={styles['value-wrapper']}>
                    {data.dispatchableArea.length
                      ? data.dispatchableArea.map((area, index) => (
                          <div key={String(index)} className={styles.value}>
                            {area}
                          </div>
                        ))
                      : '-'}
                  </div>
                </div>
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>추가 요금</div>
                <InfoTable
                  data={[
                    {
                      k: '24개월 미만 아동',
                      v: `${data.preschoolerCost.toLocaleString()} 원` || '-',
                    },
                    {
                      k: '미취학 아동',
                      v: `${data.kindergartenerCost.toLocaleString()} 원` || '-',
                    },
                    {
                      k: '취학 아동',
                      v: `${data.schoolerCost.toLocaleString()} 원` || '-',
                    },
                    {
                      k: '가족',
                      v: `${data.extraFamilyCost.toLocaleString()} 원` || '-',
                    },
                  ]}
                />
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>서비스 요금표</div>
                <div className={styles['desc-label']}>일반 서비스 요금표</div>
                <div className={styles['table-wrapper']}>
                  <CostTable data={data} type="normal" />
                </div>
                <div className={styles.border} />
                <div className={styles['desc-label']}>바우처 요금표</div>
                <div className={styles['table-wrapper']}>
                  <CostTable data={data} type="voucher" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>기본 정보</div>
                <Skeleton width="100%" height={237} />
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>계좌 정보</div>
                <Skeleton width="100%" height={143} />
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>SNS 정보</div>
                <Skeleton width="100%" height={143} />
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>파견 가능 지역</div>
                <Skeleton width="100%" height={92} />
              </div>
              <div className={styles['contents-wrapper']}>
                <div className={styles['contents-label']}>요금표</div>
                <div className={styles.label}>일반 서비스 요금표</div>
                <Skeleton width="100%" height={166} />
                <div className={styles.border} />
                <div className={styles.label}>바우처 요금표</div>
                <Skeleton width="100%" height={1060} />
              </div>
            </>
          )}
          <div className={styles['action-section']}>
            <div className={styles['button-margin']}>
              <ButtonComponent
                onClick={() => router.push('/information/update')}
                text="수정"
                buttonHeight={46}
                isPrimary={false}
                buttonWidth={180}
              />
            </div>
            <ButtonComponent
              onClick={() => router.push('/information/changePassword')}
              text="비밀번호 변경"
              buttonHeight={46}
              isPrimary={false}
              buttonWidth={180}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Information;
