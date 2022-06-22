/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
import calcBirth from 'utils/time/calcBirth';

const filterAge = (birth, list) => {
  if (list === undefined) return;

  let ageList;

  if (birth === '40대 미만') {
    ageList = list.filter((el) => calcBirth(el.birthDate).birth < 40);
  } else if (birth === '40대') {
    ageList = list.filter(
      (el) => calcBirth(el.birthDate).birth >= 40 && calcBirth(el.birthDate).birth < 50,
    );
  } else if (birth === '50대') {
    ageList = list.filter(
      (el) => calcBirth(el.birthDate).birth >= 50 && calcBirth(el.birthDate).birth < 60,
    );
  } else if (birth === '60대 이상') {
    ageList = list.filter((el) => calcBirth(el.birthDate).birth >= 60);
  }

  return ageList;
};

export default filterAge;
