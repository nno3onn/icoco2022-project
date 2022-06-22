/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

import styles from './index.module.scss';

const MultiRadiobox = ({ active, setter, text, limitNumber }) => {
  const handleUpdate = () => {
    const idx = active.indexOf(text);
    if (idx > -1 && active.length <= limitNumber) {
      const temp = active.filter((v) => v !== text);
      setter([...temp]);
    } else if (idx < -1 && active.length < limitNumber) {
      setter([...active, text]);
    } else if (active.length === limitNumber) {
      alert(`최대 ${limitNumber}개까지 선택가능합니다`);
    } else {
      setter([...active, text]);
    }
  };

  return (
    <button type="button" className={styles.container} onClick={handleUpdate}>
      <img src={`/icons/check-${active.includes(text) ? '' : 'in'}active.png`} />
      <div className={styles.text}>{text}</div>
    </button>
  );
};

export default MultiRadiobox;
