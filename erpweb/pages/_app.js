/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import initFirebase from 'utils/common/initFirebase';

import AuthHoc from 'components/hocs/auth';

import 'styles/globals.scss';

import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import 'styles/calendar.scss';

function App({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  initFirebase();

  return pathname === '/calendar' ? (
    <Component {...pageProps} />
  ) : (
    <AuthHoc>
      <Component {...pageProps} />
    </AuthHoc>
  );
}

App.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default App;
