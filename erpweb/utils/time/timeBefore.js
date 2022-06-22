import calcDate from './calcDate';

const timeBefore = (value) => {
  const diffDays = calcDate(value);
  return `${diffDays > 0 ? `${diffDays}일 전` : '상태 변경'}`;
};

export default timeBefore;
