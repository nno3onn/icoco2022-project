const pathConfigs = {
  root: '/',
  company: {
    prefix: '/company',
    default: '/company/list',
    show: '/company/show',
    search: '/company/search',
    create: '/company/create',
    update: '/company/update',
    delete: '/tip/delete',
  },
  tip: {
    prefix: '/tip',
    default: '/tip/list',
    show: '/tip/show',
    create: '/tip/create',
    update: '/tip/update',
    delete: '/tip/delete',
  },
  notice: {
    prefix: '/notice',
    default: '/notice/list',
    show: '/notice/show',
    create: '/notice/create',
    update: '/notice/update',
    delete: '/notice/delete',
  },
  event: {
    prefix: '/event',
    default: '/event/list',
    create: '/event/create',
    update: '/event/update',
    delete: '/event/delete',
  },
  cost: {
    prefix: '/cost',
    default: '/cost/info',
  },
};

export default pathConfigs;
