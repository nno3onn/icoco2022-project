/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable object-curly-newline */
import React, { useRef, useState } from 'react';

import styles from './index.module.scss';

const Dropdown = ({ value, setter, valueSets, placeholder, handleClick = null }) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    ref.current.style.maxHeight = '116px';
    setIsOpen(true);
  };

  const close = (v) => () => {
    ref.current.style.maxHeight = '0px';
    setIsOpen(false);
    setter(v);

    if (handleClick) handleClick(v);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles['dropdown-default']}
        onClick={isOpen ? close(value) : open}
      >
        {value || placeholder}
        <img alt="arrow" src={`/icons/arrow-${isOpen ? 'top' : 'bottom'}.png`} />
      </button>
      <div className={styles['dropdown-list-wrapper']} ref={ref}>
        {valueSets
          ? valueSets.map((v, i) => (
              <button
                type="button"
                className={styles['dropdown-item']}
                key={String(i)}
                onClick={close(v)}
              >
                {v}
              </button>
            ))
          : null}
      </div>
    </div>
  );
};

export default Dropdown;
