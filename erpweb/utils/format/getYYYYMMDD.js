const dateFormat = (value = null) => {
  const time = value ? new Date(value) : new Date();

  const YYYY = time.getFullYear();
  const MM = time.getMonth() + 1;
  const DD = time.getDate();

  return `${YYYY}.${MM >= 10 ? MM : `0${MM}`}.${DD >= 10 ? DD : `0${DD}`}`;
};

export default dateFormat;
