import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Helmet from 'components/helmet';
import Input from 'components/input';
import Radiobox from 'components/radiobox';
import LoadingButton from 'components/button/loading';
import ThumbnailsList from 'components/imageSelector/list';
import MultiRadiobox from 'components/radiobox/multi';
import TextArea from 'components/textArea';

import createReview from 'utils/manager/createReview';

import titleConfigs from 'configs/title';

import styles from './create.module.scss';

const ReviewCreatePage = () => {
  const router = useRouter();
  const managerId = router.query.manager_id;

  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState();
  const [reviewRate, setReviewRate] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [contents, setContents] = useState();
  const [type, setType] = useState('중간');
  const [specialtyItems, setSpecialtyItems] = useState([]);

  useEffect(() => {
    if (type === '기말') {
      setReviewRate(1);
    } else {
      setReviewRate(null);
    }
  }, [type]);

  const handleSubmit = async () => {
    if (!userName || !type) {
      return alert('모든 항목을 채워주세요.');
    }

    setLoading(true);

    const info = {
      managerId,
      type,
      specialtyItems,
      reviewRate,
      userName,
      contents,
      thumbnails,
    };
    const docId = await createReview(info);

    if (docId) {
      alert('리뷰를 생성하였습니다.');
      router.push(`/manager/${managerId}/review`);
    }
  };

  return (
    <>
      <Helmet title={titleConfigs.managerReveiwCreateTitle} />
      <div className={styles.container}>
        <div className={styles.header}>리뷰 추가</div>
        <div className={styles['content-wrapper']} style={{ marginBottom: 0 }}>
          <div className={styles.label}>종류</div>
          <div className={styles['checkbox-wrapper']}>
            <Radiobox active={type} setter={setType} text="중간" />
            <Radiobox active={type} setter={setType} text="기말" />
          </div>
        </div>
        <div className={styles.border} />
        {type === '기말' ? (
          <div className={styles['content-wrapper']}>
            <div className={styles.label}>별점</div>
            <div className={styles['checkbox-wrapper']}>
              <Radiobox
                text={1}
                active={reviewRate}
                setter={setReviewRate}
                value={
                  <img alt="dashboard" src="/icons/star-full.png" style={{ marginRight: '2px' }} />
                }
              />
              <Radiobox
                text={2}
                active={reviewRate}
                setter={setReviewRate}
                value={new Array(2).fill().map((e, i) => (
                  <img
                    alt="dashboard"
                    src="/icons/star-full.png"
                    style={{ marginRight: '2px' }}
                    key={String(i)}
                  />
                ))}
              />
              <Radiobox
                text={3}
                active={reviewRate}
                setter={setReviewRate}
                value={new Array(3).fill().map((e, i) => (
                  <img
                    alt="dashboard"
                    src="/icons/star-full.png"
                    style={{ marginRight: '2px' }}
                    key={String(i)}
                  />
                ))}
              />
              <Radiobox
                text={4}
                active={reviewRate}
                setter={setReviewRate}
                value={new Array(4).fill().map((e, i) => (
                  <img
                    alt="dashboard"
                    src="/icons/star-full.png"
                    style={{ marginRight: '2px' }}
                    key={String(i)}
                  />
                ))}
              />
              <Radiobox
                text={5}
                active={reviewRate}
                setter={setReviewRate}
                value={new Array(5).fill().map((e, i) => (
                  <img
                    alt="dashboard"
                    src="/icons/star-full.png"
                    style={{ marginRight: '2px' }}
                    key={String(i)}
                  />
                ))}
              />
            </div>
          </div>
        ) : null}
        <div className={styles['content-wrapper']}>
          <div className={styles.label}>이런 부분이 좋았어요! (중복 선택 가능)</div>
          <div className={styles['multi-checkbox-wrapper']}>
            <MultiRadiobox
              limitNumber={4}
              active={specialtyItems}
              text="정리정돈"
              setter={setSpecialtyItems}
              isArray
            />
            <MultiRadiobox
              limitNumber={7}
              active={specialtyItems}
              text="가족배려"
              setter={setSpecialtyItems}
              isArray
            />
            <MultiRadiobox
              limitNumber={7}
              active={specialtyItems}
              text="체형관리"
              setter={setSpecialtyItems}
              isArray
            />
          </div>
          <div className={styles['multi-checkbox-wrapper']}>
            <MultiRadiobox
              limitNumber={7}
              active={specialtyItems}
              text="음식솜씨"
              setter={setSpecialtyItems}
              isArray
            />
            <MultiRadiobox
              limitNumber={7}
              active={specialtyItems}
              text="실전지식"
              setter={setSpecialtyItems}
              isArray
            />
            <MultiRadiobox
              limitNumber={7}
              active={specialtyItems}
              text="산모케어"
              setter={setSpecialtyItems}
              isArray
            />
          </div>
          <div className={styles['multi-checkbox-wrapper']}>
            <MultiRadiobox
              limitNumber={7}
              active={specialtyItems}
              text="신생아케어"
              setter={setSpecialtyItems}
              isArray
            />
          </div>
        </div>
        <div className={styles['content-wrapper']}>
          <div className={styles.label}>산모 이름</div>
          <Input
            placeholder="산모 이름을 입력해주세요"
            value={userName}
            onChange={({ target: { value } }) => setUserName(value)}
            width={250}
          />
        </div>
        <div className={styles['content-wrapper']}>
          <div className={styles.label}>한마디</div>
          <TextArea
            placeholder="관리사님께 한마디를 작성해주세요"
            value={contents}
            height={230}
            onChange={({ target: { value } }) => setContents(value)}
          />
        </div>
        <div className={styles['content-wrapper']} style={{ marginBottom: 0 }}>
          <div className={styles.label}>이미지</div>
          <ThumbnailsList id="thumbnails-create" setter={setThumbnails} thumbnails={thumbnails} />
        </div>
        <div className={styles.border} />
        <div className={styles['button-wrapper']}>
          <LoadingButton
            loading={loading}
            text="리뷰 추가하기"
            onClick={handleSubmit}
            buttonWidth={320}
            buttonHeight={46}
          />
        </div>
      </div>
    </>
  );
};

export default ReviewCreatePage;
