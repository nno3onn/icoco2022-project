const calcWeeks = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const elapsedMiliseconds = d2.getTime() - d1.getTime();

  const elapsedWeek = elapsedMiliseconds / 1000 / 60 / 60 / 24 / 7;
  return elapsedWeek;
};

export default calcWeeks;
