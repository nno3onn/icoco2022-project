/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import ButtonComponent from 'components/button';
import InfoTable from 'components/table/info';

import showItem from 'utils/common/show';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const ManagerPage = () => {
  const router = useRouter();
  const managerId = router.query.manager_id;

  const [userInfoA, setUserInfoA] = useState([]);
  const [userInfoB, setUserInfoB] = useState([]);
  const [reviewInfo, setReviewInfo] = useState([]);
  const [otherInfoA, setOtherInfoA] = useState([]);
  const [otherInfoB, setOtherInfoB] = useState([]);
  const [authInfoA, setAuthInfoA] = useState([]);
  const [authInfoB, setAuthInfoB] = useState([]);
  const [authInfoC, setAuthInfoC] = useState([]);
  const [data, setData] = useState();

  const showImage = (url) => {
    window.open(url, '', 'width=800,height=800,location=no,status=no,scrollbars=yes');
  };

  useEffect(() => {
    const onSuccess = async (manager) => {
      setData(manager);

      setUserInfoA([
        {
          k: '관리사명',
          v: manager.name,
        },
        {
          k: '상태',
          v:
            manager.status === '파견' || manager.status === '파견예정' ? (
              `${manager.status} 중 (${manager.dispatchStartDate} ~ ${manager.dispatchEndDate})`
            ) : manager.status === '대기' || manager.status === '휴가' ? (
              <>
                {manager.status} 중
                <Link href={`/manager/${managerId}/update/update_status`}>
                  <a>상태 변경</a>
                </Link>
              </>
            ) : (
              '-'
            ),
        },
        {
          k: '예약 번호',
          v: manager.reservationNumber ? (
            <Link href={`/reservation/${manager.reservationNumber}`}>
              <a>{manager.reservationNumber}</a>
            </Link>
          ) : (
            '-'
          ),
        },
      ]);

      setUserInfoB([
        { k: '연락처', v: manager.phone },
        { k: '생년월일', v: manager.birthDate },
        { k: '근무 시작일', v: manager.careerStartedDate },
        {
          k: '파견 가능 지역',
          v:
            manager.dispatchableArea && manager.dispatchableArea.length
              ? manager.dispatchableArea.join(', ')
              : '-',
        },
      ]);
      setReviewInfo([
        {
          k: '리뷰',
          v: (
            <>
              {manager.totalReview || 0} 건
              <button
                type="button"
                className={styles.download}
                onClick={() => router.push(`/manager/${managerId}/review`)}
              >
                리뷰 보기
              </button>
            </>
          ),
        },
      ]);

      setOtherInfoA([
        { k: '차량 유무', v: manager.isCar },
        { k: '입주 가능 여부', v: manager.isResident },
        { k: 'CCTV 사용 동의', v: manager.isCCTV },
      ]);
      setOtherInfoB([
        {
          k: '성향',
          v:
            manager.personality && manager.personality.length !== 0
              ? manager.personality.join(', ')
              : '-',
        },
        { k: '특기', v: manager.specialty || '-' },
      ]);

      setAuthInfoA([
        {
          k: '실명인증',
          v: manager.certName ? (
            <>
              완료
              <button
                type="button"
                className={styles.download}
                onClick={() => showImage(manager.certName)}
              >
                파일 보기
              </button>
            </>
          ) : (
            '미완료'
          ),
        },
      ]);
      setAuthInfoB([
        {
          k: '건강인증',
          v: manager.certHealth ? (
            <>
              완료
              <button
                type="button"
                className={styles.download}
                onClick={() => showImage(manager.certHealth)}
              >
                파일 보기
              </button>
            </>
          ) : (
            '미완료'
          ),
        },
      ]);
      setAuthInfoC([
        {
          k: '범죄이력',
          v: manager.certCrime ? (
            <>
              완료
              <button
                type="button"
                className={styles.download}
                onClick={() => showImage(manager.certCrime)}
              >
                파일 보기
              </button>
            </>
          ) : (
            '미완료'
          ),
        },
      ]);
    };

    showItem({ collectionName: 'Manager', docId: managerId }, onSuccess);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.managerShowTitle} />
      <div className={styles.container}>
        <Link href="/manager/list">
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
                  backgroundImage: `url(${data.profileImage || '/icons/manager.png'})`,
                }}
              />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>기본 정보</div>
            <InfoTable data={userInfoA} style={{ marginBottom: 24 }} />
            <InfoTable data={userInfoB} />
            <div className={styles.divided} />
            <div className={styles.label}>리뷰 및 평가</div>
            <InfoTable data={reviewInfo} />
            <div className={styles.divided} />
            <div className={styles.label}>기타 정보</div>
            <InfoTable data={otherInfoA} />
            <div className={styles['table-wrapper']}>
              <InfoTable data={otherInfoB} />
            </div>
            <div className={styles.divided} />
            <div className={styles.label}>인증 정보</div>
            <InfoTable style={{ marginBottom: 16 }} data={authInfoA} />
            <div className={styles.desc}>
              - 6개월 이내에 발급된 <b>주민등록초본</b>
              을 첨부해 주세요.
              <br />- 스캔한 초본을 jpg, png, pdf 중 하나로 업로드해 주세요.
            </div>
            <InfoTable style={{ marginBottom: 16 }} data={authInfoB} />
            <div className={styles.desc}>
              - 6개월 이내에 발급된 <b>보건증</b>
              을 첨부해 주세요.
              <br />- 스캔한 보건증을 jpg, png, pdf 중 하나로 업로드해 주세요.
            </div>
            <InfoTable style={{ marginBottom: 16 }} data={authInfoC} />
            <div className={styles.desc}>
              - 6개월 이내에 발급된 <b>범죄 이력</b>
              을 첨부해 주세요.
              <br />- 스캔한 파일을 jpg, png, pdf 중 하나로 업로드해 주세요.
            </div>
          </>
        ) : (
          <>
            <div className={styles['thumbnail-section']}>
              <Skeleton width={180} height={180} />
            </div>
          </>
        )}
        <div className={styles.divided} />
        <div className={styles['button-wrapper']}>
          <Link href={`/manager/${managerId}/update`}>
            <a>
              <ButtonComponent text="정보 수정" isPrimary={false} buttonWidth={180} />
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ManagerPage;
