/* eslint-disable operator-linebreak */
const filterStatus = (status, list) => {
  if (list === undefined) return;

  const statusList =
    status === '전체' ? [...list] : list.filter((el) => el.status === status);

  return statusList;
};

export default filterStatus;
