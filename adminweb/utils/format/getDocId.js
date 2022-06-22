const getYYMMDDHHMMSS = () => {
  const time = new Date();
  const YY = time.getFullYear().toString().substring(2, 4);

  let MM = time.getMonth() + 1;
  MM = MM >= 10 ? MM : `0${MM}`;

  let DD = time.getDate();
  DD = DD >= 10 ? DD : `0${DD}`;

  let HH = time.getHours();
  HH = HH >= 10 ? HH : `0${HH}`;

  let mm = time.getMinutes();
  mm = mm >= 10 ? mm : `0${mm}`;

  let ss = time.getSeconds();
  ss = ss >= 10 ? ss : `0${ss}`;

  return YY + MM + DD + HH + mm + ss;
};

export default getYYMMDDHHMMSS;
