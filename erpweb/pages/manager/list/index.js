/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Skeleton from 'react-loading-skeleton';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import Helmet from 'components/helmet';
import Input from 'components/input';
import Dropdown from 'components/dropdown';
import configs from 'configs/data';
import CreateButton from 'components/button/create';

import calcBirth from 'utils/time/calcBirth';
import timeBefore from 'utils/time/timeBefore';
import getExpectedManagerList from 'utils/manager/expected';
import searchManagerList from 'utils/manager/search';
import filterManagerList from 'utils/manager/filter';

import titleConfigs from 'configs/title';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const ManagerListPage = () => {
  const sliderRef = useRef();
  const [sliderPage, setSliderPage] = useState(0);

  // list
  const [data, setData] = useState();
  const [expectedList, setExpectedList] = useState();

  // filter
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('전체');
  const [careerStarted, setCareerStarted] = useState('1년 미만');
  const [birth, setBirth] = useState('40대 미만');

  const handlePrev = () => {
    if (sliderRef.current && sliderRef.current.children.length > 4) {
      if (sliderPage < 0) {
        setSliderPage(sliderPage + 1);
      } else {
        setSliderPage(sliderPage);
      }
    }
  };

  const handleNext = () => {
    if (sliderRef.current && sliderRef.current.children.length > 4) {
      if (4 - sliderRef.current.children.length < sliderPage) {
        setSliderPage(sliderPage - 1);
      } else {
        setSliderPage(sliderPage);
      }
    }
  };

  const handleSearch = () => {
    const onSuccess = (list) => {
      if (!list) return setData([]);

      const managerInfo = { list, filter: { status, careerStarted, birth } };
      filterManagerList(managerInfo, (res) => setData(res));
    };

    searchManagerList(keyword, onSuccess);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  useEffect(() => {
    handleSearch();
  }, [status, careerStarted, birth]);

  useEffect(() => {
    const onSuccess = (list) => {
      if (!list) return setExpectedList([]);
      getExpectedManagerList(list, setExpectedList);
    };
    searchManagerList(null, onSuccess);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.managerListTitle} />
      <div className={styles.container}>
        <div className={styles.heading}>관리사 관리</div>
        <div className={styles.divided} />
        <div className={styles.label}>파견 예정</div>
        <div className={styles['managers-list-wating-contents']}>
          <div className={styles['managers-list-nav']} onClick={handlePrev}>
            <img alt="arrow" src="/icons/arrow-left-g-1.png" />
          </div>
          {expectedList ? (
            <>
              <div
                className={styles['managers-list-wating-list']}
                ref={sliderRef}
                style={{ marginLeft: `${180 * sliderPage}px` }}
              >
                {expectedList.map((manager, i) => (
                  <Link href={`/manager/${manager.objectID}`} key={String(i)}>
                    <a>
                      <div className={styles['manager-wrapper']}>
                        <div
                          className={styles.thumbnail}
                          style={{
                            backgroundImage: `url(${manager.profileImage || '/icons/manager.png'})`,
                          }}
                        />
                        <div className={styles['manager-info']}>
                          <div className={styles['manager-name']}>{manager.name}</div>
                          <div className={styles.started}>
                            {timeBefore(manager.dispatchStartDate)}
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
              {expectedList.length > 5 ? <div className={styles['slider-blur-thumbnail']} /> : null}
            </>
          ) : (
            <>
              <div
                className={styles['managers-list-wating-list']}
                ref={sliderRef}
                style={{ marginLeft: `${180 * sliderPage}px` }}
              >
                {new Array(7).fill().map(() => (
                  <div className={styles['manager-wrapper-waiting-loading']}>
                    <Skeleton width={180} height={112} />
                  </div>
                ))}
              </div>
              <div className={styles['slider-blur-thumbnail']} />
            </>
          )}
          <div
            className={styles['managers-list-nav']}
            onClick={handleNext}
            style={{ marginLeft: '950px' }}
          >
            <img alt="arrow" src="/icons/arrow-right-g-1.png" />
          </div>
        </div>
        <div className={styles.divided} />
        <div className={styles.label}>관리사 목록</div>
        <div className={styles['action-wrapper']}>
          <div className={styles['input-wrapper']}>
            <Input
              placeholder="관리사 이름으로 검색 가능합니다."
              value={keyword}
              onChange={({ target: { value } }) => setKeyword(value)}
              onKeyDown={handleKeyDown}
            />
            <div onClick={handleSearch} className={styles.search}>
              <img alt="search" src="/icons/search.png" />
            </div>
          </div>
        </div>
        <div className={styles['filter-section']}>
          <div className={styles['filter-wrapper-left']}>
            <div className={styles['dropdown-label']}>파견 상태</div>
            <div className={styles['dropdown-wrapper']}>
              <Dropdown value={status} setter={setStatus} valueSets={configs.DISPATCH_STATUS} />
            </div>
          </div>
          <div className={styles['filter-wrapper-center']}>
            <div className={styles['dropdown-label']}>경력</div>
            <div className={styles['dropdown-wrapper']}>
              <Dropdown
                value={careerStarted}
                setter={setCareerStarted}
                valueSets={configs.CAREER_PERIOD}
              />
            </div>
          </div>
          <div className={styles['filter-wrapper-right']}>
            <div className={styles['dropdown-label']}>연령</div>
            <div className={styles['dropdown-wrapper']}>
              <Dropdown value={birth} setter={setBirth} valueSets={configs.AGE_PERIOD} />
            </div>
          </div>
        </div>
        <div className={styles['table-section']}>
          <div className={styles['table-header']}>
            <div className={styles['td-1']}>관리사명</div>
            <div className={styles['td-2']}>파견지역</div>
            <div className={styles['td-3']}>경력</div>
            <div className={styles['td-3']}>연령</div>
            <div className={styles['td-3']}>리뷰</div>
            <div className={styles['td-3']}>상태</div>
          </div>
          <div className={styles['table-body']}>
            {data ? (
              <>
                {data.map((manager, index) => (
                  <Link href={`/manager/${manager.objectID}`} key={String(index)}>
                    <a>
                      <div className={styles['manager-wrapper']}>
                        <div
                          className={styles.thumbnail}
                          style={{
                            backgroundImage: `url(${manager.profileImage || '/icons/manager.png'})`,
                          }}
                        />
                        <div className={styles['td-1']}>{manager.name}</div>
                        <div className={styles['td-2']}>{manager.dispatchableArea.join(', ')}</div>
                        <div className={styles['td-3']}>
                          {calcBirth(manager.careerStartedDate).careerStarted}
                        </div>
                        <div className={styles['td-3']}>{calcBirth(manager.birthDate).birth}</div>
                        <div className={styles['td-3']}>{manager.totalReview}</div>
                        <div className={styles['td-3']}>{manager.status}</div>
                      </div>
                    </a>
                  </Link>
                ))}
              </>
            ) : (
              <Skeleton width={996} height={78} style={{ marginBottom: '20px' }} count={6} />
            )}
          </div>
        </div>
        <div className={styles['button-wrapper']}>
          <Link href="/manager/create">
            <a>
              <CreateButton text="관리사 추가" />
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ManagerListPage;
