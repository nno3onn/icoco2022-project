/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Helmet from 'components/helmet';
import InfoTable from 'components/table/info';
import ButtonComponent from 'components/button';

import titleConfigs from 'configs/title';

import miliToDate from 'utils/format/miliToDate';
import showQuestion from 'utils/question/show';
import updateAnswer from 'utils/question/update';

import styles from './index.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const QuestionListPage = () => {
  const router = useRouter();
  const questionId = router.query.question_id;

  const [data, setData] = useState();
  const [answer, setAnswer] = useState();
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerDate, setAnswerDate] = useState();

  const [questionInfo, setQuestionInfo] = useState([]);
  const [answerInfo, setAnswerInfoA] = useState([]);

  const handleAnswered = () => {
    if (window.confirm('답변을 완료하시겠습니까?')) {
      const date = Date.now();
      setIsAnswered(true);
      setAnswerDate(date);
      updateAnswer({ questionId, answer: true, date });
    }
  };

  useEffect(() => {
    const onSuccess = (info) => {
      setData(info);
      setIsAnswered(info.isAnswered);
      setAnswer(info.answer);
    };
    showQuestion(questionId, onSuccess);
  }, []);

  useEffect(() => {
    if (!data) return;

    setQuestionInfo([
      { k: '산모 이름', v: data.userName || '-' },
      { k: '산모 연락처', v: data.phone || '-' },
      {
        k: '관리사 이름',
        v: data.managerId ? (
          <Link href={`/manager/${data.managerId}`}>
            <a>{data.managerName}</a>
          </Link>
        ) : (
          '-'
        ),
      },
      { k: '작성일자', v: miliToDate(data.date) || '-' },
      {
        k: '답변 여부',
        v: isAnswered ? '답변 완료' : <div className={styles.wait}>답변 대기 중</div>,
      },
    ]);
    setAnswerInfoA([{ k: '답변 작성일자', v: miliToDate(data.answerDate) || '-' }]);
  }, [answer, answerDate, data]);

  return (
    <>
      <Helmet title={titleConfigs.questionShowTitle} />
      <Link href="/question/list">
        <a className={styles.arrow}>
          <img alt="arrow" src="/icons/arrow-left-g.png" style={{ width: 36, height: 36 }} />
        </a>
      </Link>
      <div className={styles.container}>
        <div className={styles.title}>문의 정보</div>
        {data ? (
          <>
            <InfoTable style={{ marginBottom: 24 }} data={questionInfo} />
            <InfoTable
              valueLineHeight={1.5}
              data={[
                {
                  k: '문의 내용',
                  v: data.contents
                    ? data.contents.split('\n').map((l) => (
                        <>
                          {l}
                          <br />
                        </>
                      ))
                    : null,
                },
              ]}
              style={{ marginBottom: 80 }}
            />
          </>
        ) : (
          <>
            <Skeleton width={582} height={236} style={{ marginBottom: 24 }} />
            <Skeleton width={582} height={100} style={{ marginBottom: 80 }} />
          </>
        )}

        {data ? (
          isAnswered ? (
            <>
              <div className={styles.title}>답변 정보</div>
              <InfoTable style={{ marginBottom: 24 }} data={answerInfo} />
            </>
          ) : (
            <div className={styles['button-wrapper']}>
              <ButtonComponent
                text="답변 완료하기"
                buttonWidth={300}
                buttonHeight={46}
                onClick={handleAnswered}
              />
            </div>
          )
        ) : (
          <Skeleton width={582} height={60} style={{ marginBottom: 24 }} />
        )}
      </div>
    </>
  );
};

export default QuestionListPage;
