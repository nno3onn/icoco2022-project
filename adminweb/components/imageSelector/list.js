import React, { useState } from 'react';

import styles from 'components/imageSelector/list.module.scss';
import Modal from 'components/modal';

import verifyFileSize from 'utils/input/verifyFileSize';

const ThumbnailsList = ({ setter, thumbnails, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSeletedIndex] = useState();

  const addImages = (files) => {
    const fs = [];
    Array.from(files).forEach((file) => {
      if (verifyFileSize(file)) {
        fs.push({ file, url: URL.createObjectURL(file) });
      } else {
        return alert('1장당 2MB 이하의 이미지만 올리실 수 있습니다');
      }
    });
    setter([...thumbnails, ...fs]);
  };

  const deleteImage = (index) => () => {
    const newImages = thumbnails;
    newImages.splice(index, 1);
    setter([...newImages]);
    setIsOpen(false);
  };

  const handleModal = (index) => () => {
    setSeletedIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      {isOpen && <Modal opener={setIsOpen} onClick={deleteImage(selectedIndex)} page="image" />}
      <input
        type="file"
        accept="image/*"
        id={id}
        onChange={({ target: { files } }) => addImages(files)}
        multiple
        style={{ display: 'none' }}
      />

      <div className={styles['outer-wrapper']}>
        {thumbnails.length ? (
          thumbnails.map((img, i) => (
            <>
              <div className={styles['img-wrapper']}>
                <div className={styles['img-section']}>
                  <button
                    type="button"
                    className={styles['img-delete-label']}
                    onClick={handleModal(i)}
                  >
                    이미지 삭제
                  </button>
                  <div
                    style={{
                      backgroundImage: `url(${typeof img === 'object' ? img.url : img})`,
                    }}
                    className={styles['img-bg']}
                  />
                </div>
              </div>
              {i === thumbnails.length - 1 ? (
                <label htmlFor={id} className={styles['img-add-label']}>
                  <img alt="upload" src="/icons/upload.png" />
                  <div>
                    이미지를 업로드 하려면
                    <br />
                    여기를 누르세요
                  </div>
                </label>
              ) : null}
            </>
          ))
        ) : (
          <label htmlFor={id} className={styles['img-add-label']}>
            <img alt="upload" src="/icons/upload.png" />
            <div>
              이미지를 업로드 하려면
              <br />
              여기를 누르세요
            </div>
          </label>
        )}
      </div>
    </>
  );
};

export default ThumbnailsList;
