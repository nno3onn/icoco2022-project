import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';

import MonthlyChart from 'components/chart/monthly';
import YearlyChart from 'components/chart/yearly';
import Helmet from 'components/helmet';
import DashBoardTable from 'components/table/dashboard';

import showItem from 'utils/common/show';
import { getYear, getMonth } from 'utils/format/getToday';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const CompanyPage = () => {
  const router = useRouter();
  const { companyId } = router.query;

  const [data, setData] = useState();

  const [managerInfo, setManagerInfo] = useState([]);
  const [reservationInfo, setReservationInfo] = useState([]);
  const [salesInfo, setSalesInfo] = useState([]);

  const year = getYear();
  const month = getMonth();

  useEffect(() => {
    const onSuccess = (info) => {
      setData(info);

      const thisMonthSales = info.staticsSales[year]
        ? info.staticsSales[year].totalMonthly[month - 1] / 10000
        : 0;
      const lastMonthSales = info.staticsSales[year - 1]
        ? info.staticsSales[year - 1].totalMonthly[month - 1] / 10000
        : 0;
      const diffSales = thisMonthSales - lastMonthSales;
      const thisYearSales = info.staticsSales[year].totalYear / 10000;

      setManagerInfo([
        { label: '전체', value: info.totalManager.toLocaleString() },
        { label: '파견 중', value: info.dispatchManager.toLocaleString() },
        { label: '파견 예정', value: info.expectedManager.toLocaleString() },
        { label: '휴가 중', value: info.vacationManager.toLocaleString() },
      ]);

      setReservationInfo([
        { label: '금일 예약', value: info.todayReservation.toLocaleString() },
        {
          label: '이번달 예약',
          value: info.thisMonthReservation.reduce((x, y) => x + y).toLocaleString(),
        },
        { label: '누적 예약', value: info.totalReservation.toLocaleString() },
      ]);

      setSalesInfo([
        {
          label: '이번달 매출',
          value: thisMonthSales ? thisMonthSales.toLocaleString() : 0,
        },
        {
          label: '전년 동월 매출',
          value: lastMonthSales ? lastMonthSales.toLocaleString() : 0,
        },
        {
          label: '전년 동월 매출 대비',
          value: (
            <div className={styles.costDiff}>
              {diffSales !== 0 ? (
                <img
                  alt="arrow"
                  src={`/icons/arrow-${diffSales > 0 ? 'positive' : 'negative'}.png`}
                />
              ) : null}
              {diffSales.toLocaleString()}
              <span>
                {diffSales !== 0 && lastMonthSales !== 0
                  ? `(${((diffSales * 100) / lastMonthSales).toFixed(1)}%)`
                  : null}
              </span>
            </div>
          ),
        },
        {
          label: '올해 누적 매출',
          value: thisYearSales ? thisYearSales.toLocaleString() : 0,
        },
      ]);
    };

    showItem({ collectionName: 'Company', docId: companyId }, onSuccess);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.companyShowTitle} />
      <div className={styles.container}>
        {data ? (
          <>
            <div className={styles['board-info-section']}>
              <div className={styles['board-info-left']}>
                <div className={styles['thumbnail-wrapper']}>
                  {data.thumbnail ? (
                    <div
                      className={styles.thumbnail}
                      style={{
                        backgroundImage: `url(${data.thumbnail || null})`,
                      }}
                    />
                  ) : (
                    <div className={styles['thumbnail-default']} />
                  )}
                  <div className={styles.label}>{data.companyName || null}</div>
                </div>
                <div className={styles.divided} />
                <div className={styles['info-wrapper']}>
                  <div className={styles.label}>연락처</div>
                  <div className={styles.value}>{data.phone || null}</div>
                </div>
                <div className={styles['info-wrapper']}>
                  <div className={styles.label}>사업자등록번호</div>
                  <div className={styles.value}>{data.registerNumber || null}</div>
                </div>
                <div className={styles['info-wrapper']} style={{ marginBottom: 0 }}>
                  <div className={styles.label}>주소</div>
                  <div className={styles.value}>{data.address || null}</div>
                </div>
              </div>
              <div className={styles['board-info-right']}>
                <DashBoardTable title="관리사 현황" unit="(단위: 명)" data={managerInfo} />
                <DashBoardTable title="예약 통계" unit="(단위: 건)" data={reservationInfo} />
              </div>
            </div>
            <div className={styles.divided} style={{ marginTop: '20px' }} />
            <div className={styles['board-revenue-inner']} style={{ marginBottom: 0 }}>
              <div className={styles['label-wrapper']}>
                <div className={styles.label}>월간 예약 통계</div>
                <div className={styles['chart-label-section']}>
                  <div className={styles['chart-label']}>(단위: 건)</div>
                </div>
              </div>
              <div className={styles.divided} />
              {data.thisMonthReservation && <MonthlyChart chartData={data.thisMonthReservation} />}
            </div>
            <div className={styles.divided} />
            <DashBoardTable title="매출 통계" unit="(단위: 만원)" data={salesInfo} />
            <div className={styles['board-revenue-inner']} style={{ marginBottom: 0 }}>
              <div className={styles['label-wrapper']}>
                <div className={styles.label}>연간 매출 통계</div>
                <div className={styles['chart-label-section']}>
                  <div className={styles.color1} />
                  <div className={styles['chart-label']}>매출액</div>
                  <div className={styles['chart-unit-label']}>(단위: 만원)</div>
                </div>
              </div>
              <div className={styles.divided} />
              {data.staticsSales && data.staticsSales[year] && (
                <YearlyChart chartData={data.staticsSales[year].totalMonthly} />
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles['board-info-section']}>
              <div className={styles['board-info-left-loading']}>
                <Skeleton width={384} height={484} />
              </div>
              <div className={styles['board-info-right-loading']}>
                <Skeleton width={792} height={230} style={{ marginBottom: 27 }} />
                <Skeleton width={792} height={230} />
              </div>
            </div>
            <div className={styles.divided} />
            <Skeleton width={1200} height={358} />
            <div className={styles.divided} />
            <Skeleton width={1200} height={230} />
            <Skeleton width={1200} height={358} />
          </>
        )}
      </div>
    </>
  );
};

export default CompanyPage;
