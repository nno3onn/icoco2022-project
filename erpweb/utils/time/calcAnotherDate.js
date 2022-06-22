/* eslint-disable implicit-arrow-linebreak */

const calcAnotherDate = (date, day) =>
  new Date(new Date(date).setDate(new Date(date).getDate() + day));

export default calcAnotherDate;
