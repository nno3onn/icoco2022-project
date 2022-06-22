/* eslint-disable operator-linebreak */
const getFilename = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month =
    today.getMonth() + 1 >= 10
      ? today.getMonth() + 1
      : `0${today.getMonth() + 1}`;
  const day = today.getDate() >= 10 ? today.getDate() : `0${today.getDate()}`;

  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  const milliseconds = today.getMilliseconds();

  return `${year}${month}${day}-${hours}${minutes}${seconds}${milliseconds}`;
};

export default getFilename;
