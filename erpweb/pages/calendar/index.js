import React, { useEffect, useState } from 'react';

import Calendar from 'components/calendar';
import styles from './index.module.scss';

// birthExpectedDate: '2022.02.01',
// careCenterEndDate: '2022.02.14',
// dispatchExpectedDate: '2022.02.20',
// hospitalEndDate: '2022.02.02',
// serviceEndDate: '2022.03.05',

const showCalendar = () => {
  const [calendarData, setCalendarData] = useState();

  const receiveMessage = (e) => {
    setCalendarData(JSON.parse(e.data));
  };

  useEffect(async () => {
    window.addEventListener('message', receiveMessage, false);
  }, []);

  return (
    <div className={styles['calendar-wrapper']}>
      {calendarData && <Calendar data={{ ...calendarData }} />}
    </div>
  );
};
export default showCalendar;
