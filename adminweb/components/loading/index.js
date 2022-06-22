import React from 'react';
import ReactLoading from 'react-loading';

import Helmet from 'components/helmet';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';

const LoadingView = () => (
  <div className={styles.container}>
    <Helmet title={titleConfigs.loadingTitle} />
    <ReactLoading color="#fff" width={120} />
  </div>
);

export default LoadingView;
