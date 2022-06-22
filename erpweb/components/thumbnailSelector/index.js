/* eslint-disable object-curly-newline */
import React from 'react';

import styles from './index.module.scss';

const ThumbnailSelector = ({ file, setter, label = '사진 업로드', path }) => (
  <div className={styles.container}>
    {file ? (
      <div
        className={styles['thumbnail-bg']}
        style={{
          backgroundImage: `url(${typeof file === 'object' ? URL.createObjectURL(file) : file})`,
        }}
      />
    ) : (
      <div className={styles['thumbnail-default']}>
        <img alt="upload" src={`/icons/upload-${path ? 'manager' : 'company'}.png`} />
      </div>
    )}
    <input
      type="file"
      className={styles['thumbnail-file']}
      id="thumbnail"
      accept="image/gif, image/jpeg, image/png"
      onChange={({ target: { files } }) => setter(files[0])}
    />
    <label className={styles['thumbnail-label']} htmlFor="thumbnail">
      {label}
    </label>
  </div>
);

export default ThumbnailSelector;
