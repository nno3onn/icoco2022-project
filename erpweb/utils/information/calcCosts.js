/* eslint-disable object-curly-newline */

import onlyNumber from 'utils/input/onlyNumber';

const calcCosts = ({ grades, thisMinWeek, info, setter, idx, cost }) => {
  const obj = [...info[grades]];

  obj[thisMinWeek - 1 + idx] = +onlyNumber(cost);

  if (idx === 0) {
    let tmp = 0;
    while (tmp < thisMinWeek) {
      obj[tmp] = +((cost / thisMinWeek) * (tmp + 1));
      tmp += 1;
    }
  }
  if (idx === 2) {
    const extendedWeek = thisMinWeek + 2;
    let tmp = extendedWeek;
    while (extendedWeek - 1 < tmp && tmp <= 4) {
      obj[tmp] = +((cost / extendedWeek) * (tmp + 1));
      tmp += 1;
    }
  }
  setter({ ...info, [grades]: obj });
};

export default calcCosts;
