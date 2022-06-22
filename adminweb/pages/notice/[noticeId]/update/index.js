import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import Input from 'components/input';
import Helmet from 'components/helmet';
import TextArea from 'components/input/textarea';
import ThumbnailSelector from 'components/imageSelector';
import LoadingButton from 'components/button/loading';

import updateNotice from 'utils/notice/update';
import showItem from 'utils/common/show';
import verifyFileSize from 'utils/input/verifyFileSize';

import errorConfigs from 'configs/error';
import titleConfigs from 'configs/title';

import styles from 'pages/notice/create/index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const NoticeUpdatePage = () => {
  const router = useRouter();
  const { noticeId } = router.query;

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState();
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState();
  const [contents, setContents] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [beforeThumbnail, setBeforeThumbnail] = useState('');

  const handleSubmit = async () => {
    if (!title || !subtitle || !contents) {
      return alert(errorConfigs.emptyValues.msg);
    }

    if (window.confirm('수정하시겠습니까?')) {
      setLoading(true);

      const noticeInfo = {
        id: noticeId,
        title,
        subtitle,
        contents,
        thumbnail,
        beforeThumbnail,
      };

      await updateNotice(noticeInfo);

      alert('정상 반영되었습니다.');
      router.push(`/notice/${noticeId}`);
    }
  };

  useEffect(() => {
    const onSuccess = (info) => {
      setData(true);
      setTitle(info.title);
      setSubtitle(info.subtitle);
      setContents(info.contents);
      setThumbnail(info.thumbnail);
      setBeforeThumbnail(info.thumbnail);
    };

    const onError = () => {
      alert('정보를 불러오는 중 실패하였습니다.\n새로고침 해주세요.');
    };

    showItem({ collectionName: 'Notice', docId: noticeId }, onSuccess, onError);
  }, []);

  const handleThumbnail = (file) => {
    if (verifyFileSize(file)) {
      setThumbnail(file);
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.NoticeUpdatePage} />
      <div className={styles.container}>
        <div className={styles.header}>공지사항 수정</div>
        <div className={styles['notice-wrapper']}>
          {data ? (
            <>
              <div className={styles['input-wrapper']}>
                <Input
                  label="제목"
                  inputType="text"
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={({ target: { value } }) => setTitle(value)}
                />
              </div>
              <div className={styles['input-wrapper']}>
                <Input
                  label="부제목"
                  inputType="text"
                  placeholder="부제목을 입력해주세요"
                  value={subtitle}
                  onChange={({ target: { value } }) => setSubtitle(value)}
                />
              </div>
              <div className={styles['input-wrapper']}>
                <div className={styles.label}>내용</div>
                <TextArea
                  placeholder="내용을 입력해주세요"
                  value={contents}
                  height={275}
                  onChange={({ target: { value } }) => setContents(value)}
                />
              </div>
              <div className={styles['input-wrapper']} style={{ marginBottom: '48px' }}>
                <div className={styles.label}>
                  사진
                  <span>* 375x375p</span>
                </div>
                <ThumbnailSelector
                  setter={handleThumbnail}
                  isAvatar={false}
                  width={375}
                  height={375}
                  file={thumbnail}
                />
              </div>
              <div className={styles['button-wrapper']}>
                <LoadingButton
                  onClick={handleSubmit}
                  text="저장"
                  buttonWidth={376}
                  buttonHeight={46}
                  loading={loading}
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles['input-wrapper']}>
                <div className={styles.label}>제목</div>
                <Skeleton width="100%" height={46} />
              </div>
              <div className={styles['input-wrapper']}>
                <div className={styles.label}>부제목</div>
                <Skeleton width="100%" height={46} />
              </div>
              <div className={styles['input-wrapper']}>
                <div className={styles.label}>내용</div>
                <Skeleton width="100%" height={275} />
              </div>
              <div className={styles['input-wrapper']} style={{ marginBottom: '48px' }}>
                <div className={styles.label}>사진</div>
                <Skeleton width="100%" height={275} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NoticeUpdatePage;
