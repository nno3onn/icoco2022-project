/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import calcBirth from 'utils/time/calcBirth';

const filterCareerYear = (careerStarted, list) => {
  let careerList;

  if (list === undefined) return;

  if (careerStarted === '1년 미만') {
    careerList = list.filter((el) => calcBirth(el.careerStartedDate).careerStarted === 0);
  } else if (careerStarted === '1~3년') {
    careerList = list.filter(
      (el) =>
        calcBirth(el.careerStartedDate).careerStarted === 1 ||
        calcBirth(el.careerStartedDate).careerStarted === 2,
    );
  } else if (careerStarted === '3~5년') {
    careerList = list.filter(
      (el) =>
        calcBirth(el.careerStartedDate).careerStarted === 3 ||
        calcBirth(el.careerStartedDate).careerStarted === 4,
    );
  } else if (careerStarted === '5년 이상') {
    careerList = list.filter((el) => calcBirth(el.careerStartedDate).careerStarted >= 5);
  }

  return careerList;
};

export default filterCareerYear;
