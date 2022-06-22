import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';

import Helmet from 'components/helmet';
import ButtonComponent from 'components/button';
import Dropdown from 'components/dropdown';

import configs from 'configs/data';
import titleConfigs from 'configs/title';

import showItem from 'utils/common/show';
import updateCompany from 'utils/information/update';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const Welcome = () => {
  const router = useRouter();

  const [companyId, setCompanyId] = useState();
  const [data, setData] = useState();
  const [dispatchableArea, setDispatchableArea] = useState([]);
  const [areaFront, setAreaFront] = useState('');
  const [areaCenter, setAreaCenter] = useState('');
  const [areaBack, setAreaBack] = useState('');

  const handleSubmit = async () => {
    if (dispatchableArea.length === 0) {
      return alert('파견 가능 지역을 입력해주세요.');
    }
    if (window.confirm('저장하시겠습니까?')) {
      const companyInfo = {
        companyId,
        dispatchableArea,
        isFirstVisited: false,
      };
      const res = await updateCompany(companyInfo);

      if (res) {
        alert('정상 반영되었습니다.');
        router.reload();
      }
    }
  };

  const handleDelete = (index) => () => {
    if (window.confirm('삭제하시겠습니까?')) {
      const newArr = dispatchableArea;
      newArr.splice(index, 1);
      setDispatchableArea([...newArr]);
    }
  };

  useEffect(() => {
    const { uid } = getAuth().currentUser;
    setCompanyId(uid);

    const onSuccess = (info) => {
      setData(info);
    };

    showItem({ collectionName: 'Company', docId: uid }, onSuccess);
  }, []);

  useEffect(() => {
    if (areaFront && areaCenter && areaBack) {
      const isInclude = dispatchableArea.includes(`${areaFront} ${areaCenter} ${areaBack}`);

      if (isInclude) {
        alert('이미 동일한 지역이 있습니다.');
      } else {
        setDispatchableArea([...dispatchableArea, `${areaFront} ${areaCenter} ${areaBack}`]);
      }

      setAreaFront('');
      setAreaCenter('');
      setAreaBack('');
    }
  }, [areaBack]);

  return (
    <div className={styles['global-wrapper']}>
      <Helmet title={titleConfigs.firstVisitTitle} />
      <div className={styles.container}>
        <img alt="logo" src="/images/logo.png" className={styles.logo} />
        <div className={styles.heading}>
          {data ? (
            `${data.companyName}(님) 첫번째 방문을 환영합니다`
          ) : (
            <Skeleton width={350} height={20} />
          )}
        </div>
        <div className={styles['dropdown-section']}>
          <div className={styles['content-label']}>
            파견 가능 지역을 입력해주세요 (추후 변경 가능합니다)
          </div>
          <div className={styles['dropdown-list-wrapper']}>
            {data ? (
              <>
                <div className={styles['dropdown-wrapper-front']}>
                  <Dropdown
                    value={areaFront}
                    setter={setAreaFront}
                    valueSets={Object.keys(configs.LOCATION)}
                    placeholder="시 · 도"
                  />
                </div>
                <div className={styles['dropdown-wrapper-center']}>
                  <Dropdown
                    value={areaCenter}
                    setter={setAreaCenter}
                    valueSets={areaFront ? Object.keys(configs.LOCATION[areaFront]) : []}
                    placeholder="군 · 구"
                  />
                </div>
                <div className={styles['dropdown-wrapper-back']}>
                  <Dropdown
                    value={areaBack}
                    setter={setAreaBack}
                    valueSets={
                      areaFront && areaCenter ? configs.LOCATION[areaFront][areaCenter] : []
                    }
                    placeholder="동 · 읍 · 면"
                  />
                </div>
              </>
            ) : (
              <>
                <Skeleton width={160} height={46} style={{ marginRight: '24px' }} />
                <Skeleton width={122} height={46} style={{ marginRight: '24px' }} />
                <Skeleton width={180} height={46} />
              </>
            )}
          </div>
          {dispatchableArea.map((area, index) => (
            <div key={String(index)} className={styles['area-wrapper']}>
              <div className={styles['dropdown-wrapper-front']}>{area.split(' ')[0]}</div>
              <div className={styles['dropdown-wrapper-center']}>{area.split(' ')[1]}</div>
              <div className={styles['dropdown-wrapper-back']}>{area.split(' ')[2]}</div>
              <button type="button" className={styles.button} onClick={handleDelete(index)}>
                삭제
              </button>
            </div>
          ))}
        </div>
        <div
          className={styles['button-wrapper']}
          style={{ marginTop: `${dispatchableArea.length ? '40px' : ''}` }}
        >
          {data && (
            <ButtonComponent
              onClick={handleSubmit}
              text="등록"
              buttonWidth={306}
              buttonHeight={46}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
