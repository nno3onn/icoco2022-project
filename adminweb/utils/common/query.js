/* eslint-disable implicit-arrow-linebreak */
const getQuery = (params) =>
  Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

export default getQuery;
