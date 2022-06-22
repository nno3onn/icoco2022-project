/* eslint-disable operator-linebreak */
const dateFormat = (value = null) => {
  const time = value ? new Date(value) : new Date();

  const year = time.getFullYear();
  const month =
    time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`;
  const day = time.getDate() >= 10 ? time.getDate() : `0${time.getDate()}`;

  return `${year}.${month}.${day}`;
};

export default dateFormat;
