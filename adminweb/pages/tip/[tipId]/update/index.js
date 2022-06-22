import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import Skeleton from 'react-loading-skeleton';

import Helmet from 'components/helmet';
import ThumbnailSelector from 'components/imageSelector';
import Input from 'components/input';
import ThumbnailsList from 'components/imageSelector/list';
import LoadingButton from 'components/button/loading';
import TextArea from 'components/input/textarea';
import CheckBox from 'components/checkbox';

import showItem from 'utils/common/show';
import updateTip from 'utils/tip/update';

import errorConfigs from 'configs/error';
import titleConfigs from 'configs/title';
import eventType from 'configs/data';

import styles from 'pages/tip/create/index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import verifyFileSize from 'utils/input/verifyFileSize';

const TipUpdatePage = () => {
  const router = useRouter();
  const { tipId } = router.query;

  const [loading, setLoading] = useState(true);

  const [beforeImages, setBeforeImages] = useState();
  const [profileImage, setProfileImage] = useState();
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [contents, setContents] = useState('');
  const [keyword, setKeyword] = useState('도우미정보');

  const handleSubmit = async () => {
    if (!title || !profileImage || !authorId || !thumbnails.length || !contents) {
      return alert(errorConfigs.emptyValues.msg);
    }
    if (window.confirm('수정 하시겠습니까?')) {
      setLoading(true);

      const tipInfo = {
        title,
        tipId,
        profileImage,
        authorId,
        thumbnails,
        contents,
        beforeImages,
        keyword,
      };

      await updateTip(tipInfo);

      alert('정상 반영되었습니다.');
      router.push(`/tip/${tipId}`);
    }
  };

  useEffect(() => {
    const onSuccess = async (info) => {
      setLoading(false);

      setTitle(info.title);
      setKeyword(info.keyword);
      setAuthorId(info.authorId);
      setBeforeImages({
        profileImage: info.profileImage || null,
        thumbnails: info.thumbnails ? [...info.thumbnails] : [],
      });
      setProfileImage(info.profileImage || []);
      setThumbnails(info.thumbnails || []);
      setContents(info.contents);
    };

    showItem({ collectionName: 'Tip', docId: tipId }, onSuccess);
  }, []);

  const handleProfileImage = (file) => {
    if (verifyFileSize(file)) {
      setProfileImage(file);
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.tipEditTitle} />
      <div className={styles.container}>
        <div className={styles.header}>육아팁 수정</div>
        {!loading ? (
          <>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>제목</div>
              <div style={{ width: 400 }}>
                <Input
                  value={title}
                  onChange={({ target: { value } }) => setTitle(value)}
                  placeholder="제목을 입력해주세요"
                />
              </div>
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>키워드</div>
              <div className={styles['checkbox-wrapper']} styles={{ marginBottom: 10 }}>
                {eventType.eventType1.map((k) => (
                  <div key={String(v4())} className={styles.checkbox}>
                    <CheckBox text={k} isChecked={k === keyword} onClick={() => setKeyword(k)} />
                  </div>
                ))}
              </div>
              <div className={styles['checkbox-wrapper']}>
                {eventType.eventType2.map((k) => (
                  <div key={String(v4())} className={styles.checkbox}>
                    <CheckBox text={k} isChecked={k === keyword} onClick={() => setKeyword(k)} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>프로필</div>
              <ThumbnailSelector file={profileImage} isAvatar setter={handleProfileImage} />
            </div>
            <div className={styles['contents-wrapper']} style={{ width: 273 }}>
              <div className={styles.label}>게시자 이름</div>
              <Input
                value={authorId}
                onChange={({ target: { value } }) => setAuthorId(value)}
                placeholder="이름을 입력해주세요"
              />
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>이미지</div>
              <ThumbnailsList
                id="thumbnails-update"
                setter={setThumbnails}
                thumbnails={thumbnails}
              />
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>내용</div>
              <TextArea
                onChange={({ target: { value } }) => setContents(value)}
                value={contents}
                placeholder="육아팁을 입력해주세요"
                height={300}
              />
            </div>
            <div className={styles['button-wrapper']}>
              <LoadingButton
                onClick={handleSubmit}
                text="육아팁 수정"
                buttonWidth={320}
                buttonHeight={46}
                loading={loading}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>제목</div>
              <Skeleton width={400} height={46} />
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>키워드</div>
              <Skeleton width={500} height={70} />
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>프로필</div>
              <Skeleton width={170} height={170} style={{ borderRadius: '50%' }} />
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>게시자 이름</div>
              <Skeleton width={273} height={46} />
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>이미지</div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: '48px',
                }}
              >
                <div style={{ width: 933, display: 'flex', flexDirection: 'row' }}>
                  <Skeleton width={273} height={273} style={{ marginRight: '36px' }} />
                  <Skeleton width={273} height={273} />
                </div>
              </div>
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>내용</div>
              <Skeleton width="100%" height={160} />
            </div>
            <div className={styles['contents-wrapper']}>
              <div className={styles.label}>태그</div>
              <Skeleton width="100%" height={46} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TipUpdatePage;
