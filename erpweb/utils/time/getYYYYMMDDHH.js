const getYYYYMMDDHH = () => {
  const time = new Date();
  const YYYY = time.getFullYear();
  const MM = time.getMonth() + 1;
  const DD = time.getDate();
  const HH = time.getHours();
  return `${YYYY}${MM >= 10
    ? MM : `0${MM}`}${DD >= 10
    ? DD : `0${DD}`}${HH >= 10
    ? HH : `0${HH}`}`;
};

export default getYYYYMMDDHH;
