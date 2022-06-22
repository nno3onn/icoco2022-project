/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import styles from './fileUploader.module.scss';

const FileUploader = ({ id, file, onChange, type }) => {
  let month;
  let fileTarget;
  let scanTarget;

  if (type === '실명인증') {
    month = 6;
    fileTarget = '주민등록초본';
    scanTarget = '초본';
  } else if (type === '건강인증') {
    month = 1;
    fileTarget = '보건증';
    scanTarget = '보건증';
  } else if (type === '범죄이력') {
    month = 1;
    fileTarget = '범죄 이력';
    scanTarget = '파일';
  }

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.label}>{type}</div>
        <div className={styles.value}>
          <div className={styles['upload-label']}>{file ? file.name : ''}</div>
          <div className={styles['upload-button']}>
            <label htmlFor={id}>
              <img alt="upload" src="/icons/upload.png" />
              업로드
            </label>
            <input
              type="file"
              id={id}
              onChange={onChange}
              accept="image/png, image/jpeg, application/pdf"
            />
          </div>
        </div>
      </div>
      <div className={styles.desc}>
        <div>
          - {month}개월 이내에 발급된
          <b> {fileTarget}</b>
          을 첨부해 주세요.
          <br />- 스캔한 {scanTarget}을 jpg, png, pdf 중 하나로 업로드해 주세요.
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
