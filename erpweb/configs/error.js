const errorConfigs = {
  emptyValues: {
    code: 'empty-values',
    msg: '모든 항목을 채워주세요',
  },
  permissionDenied: {
    code: 'permission-denied',
    msg: '접근 불가능한 계정입니다',
  },
  userNotFound: {
    code: 'auth/user-not-found',
    msg: '존재하지 않는 계정입니다',
  },
  invalidEmail: {
    code: 'auth/invalid-email',
    msg: '올바른 이메일 형식이 아닙니다.',
  },
  userDisabled: {
    code: 'auth/user-disabled',
    msg: '존재하지 않는 계정입니다',
  },
  existsEmail: {
    code: 'auth/email-already-in-use',
    msg: '존재하는 유저 이메일입니다.',
  },
  wrongPassword: {
    code: 'auth/wrong-password',
    msg: '잘못된 비밀번호 입니다',
  },
  invalidPassword: {
    code: 'auth/weak-password',
    msg: '비밀번호는 문자/숫자/특수문자 포함 8~15자리로 입력해주세요.',
  },
  later: {
    code: 'auth/too-many-requests',
    msg: '잠시 후 다시 시도해주세요',
  },
  invalidRegisterNumber: {
    msg: '사업자 등록번호는 10자리 입니다.',
  },
  invalidPhone: {
    msg: '전화번호 길이가 짧습니다.',
  },
  default: {
    code: 'reload',
    msg: '잠시후에 다시 시도해주세요',
  },
  noSearch: {
    msg: '검색어를 입력해주세요',
  },
};

export default errorConfigs;
