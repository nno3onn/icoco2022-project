const ADMINCENTER = '010-2612-5108';
const LOCATION = {
  대구광역시: {
    중구: ['동인동', '삼덕동', '성내동', '대신동', '남산동', '대봉동'],
    동구: [
      '신암동',
      '신천동',
      '효목동',
      '도평동',
      '불로봉무동',
      '지저동',
      '동촌동',
      '방촌동',
      '해안동',
      '안심동',
      '공산동',
    ],
    서구: ['내당동', '비산동', '평리동', '상중이동', '원대동'],
    남구: ['이천동', '봉덕동', '대명동'],
    북구: [
      '고성동',
      '칠성동',
      '침산동',
      '대현동',
      '산격동',
      '복현동',
      '검단동',
      '무태조야동',
      '관문동',
      '태전동',
      '구암동',
      '관음동',
      '읍내동',
      '동천동',
      '노원동',
      '국우동',
    ],
    수성구: [
      '범어동',
      '만촌동',
      '수성동',
      '황금동',
      '중동',
      '상동',
      '파동',
      '두산동',
      '지산동',
      '범물동',
      '고산동',
    ],
    달서구: [
      '성당동',
      '두류동',
      '본리동',
      '감삼동',
      '죽전동',
      '장기동',
      '용산동',
      '이곡동',
      '신당동',
      '월성동',
      '진천동',
      '상인동',
      '도원동',
      '송현동',
      '본동',
    ],
    달성군: [
      '화원읍',
      '논공읍',
      '다사읍',
      '유가읍',
      '옥포읍',
      '현풍읍',
      '가창면',
      '하빈면',
      '구지면',
    ],
  },
};
const FILTER_DESC = {
  전체: '모든 상태를 표시합니다.',
  '예약 (출산일 미확정)': '출산일 미확정 예약 목록입니다.',
  '예약 (출산일 확정)': '출산일 확정 예약 목록입니다.',
  파견중: '관리사가 파견나가 있는 상태입니다.',
  서비스취소: '사용자가 서비스 환불을 요청한 상태입니다',
  서비스종료: '모든 종료된 서비스를 표시합니다.',
};

const RANK_TYPES = {
  A: {
    가: ['1', '2', '3'],
    통합: ['1', '2', '3'],
    라: ['1', '2', '3'],
  },
  B: {
    가: ['1', '2'],
    통합: ['1', '2'],
    라: ['1', '2'],
  },
  C: {
    가: null,
    통합: null,
    라: null,
  },
};
const NORMAL_RANK_TYPES = {
  일반: ['단태아', '쌍태아', '삼태아'],
};

const DISPATCH_STATUS = ['전체', '대기', '파견예정', '파견', '휴가'];
const DISPATCH_PERIOD = ['1주', '2주', '3주', '4주', '5주'];

const CAREER_PERIOD = ['1년 미만', '1~3년', '3~5년', '5년 이상'];
const AGE_PERIOD = ['40대 미만', '40대', '50대', '60대 이상'];

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
  ADMINCENTER,
  LOCATION,
  FILTER_DESC,

  RANK_TYPES,
  NORMAL_RANK_TYPES,

  DISPATCH_STATUS,
  DISPATCH_PERIOD,
  CAREER_PERIOD,
  AGE_PERIOD,

  gradesType,
  normalType,
  minWeek,
};

export default dataConfigs;
