import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';

import Helmet from 'components/helmet';
import ThumbnailSelector from 'components/imageSelector';
import Input from 'components/input';
import ThumbnailsList from 'components/imageSelector/list';
import LoadingButton from 'components/button/loading';
import CheckBox from 'components/checkbox';
import TextArea from 'components/input/textarea';

import createTip from 'utils/tip/create';
import verifyFileSize from 'utils/input/verifyFileSize';

import errorConfigs from 'configs/error';
import titleConfigs from 'configs/title';
import eventType from 'configs/data';

import styles from './index.module.scss';

const TipCreatePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    const tipInfo = {
      title,
      authorId,
      profileImage,
      thumbnails,
      contents,
      keyword,
    };

    const tipId = await createTip(tipInfo);

    alert('정상 반영되었습니다.');
    router.push(`/tip/${tipId}`);
  };

  const handleProfileImage = (file) => {
    if (verifyFileSize(file)) {
      setProfileImage(file);
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.tipCreateTitle} />
      <div className={styles.container}>
        <div className={styles.header}>육아팁 추가</div>
        <div className={styles['contents-wrapper']}>
          <div className={styles.label}>제목</div>
          <Input
            value={title}
            onChange={({ target: { value } }) => setTitle(value)}
            placeholder="제목을 입력해주세요"
          />
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
          <ThumbnailsList id="thumbnails-create" setter={setThumbnails} thumbnails={thumbnails} />
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
            text="육아팁 추가"
            buttonWidth={320}
            buttonHeight={46}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default TipCreatePage;
