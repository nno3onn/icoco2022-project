/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import firebaseInit from 'utils/common/firebaseInit';

import AuthHoc from 'components/hocs/auth';

import 'styles/globals.scss';

function App({ Component, pageProps }) {
  firebaseInit();

  return (
    <AuthHoc>
      <Component {...pageProps} />
    </AuthHoc>
  );
}

App.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default App;
