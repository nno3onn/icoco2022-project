import React from 'react';

import styles from 'components/input/search.module.scss';

const SearchInput = ({
  placeholder = '',
  searchText,
  setter,
  onKeyDown = null,
  onClick = null,
}) => (
  <div className={styles.container}>
    <input
      className={styles.input}
      placeholder={placeholder}
      value={searchText || ''}
      onChange={({ target: { value } }) => setter(value)}
      type="text"
      onKeyDown={onKeyDown}
    />
    <button type="button" onClick={onClick}>
      <img alt="search" src="/icons/search.png" />
    </button>
  </div>
);

export default SearchInput;
