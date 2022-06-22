/* eslint-disable implicit-arrow-linebreak */
export default (milis) => {
  const date = new Date(milis);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}.${month < 10 ? `0${month}` : month}.${day < 10 ? `0${day}` : day}`;
};
