const eventType1 = ['도우미정보', '육아정보', '정부혜택', '산후관리'];
const eventType2 = ['출산', '신생아', '영유아', '지역정보'];

const gradesType = [
  'A-가-1',
  'A-통합-1',
  'A-라-1',
  'A-가-2',
  'A-통합-2',
  'A-라-2',
  'A-가-3',
  'A-통합-3',
  'A-라-3',
  'B-가-1',
  'B-통합-1',
  'B-라-1',
  'B-가-2',
  'B-통합-2',
  'B-라-2',
  'C-가',
  'C-통합',
  'C-라',
];

const normalType = ['일반-단태아', '일반-쌍태아', '일반-삼태아'];

const minWeek = {
  'A-가-1': 1,
  'A-통합-1': 1,
  'A-라-1': 1,
  'A-가-2': 2,
  'A-통합-2': 2,
  'A-라-2': 2,
  'A-가-3': 2,
  'A-통합-3': 2,
  'A-라-3': 2,
  'B-가-1': 2,
  'B-통합-1': 2,
  'B-라-1': 2,
  'B-가-2': 2,
  'B-통합-2': 2,
  'B-라-2': 2,
  'C-가': 3,
  'C-통합': 3,
  'C-라': 3,
};

const dataConfigs = {
  eventType1,
  eventType2,

  gradesType,
  normalType,
  minWeek,
};

export default dataConfigs;
