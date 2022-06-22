import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import titleConfigs from 'configs/title';
import pathConfigs from 'configs/path';

import CompanyListItem from 'components/listItem/company';
import Helmet from 'components/helmet';
import SearchInput from 'components/input/search';
import CreateButton from 'components/button/create';

import searchCompany from 'utils/company/search';

import styles from 'pages/company/list/list.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const CompanyListPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState('');

  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const getMoreCompany = async () => {
    setLoading(true);

    const list = await searchCompany({ keyword, offset });
    if (list) {
      if (list.length < 8) {
        setTarget(null);
      }
      setData(data.concat(list));
      setOffset(offset + list.length);
    }
    setLoading(false);
  };

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
      getMoreCompany();
    }
  };

  useEffect(() => {
    let observer;
    if (target && !loading) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.4,
      });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [loading]);

  useEffect(() => {
    getMoreCompany();
  }, []);

  const handleSearch = async () => {
    setData([]);
    setOffset(0);
    setLoading(true);

    const list = await searchCompany({ keyword, offset: 0 });
    if (list) {
      if (list.length < 8) {
        setTarget(null);
      }
      setData(list);
      setOffset(offset + list.length);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.companyListTitle} />
      <div className={styles.container}>
        <div className={styles.header}>업체관리</div>
        <div className={styles['search-wrapper']}>
          <SearchInput
            placeholder="업체명으로 검색해주세요"
            searchText={keyword}
            setter={setKeyword}
            onKeyDown={handleKeyDown}
            onClick={handleSearch}
          />
        </div>
        <div className={styles['table-wrapper']}>
          <div className={styles['table-header']}>
            <div className={styles.f15}>업체명</div>
            <div className={styles.f3}>주소</div>
            <div className={styles.f15}>전화번호</div>
            <div className={styles.f1}>총 관리자 수</div>
            <div className={styles.f1}>총 예약 수</div>
          </div>
          {data && data.length ? (
            <>
              {data.map((company) => (
                <Link href={`/company/${company.objectID}`} key={String(company.objectID)}>
                  <div className={styles['company-wrapper']}>
                    <CompanyListItem data={company} />
                  </div>
                </Link>
              ))}
              <div ref={setTarget} />
            </>
          ) : null}
          {loading && (
            <Skeleton width={996} height={78} count={6} style={{ marginBottom: '20px' }} />
          )}
        </div>
        <div className={styles['button-wrapper']}>
          <CreateButton onClick={() => router.push(pathConfigs.company.create)} text="업체 추가" />
        </div>
      </div>
    </>
  );
};

export default CompanyListPage;
