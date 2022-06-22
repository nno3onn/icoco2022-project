import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import Modal from 'components/modal';
import Contents from 'components/contents';
import ModalButton from 'components/button/modal';

import showItem from 'utils/common/show';
import deleteItem from 'utils/common/delete';
import miliToDate from 'utils/format/miliToDate';

import titleConfigs from 'configs/title';
import pathConfigs from 'configs/path';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const NoticePage = () => {
  const router = useRouter();

  const { noticeId } = router.query;

  const [data, setData] = useState();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeletOpen, setIsDeleteOpen] = useState(false);

  const handleUpdate = () => {
    router.push(`/notice/${noticeId}/update`);
  };

  const handleDelete = () => {
    const onSuccess = () => {
      alert('정상 반영되었습니다.');
      router.push(pathConfigs.notice.default);
    };
    const onError = () => {
      alert('잠시후 시도해주세요.');
    };

    deleteItem(
      {
        collectionName: 'Notice',
        docInfo: {
          id: noticeId,
        },
      },
      onSuccess,
      onError,
    );
  };

  useEffect(() => {
    showItem({ collectionName: 'Notice', docId: noticeId }, (info) => setData(info));
  }, []);

  return (
    <>
      {isUpdateOpen && (
        <Modal type="update" opener={setIsUpdateOpen} onClick={handleUpdate} page="notice" />
      )}
      {isDeletOpen && (
        <Modal type="delete" opener={setIsDeleteOpen} onClick={handleDelete} page="notice" />
      )}
      <Helmet title={titleConfigs.noticeShowTitle} />
      <Link href="/notice/list">
        <img alt="arrow" src="/icons/arrow-left-black.png" className={styles.arrow} />
      </Link>
      <div className={styles.container}>
        <div className={styles['notice-wrapper']}>
          {data ? (
            <div className={styles['notice-wrapper']}>
              <div className={styles.title}>{data.title}</div>
              <div className={styles.subtitle}>{data.subtitle}</div>
              <div className={styles.date}>{miliToDate(data.date)}</div>
              <div className={styles.divided} />
              {data.thumbnail ? (
                <div className={styles['thumbnail-wrapper']}>
                  <div
                    className={styles.thumbnail}
                    style={{ backgroundImage: `url(${data.thumbnail})` }}
                  />
                </div>
              ) : null}
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
            <div className={styles['notice-wrapper']}>
              <div className={styles.title}>
                <Skeleton width={582} height={24} />
              </div>
              <div className={styles.subtitle}>
                <Skeleton width={582} height={24} />
              </div>
              <div className={styles.date}>
                <Skeleton width={77} height={14} />
              </div>
              <div className={styles.divided} />
              <Skeleton width={582} height={500} />
              <div className={styles.divided} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NoticePage;
