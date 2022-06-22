/* eslint-disable object-curly-newline */
import React, { useRef, useState } from 'react';

import styles from './cost.module.scss';

const CostDropdown = ({ label, grades, value, setter, valueSets, placeholder }) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    ref.current.style.maxHeight = '116px';
    setIsOpen(true);
  };

  const close = (v) => () => {
    ref.current.style.maxHeight = '0px';
    setIsOpen(false);

    if (v) {
      setter({ ...value, [grades]: v });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <button
        type="button"
        className={styles['dropdown-default']}
        onClick={isOpen ? close(null) : open}
      >
        {value[grades] || placeholder}
        <img alt="arrow" src={`/icons/arrow-${isOpen ? 'top' : 'bottom'}.png`} />
      </button>
      <div className={styles['dropdown-list-wrapper']} ref={ref}>
        {valueSets.map((v, i) => (
          <button
            type="button"
            className={styles['dropdown-item']}
            key={String(i)}
            onClick={close(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CostDropdown;
