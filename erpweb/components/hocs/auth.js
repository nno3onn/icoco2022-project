import React, { useState, useEffect } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import LoadingView from 'components/loading';
import Entrance from 'components/entrance';
import Welcome from 'components/welcome';
import Nav from 'components/nav';

import showItem from 'utils/common/show';

import styles from './auth.module.scss';

const AuthHoc = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authentication, setAuthentication] = useState(false);
  const [isFirstVisited, setIsFirstVisited] = useState();

  useEffect(() => {
    try {
      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const { uid } = user;

          const token = await user.getIdTokenResult();
          const { isCompany } = token.claims;
          setAuthentication(isCompany);

          const onSuccess = (info) => {
            setIsFirstVisited(info.isFirstVisited);
            setAuthentication(true);
          };

          showItem({ collectionName: 'Company', docId: uid }, onSuccess);
        }
        setLoading(false);
      });
    } catch (err) {
      setAuthentication(false);
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingView />;
  if (authentication) {
    return isFirstVisited ? (
      <Welcome />
    ) : (
      <>
        <Nav />
        <div className={styles.page}>{children}</div>
      </>
    );
  }
  return <Entrance />;
};

export default AuthHoc;
