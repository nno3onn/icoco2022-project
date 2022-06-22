import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Input from 'components/input';
import Helmet from 'components/helmet';

import createNotice from 'utils/notice/create';

import errorConfigs from 'configs/error';
import titleConfigs from 'configs/title';

import TextArea from 'components/input/textarea';
import ThumbnailSelector from 'components/imageSelector';
import LoadingButton from 'components/button/loading';
import verifyFileSize from 'utils/input/verifyFileSize';

import styles from './index.module.scss';

const NoticeCreatePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [contents, setContents] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const handleSubmit = async () => {
    if (!title || !subtitle || !contents) {
      return alert(errorConfigs.emptyValue.msg);
    }

    setLoading(true);

    const noticeInfo = {
      title,
      subtitle,
      contents,
      thumbnail,
    };

    const noticeId = await createNotice(noticeInfo);

    alert('정상 반영되었습니다.');
    router.push(`/notice/${noticeId}`);
  };

  const handleThumbnail = (file) => {
    if (verifyFileSize(file)) {
      setThumbnail(file);
    } else {
      return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.noticeCreateTitle} />
      <div className={styles.container}>
        <div className={styles.header}>공지사항 추가</div>
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
            onChange={({ target: { value } }) => setContents(value)}
            value={contents}
            placeholder="내용을 입력해주세요"
            height={278}
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
            text="공지사항 추가"
            buttonWidth={376}
            buttonHeight={46}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default NoticeCreatePage;
