const getYearOrMonthOrDate = (value) => {
  const time = new Date(value);

  return {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    date: time.getDate(),
  };
};

export default getYearOrMonthOrDate;
