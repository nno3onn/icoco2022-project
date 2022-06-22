/* eslint-disable object-curly-newline */
import React from 'react';

import styles from './index.module.scss';

const ThumbnailSelector = ({
  name = '',
  file,
  setter,
  width = 190,
  height = 190,
  isAvatar = true,
}) => (
  <>
    <input
      type="file"
      className={styles['thumbnail-file']}
      id={`thumbnail-${name}`}
      accept="image/gif, image/jpeg, image/png"
      onChange={({ target: { files } }) => setter(files[0])}
    />
    <label
      style={{
        width,
        height,
      }}
      className={styles['thumbnail-label']}
      htmlFor={`thumbnail-${name}`}
    >
      {file ? (
        <>
          <div
            className={styles['thumbnail-bg']}
            style={{
              backgroundImage: `url(${
                typeof file === 'object' ? URL.createObjectURL(file) : file
              })`,
              borderRadius: `${isAvatar ? '50%' : null}`,
            }}
          />
          <div
            className={styles['thumbnail-modify']}
            style={{ borderRadius: `${isAvatar ? '50%' : null}` }}
          >
            이미지 변경
          </div>
        </>
      ) : (
        <div
          className={styles['thumbnail-default']}
          style={{ borderRadius: `${isAvatar ? '50%' : null}` }}
        >
          <img alt="upload" src="/icons/upload.png" />
          <div>
            이미지를 업로드 하려면
            <br />
            여기를 누르세요
          </div>
        </div>
      )}
    </label>
  </>
);

export default ThumbnailSelector;
