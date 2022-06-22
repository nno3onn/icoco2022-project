/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';
import dataConfigs from 'configs/data';

import styles from './cost.module.scss';

const formatNumber = (n) => {
  if (typeof n === 'number') return n.toLocaleString();
  return '-';
};

const CostTable = ({ data, type }) => {
  const { minWeek } = dataConfigs;

  const showData = ({ info, grades, idx }) => (info ? formatNumber(info[grades][idx]) : '-');

  const showCosts = ({ grades }) => {
    const minWeekIndex = minWeek[grades] - 1;

    return (
      <tr>
        <td>{grades}형</td>
        <td>{showData({ info: data.serviceCostInfo, grades, idx: minWeekIndex })}</td>
        <td>{showData({ info: data.revenueCostInfo, grades, idx: minWeekIndex })}</td>
        <td>{showData({ info: data.userCostInfo, grades, idx: minWeekIndex })}</td>
        <td>{showData({ info: data.serviceCostInfo, grades, idx: minWeekIndex + 1 })}</td>
        <td>{showData({ info: data.revenueCostInfo, grades, idx: minWeekIndex + 1 })}</td>
        <td>{showData({ info: data.userCostInfo, grades, idx: minWeekIndex + 1 })}</td>
        <td>{showData({ info: data.serviceCostInfo, grades, idx: minWeekIndex + 2 })}</td>
        <td>{showData({ info: data.revenueCostInfo, grades, idx: minWeekIndex + 2 })}</td>
        <td>{showData({ info: data.userCostInfo, grades, idx: minWeekIndex + 2 })}</td>
      </tr>
    );
  };

  const showTitle = (grades) => {
    if (type === 'voucher') {
      return (
        <>
          <th colSpan={3}>단축{`(${minWeek[grades] * 5}일)`}</th>
          <th colSpan={3}>표준{`(${(minWeek[grades] + 1) * 5}일)`}</th>
          <th colSpan={3}>연장{`(${(minWeek[grades] + 2) * 5}일)`}</th>
        </>
      );
    }
  };

  const tableHead = () => {
    if (type === 'voucher') {
      return (
        <thead>
          <tr>
            <th rowSpan={2}>구분</th>
            <th rowSpan={2}>순위</th>
            <th rowSpan={2}>등급</th>
            {showTitle('A-가-1')}
          </tr>
          <tr>
            <th>가격</th>
            <th>정부지원</th>
            <th>본인부담금</th>
            <th>가격</th>
            <th>정부지원</th>
            <th>본인부담금</th>
            <th>가격</th>
            <th>정부지원</th>
            <th>본인부담금</th>
          </tr>
        </thead>
      );
    }
    return (
      <thead>
        <tr>
          <th rowSpan={2} style={{ width: 150 }}>
            구분
          </th>
          <th colSpan={5}>일반 서비스 요금</th>
        </tr>
        <tr>
          <th>1주</th>
          <th>2주</th>
          <th>3주</th>
          <th>4주</th>
          <th>n주(1주당)</th>
        </tr>
      </thead>
    );
  };

  const tableBody = () => {
    if (type === 'voucher') {
      return (
        <tbody>
          <tr>
            <td rowSpan={12}>단테아</td>
            <td rowSpan={4}>첫째아</td>
          </tr>
          {showCosts({ grades: 'A-가-1' })}
          {showCosts({ grades: 'A-통합-1' })}
          {showCosts({ grades: 'A-라-1' })}
          <tr>
            <td rowSpan={4}>둘째아</td>
            <th>등급</th>
            {showTitle('A-가-2')}
          </tr>
          {showCosts({ grades: 'A-가-2' })}
          {showCosts({ grades: 'A-통합-2' })}
          {showCosts({ grades: 'A-라-2' })}
          <tr>
            <td rowSpan={4}>셋째아</td>
            <th>등급</th>
            {showTitle('A-가-3')}
          </tr>
          {showCosts({ grades: 'A-가-3' })}
          {showCosts({ grades: 'A-통합-3' })}
          {showCosts({ grades: 'A-라-3' })}

          <tr>
            <td rowSpan={8}>
              쌍태아
              <br />
              (중증
              <br />+<br />
              단테아)
            </td>
            <td rowSpan={4}>인력1명</td>
            <th>등급</th>
            {showTitle('B-가-1')}
          </tr>
          {showCosts({ grades: 'B-가-1' })}
          {showCosts({ grades: 'B-통합-1' })}
          {showCosts({ grades: 'B-라-1' })}
          <tr>
            <td rowSpan={4}>인력2명</td>
            <th>등급</th>
            {showTitle('B-가-2')}
          </tr>
          {showCosts({ grades: 'B-가-2' })}
          {showCosts({ grades: 'B-통합-2' })}
          {showCosts({ grades: 'B-라-2' })}

          <tr>
            <td rowSpan={4}>
              삼태아
              <br />
              이상
              <br />
              (중증
              <br />+<br />
              쌍태아
              <br />
              이상)
            </td>
            <td rowSpan={4}>인력2명</td>
            <th>등급</th>
            {showTitle('C-가')}
          </tr>
          {showCosts({ grades: 'C-가' })}
          {showCosts({ grades: 'C-통합' })}
          {showCosts({ grades: 'C-라' })}
        </tbody>
      );
    }
    return (
      <tbody>
        {dataConfigs.normalType.map((grades) => (
          <tr>
            <td>{grades}</td>
            {new Array(5).fill().map((e, idx) => (
              <td>
                <div className={styles[`${type}-input-wrapper`]}>
                  {formatNumber(data.serviceCostInfo[grades][idx])}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className={styles.container}>
      <table>
        {tableHead()}
        {tableBody()}
      </table>
    </div>
  );
};

export default CostTable;
