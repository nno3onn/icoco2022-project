import { useRouter } from 'next/router';
import pathConfigs from 'configs/path';
import { useEffect } from 'react/cjs/react.development';

const CompanyRoot = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(pathConfigs.company.default);
  }, []);

  return null;
};

export default CompanyRoot;
