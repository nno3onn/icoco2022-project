/* eslint-disable implicit-arrow-linebreak */
const dateFormat = (value) =>
  value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

export default dateFormat;
