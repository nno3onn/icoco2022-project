/* eslint-disable operator-linebreak */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import LoadingButton from 'components/button/loading';
import Helmet from 'components/helmet';
import Input from 'components/input';
import ThumbnailSelector from 'components/imageSelector';
import verifyDate from 'utils/input/verifyDate';
import CheckBox from 'components/checkbox';

import showItem from 'utils/common/show';
import updateEvent from 'utils/event/update';

import errorConfigs from 'configs/error';
import titleConfigs from 'configs/title';

import styles from 'pages/event/create/index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import TextArea from 'components/input/textarea';
import verifyFileSize from 'utils/input/verifyFileSize';

const EventUpdatePage = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const [loading, setLoading] = useState(true);

  const [beforeFiles, setBeforeFiles] = useState({});
  const [webViewUrl, setWebViewUrl] = useState();
  const [moveTo, setMoveTo] = useState();
  const [images, setImages] = useState();

  const [isTypeEvent, setIsTypeEvent] = useState(true);
  const [author, setAuthor] = useState();
  const [title, setTitle] = useState();
  const [contents, setContents] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleSubmit = async () => {
    if (
      !images.appBanner ||
      !images.thumbnail ||
      !title ||
      (isTypeEvent && (!startDate || !endDate)) ||
      moveTo
        ? !images.detailThumbnail
        : !webViewUrl
    ) {
      return alert(errorConfigs.emptyValues.msg);
    }

    if (window.confirm('이벤트를 수정하시겠습니까?')) {
      if (isTypeEvent && !verifyDate(startDate)) {
        return alert('이벤트 시작일은 202x.xx.xx으로 작성해주세요');
      }
      if (isTypeEvent && !verifyDate(endDate)) {
        return alert('이벤트 종료일은 202x.xx.xx으로 작성해주세요');
      }
      setLoading(true);

      const eventInfo = {
        id: eventId,
        beforeFiles,
        isTypeEvent,
        author,
        title,
        contents,
        startDate,
        endDate,
      };

      if (images) {
        if (images.appBanner) {
          eventInfo.appBanner = images.appBanner;
        }
        if (images.thumbnail) eventInfo.thumbnail = images.thumbnail;
        if (moveTo && images.detailThumbnail) {
          eventInfo.detailThumbnail = images.detailThumbnail;
        }
      }
      eventInfo.moveTo = moveTo;
      if (!moveTo && webViewUrl) {
        eventInfo.webViewUrl = webViewUrl;
      }

      const onSuccess = () => {
        alert('정상 반영되었습니다.');
        router.push(`/event/${eventId}`);
      };

      updateEvent(eventInfo, onSuccess);
    }
  };

  const onChangeAppBanner = (file) => {
    if (verifyFileSize(file)) {
      setImages({
        ...images,
        appBanner: file,
      });
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  const onChangeThumbnail = (file) => {
    if (verifyFileSize(file)) {
      setImages({
        ...images,
        thumbnail: file,
      });
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  const onChangeDetail = (file) => {
    if (verifyFileSize(file)) {
      setImages({
        ...images,
        detailThumbnail: file,
      });
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  useEffect(() => {
    const onSuccess = async (event) => {
      setBeforeFiles({
        appBanner: event.appBanner,
        thumbnail: event.thumbnail,
        detailThumbnail: event.detailThumbnail,
      });

      setMoveTo(event.moveTo);
      setWebViewUrl(event.webViewUrl);
      setImages({
        appBanner: event.appBanner,
        thumbnail: event.thumbnail,
        detailThumbnail: event.detailThumbnail,
      });
      setIsTypeEvent(event.status !== 'announced');
      setAuthor(event.author);
      setTitle(event.title);
      setContents(event.contents);
      setStartDate(event.startDate);
      setEndDate(event.endDate);

      setLoading(false);
    };

    showItem({ collectionName: 'Event', docId: eventId }, onSuccess);
  }, []);

  return (
    <>
      <Helmet title={titleConfigs.eventEditTitle} />
      <div className={styles['event-wrapper']}>
        <div className={styles['text-title']}>이벤트 수정</div>
        {!loading ? (
          <>
            <div className={styles['text-label']}>종류</div>
            <div className={styles['checkbox-wrapper']}>
              <div className={styles.checkbox}>
                <CheckBox
                  text="이벤트"
                  onClick={() => setIsTypeEvent(!isTypeEvent)}
                  isChecked={isTypeEvent}
                />
              </div>
              <div className={styles.checkbox}>
                <CheckBox
                  text="당첨자 발표"
                  onClick={() => {
                    setIsTypeEvent(!isTypeEvent);
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  isChecked={!isTypeEvent}
                />
              </div>
            </div>
            <div className={styles['selector-wrapper']}>
              <Input
                label="게시자 이름"
                placeholder="게시자 이름을 입력해주세요."
                value={author || null}
                onChange={({ target: { value } }) => setAuthor(value)}
              />
            </div>
            <div className={styles['selector-wrapper']}>
              <Input
                label="제목"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={({ target: { value } }) => setTitle(value)}
              />
            </div>
            <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
              <div className={styles['text-label']}>내용</div>
              <TextArea
                value={contents}
                placeholder="내용을 입력해주세요."
                onChange={({ target: { value } }) => setContents(value)}
                height={200}
              />
            </div>
            {isTypeEvent ? (
              <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
                <div className={styles['text-label']} style={{ marginTop: 36 }}>
                  이벤트 기간
                </div>
                <div className={styles['text-label-sub']}>이벤트 시작일</div>
                <Input
                  placeholder="예:) 20xx.xx.xx"
                  value={startDate || null}
                  onChange={({ target: { value } }) => setStartDate(value)}
                />
                <div className={styles['text-label-sub']} style={{ marginTop: 24 }}>
                  이벤트 종료일
                </div>
                <Input
                  placeholder="예:) 20xx.xx.xx"
                  value={endDate || null}
                  onChange={({ target: { value } }) => setEndDate(value)}
                />
              </div>
            ) : null}
            <div className={styles.border} />
            <div className={styles['selector-wrapper']}>
              <div className={styles['text-label']}>
                앱 상단 배너
                <span>* 375x188p</span>
              </div>
              <ThumbnailSelector
                name="appBanner"
                setter={onChangeAppBanner}
                isAvatar={false}
                width={375}
                height={188}
                file={images.appBanner || null}
              />
            </div>
            <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
              <div className={styles['text-label']}>
                이벤트 썸네일
                <span>* 375x188p</span>
              </div>
              <ThumbnailSelector
                name="thumbnail"
                setter={onChangeThumbnail}
                isAvatar={false}
                width={375}
                height={188}
                file={images.thumbnail || null}
              />
            </div>
            <div className={styles.border} />
            <div className={styles['checkbox-wrapper']}>
              <div className={styles.checkbox}>
                <CheckBox
                  text="상세로 이동"
                  onClick={() => setMoveTo(!moveTo)}
                  isChecked={moveTo}
                />
              </div>
              <div className={styles.checkbox}>
                <CheckBox
                  text="웹뷰로 이동"
                  onClick={() => setMoveTo(!moveTo)}
                  isChecked={!moveTo}
                />
              </div>
            </div>
            <div className={styles['selector-wrapper']}>
              {moveTo ? (
                <>
                  <div className={styles['text-label']}>
                    이벤트 상세
                    <span>* 375x188p</span>
                  </div>
                  <ThumbnailSelector
                    name="detailThumbnail"
                    setter={onChangeDetail}
                    isAvatar={false}
                    width={375}
                    height={188}
                    file={images.detailThumbnail || null}
                  />
                </>
              ) : (
                <Input
                  label="웹뷰 URL"
                  placeholder="예:) https://icoco.co"
                  value={webViewUrl || null}
                  onChange={({ target: { value } }) => setWebViewUrl(value)}
                />
              )}
            </div>
            <div className={styles['button-wrapper']}>
              <LoadingButton
                onClick={handleSubmit}
                text="이벤트 수정"
                buttonWidth={376}
                loading={loading}
                buttonHeight={46}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles['text-label']}>종류</div>
            <div className={styles['checkbox-wrapper']}>
              <div className={styles.checkbox}>
                <CheckBox
                  text="이벤트"
                  onClick={() => setIsTypeEvent(!isTypeEvent)}
                  isChecked={isTypeEvent}
                />
              </div>
              <div className={styles.checkbox}>
                <CheckBox
                  text="당첨자 발표"
                  onClick={() => {
                    setIsTypeEvent(!isTypeEvent);
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  isChecked={!isTypeEvent}
                />
              </div>
            </div>
            <div className={styles['selector-wrapper']}>
              <div className={styles['text-label']}>게시자 이름</div>
              <Skeleton width={376} height={46} />
            </div>
            <div className={styles['selector-wrapper']}>
              <div className={styles['text-label']}>제목</div>
              <Skeleton width={376} height={46} />
            </div>
            <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
              <div className={styles['text-label']}>내용</div>
              <Skeleton width={376} height={46} />
            </div>
            <div className={styles.border} />
            <div className={styles['selector-wrapper']}>
              <div className={styles['text-label']}>
                앱 상단 배너
                <span>* 1125x456px 이상</span>
              </div>
              <Skeleton width={376} height={162} />
            </div>
            <div className={styles['selector-wrapper']} style={{ marginBottom: 0 }}>
              <div className={styles['text-label']}>
                이벤트 썸네일
                <span>* 1125x456px 이상</span>
              </div>
              <Skeleton width={376} height={210} />
            </div>
            <div className={styles.border} />
            <div className={styles['checkbox-wrapper']}>
              <Skeleton width={95} height={30} style={{ marginRight: 32 }} />
              <Skeleton width={95} height={30} />
            </div>
            <div className={styles['selector-wrapper']}>
              <Skeleton width={376} height={275} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EventUpdatePage;
