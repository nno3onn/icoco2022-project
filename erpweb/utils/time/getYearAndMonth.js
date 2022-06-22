/* eslint-disable no-plusplus */
const getYearAndMonth = (min) => {
  const year = [];
  if (min) {
    for (let i = min; i < new Date().getFullYear() + 1; i++) {
      year.push(String(i));
    }
  } else {
    for (let i = 1940; i < new Date().getFullYear() - 20; i++) {
      year.push(String(i));
    }
  }

  return {
    year: year.reverse(),
    month: [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ],
  };
};

export default getYearAndMonth;
