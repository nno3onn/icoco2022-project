/* eslint-disable no-plusplus */
const getDate = (year, month) => {
  const date = [];

  for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
    date.push(i < 10 ? `0${String(i)}` : String(i));
  }

  return date;
};

export default getDate;
