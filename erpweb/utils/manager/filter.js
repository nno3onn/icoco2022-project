import filterAge from './filter/age';
import filterCareerYear from './filter/careerYear';
import filterStatus from './filter/status';

const filterManagerList = ({ list, filter }, onSuccess) => {
  try {
    const { status, careerStarted, birth } = filter;

    const statusList = filterStatus(status, list);
    const careerList = filterCareerYear(careerStarted, statusList);
    const ageList = filterAge(birth, careerList);
    const managerList = ageList
      .filter((manager) => manager !== undefined)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    onSuccess(managerList);
  } catch (err) {
    console.error(err);
  }
};

export default filterManagerList;
