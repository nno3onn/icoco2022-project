import React from 'react';

import styles from './info.module.scss';

const InfoTable = ({ data, style = null, valueLineHeight = null }) => (
  <div className={styles['table-wrapper']} style={style}>
    {data.map(({ k, v }, index) => (
      <div className={styles[`${index === 0 ? 'td-top' : 'td'}`]}>
        <div className={styles['td-label']}>{k}</div>
        <div className={styles.value} style={{ lineHeight: valueLineHeight }}>
          {v}
        </div>
      </div>
    ))}
  </div>
);

export default InfoTable;
