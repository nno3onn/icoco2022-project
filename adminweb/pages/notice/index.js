import { useEffect } from 'react';
import { useRouter } from 'next/router';
import pathConfigs from 'configs/path';

const TipRoot = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(pathConfigs.notice.default);
  }, []);

  return null;
};

export default TipRoot;
