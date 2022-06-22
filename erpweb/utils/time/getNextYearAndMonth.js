/* eslint-disable no-plusplus */
const getNextYearAndMonth = (min) => {
  const year = [];
  for (let i = min; i <= new Date().getFullYear() + 1; i++) {
    year.push(String(i));
  }

  return {
    year,
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

export default getNextYearAndMonth;
