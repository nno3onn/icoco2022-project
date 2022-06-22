/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';

import Input from 'components/input';

import calcCosts from 'utils/information/calcCosts';

import dataConfigs from 'configs/data';

import styles from './cost.module.scss';

const { minWeek } = dataConfigs;

const CostUpdateTable = ({
  type,
  serviceCostInfo,
  revenueCostInfo,
  userCostInfo,
  setServiceCostInfo,
  setRevenueCostInfo,
  setUserCostInfo,
}) => {
  const showTitle = ({ week }) => (
    <>
      <th colSpan={3}>단축{week ? `(${week * 5}일)` : null}</th>
      <th colSpan={3}>표준{week ? `(${(week + 1) * 5}일)` : null}</th>
      <th colSpan={3}>연장{week ? `(${(week + 2) * 5}일)` : null}</th>
    </>
  );

  const handleUpdateUserCost = ({ grades, idx, thisMinWeek, thisUserCost }) => {
    const obj = [...userCostInfo[grades]];
    obj[thisMinWeek - 1 + idx] = thisUserCost;

    if (idx === 0) {
      let tmp = 0;
      while (tmp < thisMinWeek) {
        obj[tmp] = +((thisUserCost / thisMinWeek) * (tmp + 1));
        tmp += 1;
      }
    }
    if (idx === 2) {
      const extendedWeek = thisMinWeek + 2;
      let tmp = extendedWeek;
      while (extendedWeek - 1 < tmp && tmp <= 4) {
        obj[tmp] = +((thisUserCost / extendedWeek) * (tmp + 1));
        tmp += 1;
      }
    }

    setUserCostInfo({ ...userCostInfo, [grades]: obj });
  };

  const showData = ({ who, info, setter, grades, idx, thisMinWeek }) => (
    <div className={styles[`${type}-input-wrapper`]}>
      <Input
        value={info[grades][thisMinWeek - 1 + idx]}
        onChange={({ target: { value } }) => {
          calcCosts({
            grades,
            thisMinWeek,
            info,
            idx,
            setter,
            cost: value,
          });

          let thisUserCost;
          if (who === 'service') {
            thisUserCost = value - revenueCostInfo[grades][thisMinWeek - 1 + idx];
          } else {
            thisUserCost = serviceCostInfo[grades][thisMinWeek - 1 + idx] - value;
          }
          handleUpdateUserCost({ grades, idx, thisMinWeek, thisUserCost });
        }}
      />
    </div>
  );

  const showCosts = ({ grades }) => (
    <tr>
      <td>{grades}형</td>
      {new Array(3).fill().map((e, idx) => {
        const thisMinWeek = minWeek[grades];

        return (
          <>
            <td>
              {showData({
                who: 'service',
                info: serviceCostInfo,
                setter: setServiceCostInfo,
                grades,
                idx,
                thisMinWeek,
              })}
            </td>
            <td>
              {showData({
                who: 'revenue',
                info: revenueCostInfo,
                setter: setRevenueCostInfo,
                grades,
                idx,
                thisMinWeek,
              })}
            </td>
            <td>
              <div className={styles[`${type}-input-wrapper`]}>
                <Input value={userCostInfo[grades][thisMinWeek - 1 + idx]} disabled />
                {/* <Input value={thisUserCost} disabled /> */}
              </div>
            </td>
          </>
        );
      })}
    </tr>
  );

  const tableHead = () => {
    if (type === 'voucher') {
      return (
        <thead>
          <tr>
            <th rowSpan={2}>구분</th>
            <th rowSpan={2}>순위</th>
            <th rowSpan={2}>등급</th>
            {showTitle({ week: minWeek['A-가-1'] })}
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
            <td rowSpan={12}>단태아</td>
            <td rowSpan={4}>첫째아</td>
          </tr>
          {showCosts({ grades: 'A-가-1' })}
          {showCosts({ grades: 'A-통합-1' })}
          {showCosts({ grades: 'A-라-1' })}
          <tr>
            <td rowSpan={4}>둘째아</td>
            <th>등급</th>
            {showTitle({ week: minWeek['A-가-2'] })}
          </tr>
          {showCosts({ grades: 'A-가-2' })}
          {showCosts({ grades: 'A-통합-2' })}
          {showCosts({ grades: 'A-라-2' })}
          <tr>
            <td rowSpan={4}>셋째아</td>
            <th>등급</th>
            {showTitle({ week: minWeek['A-가-3'] })}
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
              단태아)
            </td>
            <td rowSpan={4}>인력1명</td>
            <th>등급</th>
            {showTitle({ week: minWeek['B-가-1'] })}
          </tr>
          {showCosts({ grades: 'B-가-1' })}
          {showCosts({ grades: 'B-통합-1' })}
          {showCosts({ grades: 'B-라-1' })}
          <tr>
            <td rowSpan={4}>인력2명</td>
            <th>등급</th>
            {showTitle({ week: minWeek['B-가-2'] })}
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
            {showTitle({ week: minWeek['C-가'] })}
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
                  <Input
                    value={serviceCostInfo[grades][idx]}
                    onChange={({ target: { value } }) => {
                      const obj = [...serviceCostInfo[grades]];
                      obj[idx] = +value;
                      setServiceCostInfo({ ...serviceCostInfo, [grades]: obj });
                    }}
                  />
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

export default CostUpdateTable;
