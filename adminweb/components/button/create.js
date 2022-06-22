import React from 'react';

import styles from 'components/button/create.module.scss';

const CreateButton = ({ onClick, text }) => (
  <button type="button" onClick={onClick} className={styles.container}>
    <img alt="plus" src="/icons/plus.png" />
    <div>{text}</div>
  </button>
);

export default CreateButton;
