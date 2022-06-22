/* eslint-disable no-lonely-if */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import ButtonComponent from 'components/button';
import Input from 'components/input';

import styles from 'components/modal/manager.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const ManagerModal = ({
  opener,
  list,
  data,
  reservationNumber,
  names,
  setter,
  setterName,
  changeManagerList = null,
}) => {
  // list: 전체 데이터
  // data: 선택된 데이터
  // _data: 검색된 데이터

  if (!list) return;

  const [_data, _setData] = useState();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableManagers, setAvailableManagers] = useState([]);
  const [disAvailableManagers, setDisAvailableManagers] = useState([]);

  const handleUpdate =
    ({ managerId, managerName }) =>
    () => {
      const idx = data.indexOf(managerId);

      if (idx === -1) {
        setter([...data, managerId]);
        setterName([...names, managerName]);
      } else {
        const managers = data.filter((m) => m !== managerId);
        const managerNames = names.filter((m) => m !== managerName);
        setter([...managers]);
        setterName([...managerNames]);
      }
    };

  const handleSearch = () => {
    const _filter = list.filter((l) => l.name.indexOf(keyword) !== -1);
    _setData(_filter);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const handleSubmit = () => {
    if (data && data.length) {
      opener(false);
    } else {
      alert('관리사를 1명 이상 선택해주세요.');
    }
  };

  useEffect(() => {
    if (!list) return;

    setLoading(true);

    if (_data) {
      const available = _data.filter(
        (el) =>
          changeManagerList.indexOf(el.uid) !== -1 ||
          el.status === '대기' ||
          el.reservationNumber === reservationNumber,
      );

      const disavailable = _data
        .filter((el) => !available.includes(el))
        .sort((x, y) => (_data.includes(x.id) ? -1 : 0));

      setDisAvailableManagers([...disavailable]);
      setAvailableManagers([...available]);
    } else {
      if (list) {
        const available = list.filter(
          (el) =>
            changeManagerList.indexOf(el.uid) !== -1 ||
            el.status === '대기' ||
            el.reservationNumber === reservationNumber,
        );

        const disavailable = list
          .filter((el) => !available.includes(el))
          .sort((x, y) => (data.includes(x.id) ? -1 : 0));

        setDisAvailableManagers([...disavailable]);
        setAvailableManagers([...available]);
      } else {
        setDisAvailableManagers([]);
        setAvailableManagers([]);
      }
    }

    setLoading(false);
  }, [_data]);

  return (
    <div className={styles['modal-wrapper']}>
      <div className={styles['modal-content-wrapper']}>
        <div className={styles['modal-header-wrapper']}>
          <div className={styles['modal-header']}>
            <div className={styles.heading}>관리사 선택</div>
            <div className={styles['input-wrapper']}>
              <Input
                placeholder="관리사 이름으로 검색 가능합니다."
                value={keyword}
                onChange={({ target: { value } }) => setKeyword(value)}
                onKeyDown={handleKeyDown}
              />
              <img alt="search" src="/icons/search.png" />
            </div>
          </div>
          <button type="button" onClick={() => opener(false)} className={styles.cancel}>
            <img alt="cancel" src="/icons/cancel.png" className={styles.icon} />
          </button>
        </div>
        <div className={styles.divided} />
        <div className={styles['modal-list-contents']}>
          <div className={styles['list-header-label']}>
            <div className={styles.label84}>관리사명</div>
            <div className={styles.label280}>파견상태</div>
            <div className={styles.label492}>파견 가능 지역</div>
            <div className={styles.label136}>연락처</div>
          </div>
          {!loading ? (
            <div
              className={styles['list-contents-wrapper']}
              style={data && data.length ? { maxHeight: '360px' } : null}
            >
              {availableManagers && availableManagers.length ? (
                <>
                  {availableManagers.map((manager, i) => (
                    <button
                      type="button"
                      key={String(i)}
                      className={
                        styles[
                          `${
                            data.includes(manager.id) ? 'active-manager-wrapper' : 'manager-wrapper'
                          }`
                        ]
                      }
                      onClick={handleUpdate({
                        managerId: manager.id,
                        managerName: manager.name,
                      })}
                    >
                      <img
                        alt="thumbnail"
                        className={styles['manager-thumbnail']}
                        src={manager.profileImage || '/icons/manager.png'}
                      />
                      <div className={styles.label84}>{manager.name}</div>
                      <div className={styles.label280}>{manager.status}</div>
                      <div className={styles.label492}>
                        {manager.dispatchableArea ? manager.dispatchableArea.join(', ') : null}
                      </div>
                      <div className={styles.label136}>{manager.phone}</div>
                    </button>
                  ))}
                </>
              ) : null}
              {disAvailableManagers && disAvailableManagers.length ? (
                <>
                  {disAvailableManagers.map((manager, i) => (
                    <div key={String(i)} className={styles['disabled-manager-wrapper']}>
                      <img
                        alt="thumbnail"
                        className={styles['manager-thumbnail']}
                        src={manager.profileImage || '/icons/manager.png'}
                      />
                      <div className={styles.label84}>{manager.name}</div>
                      <div className={styles.label280}>{manager.status}</div>
                      <div className={styles.label492}>
                        {manager.dispatchableArea ? manager.dispatchableArea.join(', ') : null}
                      </div>
                      <div className={styles.label136}>{manager.phone}</div>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          ) : (
            <div
              className={styles['list-contents-wrapper']}
              style={availableManagers && { maxHeight: '360px' }}
            >
              <div className={styles['manager-wrapper-loading']}>
                <Skeleton width={1104} height={80} count={6} />
              </div>
            </div>
          )}
        </div>
        {data && data.length ? (
          <div className={styles['modal-active-footer']}>
            <div className={styles['active-managers']}>
              {data.map((manager, index) => {
                if (availableManagers && availableManagers) {
                  const obj = availableManagers.find((m) => manager === m.id);
                  if (obj) {
                    return (
                      <div className={styles.manager} key={String(index)}>
                        <img
                          alt="thumbnail"
                          className={styles.thumbnail}
                          src={obj.thumbnail ? obj.thumbnail : '/icons/manager.png'}
                        />
                        <div className={styles.label}>{obj.managerName}</div>
                      </div>
                    );
                  }
                }
                return null;
              })}
            </div>
            <div className={styles.label}>{`총 ${data.length}명 선택됨`}</div>
          </div>
        ) : null}
        <div className={styles['modal-footer']}>
          <div className={styles['button-wrapper']}>
            <ButtonComponent width={180} onClick={handleSubmit} text="선택완료" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerModal;
