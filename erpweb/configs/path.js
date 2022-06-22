const pathConfigs = {
  root: '/',
  dashboard: '/dashboard',
  reservation: {
    prefix: '/reservation',
    default: '/reservation/list',
    create: '/reservation/create',
    update: '/reservation/update',
  },
  manager: {
    prefix: '/manager',
    default: '/manager/list',
    create: '/manager/create',
    update: '/manager/update',
  },
  question: {
    prefix: '/question',
    default: '/question/list',
  },
  information: {
    prefix: '/information',
    update: '/information/update',
    changePassword: '/information/changePassword',
  },
};

export default pathConfigs;
