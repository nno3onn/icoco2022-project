/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import ModalButton from 'components/button/modal';
import Helmet from 'components/helmet';
import Modal from 'components/modal';
import Contents from 'components/contents';

import showItem from 'utils/common/show';
import deleteItem from 'utils/common/delete';
import miliToDate from 'utils/format/miliToDate';

import titleConfigs from 'configs/title';
import pathConfigs from 'configs/path';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const TipPage = () => {
  const router = useRouter();
  const { tipId } = router.query;

  const ref = useRef();

  const [data, setData] = useState();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeletOpen, setIsDeleteOpen] = useState(false);
  const [selectedIndex, setSeletedIndex] = useState(0);

  const handleUpdate = () => {
    router.push(`/tip/${tipId}/update`);
  };

  const handleDelete = () => {
    const tipInfo = {
      id: tipId,
      profileImage: data.profileImage,
      thumbnails: data.thumbnails,
    };

    const onSuccess = () => {
      alert('정상 반영되었습니다.');
      router.push(pathConfigs.tip.default);
    };

    const onError = () => {
      alert('잠시후 시도해주세요.');
    };

    deleteItem({ collectionName: 'Tip', docInfo: tipInfo }, onSuccess, onError);
  };

  const handleNext = () => {
    if (selectedIndex === data.thumbnails.length - 1) {
      alert('마지막 이미지 입니다.');
    } else {
      setSeletedIndex(selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex === 0) {
      alert('첫 번째 이미지 입니다.');
    } else {
      setSeletedIndex(selectedIndex - 1);
    }
  };

  useEffect(() => {
    showItem({ collectionName: 'Tip', docId: tipId }, (info) => setData(info));
  }, []);

  return (
    <>
      {isUpdateOpen && (
        <Modal type="update" opener={setIsUpdateOpen} onClick={handleUpdate} page="tip" />
      )}
      {isDeletOpen && (
        <Modal type="delete" opener={setIsDeleteOpen} onClick={handleDelete} page="tip" />
      )}
      <Helmet title={titleConfigs.tipShowTitle} />
      <Link href="/tip/list">
        <img alt="arrow" src="/icons/arrow-left-black.png" className={styles['back-arrow']} />
      </Link>
      {data ? (
        <div className={styles.container}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles['header-wrapper']}>
            <div className={styles['profile-items']}>
              <div
                className={styles.avatar}
                style={{
                  backgroundImage: `url(${data.profileImage || ''})`,
                  backgroundColor: data.profileImage ? 'transparent' : '#503aa9',
                }}
              />
              <div className={styles.author}>{data.authorId}</div>
              {data.keyword ? <div className={styles.keyword}># {data.keyword}</div> : null}
            </div>
            <div className={styles.date}>{miliToDate(data.date)}</div>
          </div>
          <div className={styles.divided} />
          <div className={styles['thumbnail-wrapper']}>
            {data.thumbnails ? (
              <>
                {selectedIndex > 0 && (
                  <button type="button" className={styles['arrow-l']} onClick={handlePrev}>
                    <img alt="arrow" src="/icons/arrow-left.png" />
                  </button>
                )}
                {selectedIndex < data.thumbnails.length - 1 && (
                  <button type="button" className={styles['arrow-r']} onClick={handleNext}>
                    <img alt="arrow" src="/icons/arrow-right.png" />
                  </button>
                )}
                <div
                  className={styles.thumbnail}
                  style={{
                    backgroundImage: `url(${data.thumbnails[selectedIndex]})`,
                  }}
                />
                <div className={styles['slider-dots']} ref={ref}>
                  {new Array(data.thumbnails ? data.thumbnails.length : 1).fill().map((e, i) => (
                    <div
                      key={String(i)}
                      className={styles[`${i === selectedIndex ? 'active' : null}`]}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
          <Contents contents={data.contents} />
          <div className={styles.divided} />
          <div className={styles['button-wrapper']}>
            <div style={{ marginRight: '36px' }}>
              <ModalButton
                text="수정"
                buttonWidth={170}
                buttonHeight={46}
                onClick={() => setIsUpdateOpen(true)}
              />
            </div>
            <ModalButton
              text="삭제"
              buttonWidth={170}
              buttonHeight={46}
              onClick={() => setIsDeleteOpen(true)}
            />
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.title}>
            <Skeleton width="100%" height={24} />
          </div>
          <div className={styles['header-wrapper']}>
            <div className={styles['profile-items']}>
              <Skeleton
                width={28}
                height={28}
                style={{ borderRadius: '50%', marginRight: '8px' }}
              />
              <Skeleton width={28} height={12} style={{ marginLeft: 8 }} />
              <Skeleton width={85} height={32} style={{ borderRadius: 32, marginLeft: 20 }} />
            </div>
            <Skeleton width={60} height={12} style={{ marginRight: 20 }} />
          </div>
          <div className={styles.divided} />
          <div className={styles.thumbnail}>
            <Skeleton width="100%" height={582} />
          </div>
          <Skeleton width="100%" height={60} />
        </div>
      )}
    </>
  );
};

export default TipPage;
