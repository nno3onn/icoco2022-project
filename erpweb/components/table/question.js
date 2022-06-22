/* eslint-disable react/no-array-index-key */
import React from 'react';
import Link from 'next/link';

import miliToDate from 'utils/format/miliToDate';

import styles from './question.module.scss';

const QuestionTable = ({ data, setTarget, total }) => (
  <div className={styles['table-wrapper']}>
    <div className={styles['table-content']}>
      {data.map((question, index) => (
        <Link href={`/question/${question.objectID}`} key={question.date}>
          <div className={styles.content}>
            {index === data.length - 1 && <div ref={setTarget} />}
            <div className={styles.f1}>{total - index}</div>
            <div className={styles.f2}>{question.managerName || '-'}</div>
            <div className={styles.f2}>{question.userName || '-'}</div>
            <div className={styles.f3}>{question.date ? miliToDate(question.date) : '-'}</div>

            <div className={styles.f2}>
              {question.isAnswered ? '답변 완료' : <div className={styles.wait}>답변 대기 중</div>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default QuestionTable;
