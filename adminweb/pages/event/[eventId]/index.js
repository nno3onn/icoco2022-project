import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';

import ModalButton from 'components/button/modal';
import Helmet from 'components/helmet';
import Modal from 'components/modal';
import CheckBox from 'components/checkbox';
import Contents from 'components/contents';

import titleConfigs from 'configs/title';
import showItem from 'utils/common/show';
import deleteItem from 'utils/common/delete';

import pathConfigs from 'configs/path';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const EventPage = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const [data, setData] = useState();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeletOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const onSuccess = async (event) => {
      if (!event) {
        alert('해당 이벤트가 존재하지 않습니다.');
        return router.back();
      }
      setData(event);
    };
    showItem({ collectionName: 'Event', docId: eventId }, onSuccess);
  }, []);

  const handleUpdate = () => {
    router.push(`/event/${eventId}/update`);
  };

  const handleDelete = () => {
    const onSuccess = () => {
      alert('정상 반영되었습니다.');
      router.push(pathConfigs.event.default);
    };

    const eventInfo = { id: eventId, ...data };

    deleteItem({ collectionName: 'Event', docInfo: eventInfo }, onSuccess);
  };

  return (
    <>
      {isUpdateOpen && (
        <Modal type="update" opener={setIsUpdateOpen} onClick={handleUpdate} page="event" />
      )}
      {isDeletOpen && (
        <Modal type="delete" opener={setIsDeleteOpen} onClick={handleDelete} page="event" />
      )}
      <Helmet title={titleConfigs.eventShowTitle} />
      <Link href="/event/list">
        <a>
          <img alt="arrow" src="/icons/arrow-left-black.png" className={styles.arrow} />
        </a>
      </Link>
      <div className={styles['event-wrapper']}>
        <div className={styles['text-title']}>이벤트 상세</div>
        <div className={styles['text-label']}>타입</div>
        <div className={styles['selector-wrapper']}>
          <div className={styles['checkbox-wrapper']}>
            {data ? (
              <>
                <CheckBox text="이벤트" isChecked={data.status !== 'announced'} isShow />
                <CheckBox text="당첨자 발표" isChecked={data.status === 'announced'} isShow />
              </>
            ) : (
              <>
                <Skeleton width={95} height={30} style={{ marginRight: 32 }} />
                <Skeleton width={95} height={30} />
              </>
            )}
          </div>
        </div>

        <div className={styles['selector-wrapper']}>
          <div className={styles['text-label']}>게시자 이름</div>
          {data ? (
            <div className={styles['text-input']} style={{ paddingTop: 12, paddingBottom: 12 }}>
              <Contents contents={data.author || null} />
            </div>
          ) : (
            <Skeleton width={376} height={46} />
          )}
        </div>
        <div className={styles['selector-wrapper']}>
          <div className={styles['text-label']}>제목</div>
          {data ? (
            <div className={styles['text-input']} style={{ paddingTop: 12, paddingBottom: 12 }}>
              <Contents contents={data.title || null} />
            </div>
          ) : (
            <Skeleton width={376} height={46} />
          )}
        </div>
        <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
          <div className={styles['text-label']}>내용</div>
          {data ? (
            <div className={styles['text-input']} style={{ paddingTop: 12, paddingBottom: 12 }}>
              <Contents contents={data.contents || null} />
            </div>
          ) : (
            <Skeleton width={376} height={46} />
          )}
        </div>
        {data && data.status !== 'announced' ? (
          <div className={styles['selector-wrapper']} style={{ marginTop: 36, marginBottom: 0 }}>
            <div className={styles['text-label']}>이벤트 기간</div>
            <div className={styles['text-label-sub']}>이벤트 시작일</div>
            <div className={styles['text-input']}>{data.startDate ? data.startDate : null}</div>
            <div className={styles['text-label-sub']} style={{ marginTop: 24 }}>
              이벤트 종료일
            </div>
            <div className={styles['text-input']}>{data.endDate ? data.endDate : null}</div>
          </div>
        ) : null}
        <div className={styles.border} />
        <div className={styles['selector-wrapper']}>
          <div className={styles['text-label']}>앱 상단 배너</div>
          {data ? (
            <div
              className={styles['thumbnail-wrapper']}
              style={{
                backgroundImage: `url(${data.appBanner})`,
                width: 375,
                height: 188,
              }}
            />
          ) : (
            <Skeleton width={376} height={152} />
          )}
        </div>
        <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
          <div className={styles['text-label']}>이벤트 썸네일</div>
          {data ? (
            <div
              className={styles['thumbnail-wrapper']}
              style={{
                backgroundImage: `url(${data.thumbnail})`,
                width: 375,
                height: 188,
              }}
            />
          ) : (
            <Skeleton width={376} height={210} />
          )}
        </div>
        <div className={styles.border} />
        <div className={styles['selector-wrapper']}>
          <div className={styles['checkbox-wrapper']}>
            {data ? (
              <>
                <div className={styles['checkbox-wrapper']}>
                  <CheckBox text="상세로 이동" isChecked={data.moveTo} isShow />
                </div>
                <div className={styles['checkbox-wrapper']}>
                  <CheckBox text="웹뷰로 이동" isChecked={!data.moveTo} isShow />
                </div>
              </>
            ) : (
              <>
                <Skeleton width={95} height={30} style={{ marginRight: 32 }} />
                <Skeleton width={95} height={30} />
              </>
            )}
          </div>
        </div>

        <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
          {data ? (
            data.moveTo ? (
              <>
                <div className={styles['text-label']}>이벤트 상세</div>
                <div
                  className={styles['thumbnail-wrapper']}
                  style={{
                    backgroundImage: `url(${data.detailThumbnail})`,
                    width: 375,
                    height: 188,
                  }}
                />
              </>
            ) : (
              <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
                <div className={styles['text-label']}>웹뷰 URL</div>
                <div className={styles['text-input']} style={{ color: '#503aa9' }}>
                  <button type="button" onClick={() => window.open(data.webViewUrl)}>
                    {data.webViewUrl || null}
                  </button>
                </div>
              </div>
            )
          ) : (
            <Skeleton width={376} height={46} />
          )}
        </div>
        <div className={styles.border} />
        <div className={styles['button-wrapper']}>
          <div className={styles.button}>
            <ModalButton
              isPrimary={false}
              buttonHeight={46}
              buttonWidth={170}
              text="수정"
              onClick={() => setIsUpdateOpen(true)}
            />
          </div>
          <div className={styles.button}>
            <ModalButton
              isPrimary={false}
              buttonHeight={46}
              buttonWidth={170}
              text="삭제"
              onClick={() => setIsDeleteOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventPage;
