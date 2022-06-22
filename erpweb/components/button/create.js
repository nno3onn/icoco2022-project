import React from 'react';

import styles from './create.module.scss';

const CreateButton = ({ text }) => (
  <button type="button" className={styles.container}>
    <img alt="plus" src="/icons/plus.png" />
    <div>{text}</div>
  </button>
);

export default CreateButton;
