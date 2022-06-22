/* eslint-disable operator-linebreak */
const getDatetime = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  const milliseconds = today.getMilliseconds();

  const MM = month >= 10 ? month : `0${month}`;
  const DD = day >= 10 ? day : `0${day}`;
  const HH = hours >= 10 ? hours : `0${hours}`;
  const mm = minutes >= 10 ? minutes : `0${minutes}`;
  const ss = seconds >= 10 ? seconds : `0${seconds}`;
  const mili = milliseconds >= 10 ? milliseconds : `0${milliseconds}`;

  return `${year}${MM}${DD}${HH}${mm}${ss}${mili}`;
};

export default getDatetime;
