/* eslint-disable operator-linebreak */
const calcBirth = (value) => {
  const time = {
    year: value.split('.')[0],
    month: value.split('.')[1],
    date: value.split('.')[2],
  };

  const now = new Date();
  const today = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };

  const todayDate = new Date(today.year, today.month, today.day);
  const valueDate = new Date(time.year, time.month, time.date);

  const diffDays =
    (todayDate.getTime() - valueDate.getTime()) / (1000 * 60 * 60 * 24);

  const nthYear = Math.floor(diffDays / 365);

  return { birth: nthYear + 1, careerStarted: nthYear };
};

export default calcBirth;
