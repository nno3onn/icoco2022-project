/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/* eslint-disable operator-linebreak */
import React from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import koLoc from '@fullcalendar/core/locales/ko';
import dateFormat from 'utils/format/getYYYYMMDD';
import calcAnotherDate from 'utils/time/calcAnotherDate';
import getMilis from 'utils/format/getMilis';

const Calendar = ({ data }) => {
  if (!data) return;

  const convertDateString = (value) => (value ? value.replace(/\./g, '-') : null);

  const hospitalEndDate = convertDateString(data.hospitalEndDate);
  const careCenterStartDate = convertDateString(data.careCenterStartDate);
  const careCenterEndDate = convertDateString(data.careCenterEndDate);
  const birthExpectedDate = convertDateString(data.birthExpectedDate);
  const dispatchExpectedDate = convertDateString(data.dispatchExpectedDate);
  const serviceEndDate = convertDateString(data.serviceEndDate);
  const serviceStartDate = serviceEndDate
    ? convertDateString(dateFormat(calcAnotherDate(dispatchExpectedDate, 1)))
    : null;
  const hospitalStartDate = hospitalEndDate
    ? convertDateString(dateFormat(calcAnotherDate(birthExpectedDate, 1)))
    : null;

  const circleDate = ({ wrapperStyle, elDay, backgroundColor }) => {
    const dayStyle = elDay.style;
    const h = elDay.offsetHeight;

    wrapperStyle.display = 'flex';
    wrapperStyle.flexDirection = 'column';
    wrapperStyle.alignItems = 'center';
    wrapperStyle.width = '100%';

    dayStyle.backgroundColor = backgroundColor;
    dayStyle.width = `${h}px`;
    dayStyle.borderRadius = '100%';

    if (backgroundColor === '#503AA9') {
      dayStyle.color = 'white';
    }
  };

  const setBirthExpectedDate = ({ wrapperStyle, elDay }) => {
    circleDate({ wrapperStyle, elDay, backgroundColor: '#FCEE9E' });
  };

  const setHospitalDate = ({ wrapperStyle, elDay, dateMilis }) => {
    const backgroundColor = '#FCEE9E';
    const dayStyle = elDay.style;
    dayStyle.backgroundColor = backgroundColor;

    if (getMilis(hospitalStartDate) === dateMilis && getMilis(hospitalEndDate) === dateMilis) {
      circleDate({ wrapperStyle, elDay, backgroundColor });
      return;
    }
    if (getMilis(hospitalStartDate) === dateMilis) {
      dayStyle.borderTopLeftRadius = '50px';
      dayStyle.borderBottomLeftRadius = '50px';
    }
    if (getMilis(hospitalEndDate) === dateMilis) {
      dayStyle.borderTopRightRadius = '50px';
      dayStyle.borderBottomRightRadius = '50px';
    }
  };

  const setCareCenterDate = ({ wrapperStyle, elDay, dateMilis }) => {
    const backgroundColor = '#FCEE9E';
    const dayStyle = elDay.style;
    dayStyle.backgroundColor = backgroundColor;

    if (getMilis(careCenterStartDate) === dateMilis && getMilis(careCenterEndDate) === dateMilis) {
      circleDate({ wrapperStyle, elDay, backgroundColor });
      return;
    }

    if (getMilis(careCenterStartDate) === dateMilis) {
      dayStyle.borderTopLeftRadius = '50px';
      dayStyle.borderBottomLeftRadius = '50px';
    }
    if (getMilis(careCenterEndDate) === dateMilis) {
      dayStyle.borderTopRightRadius = '50px';
      dayStyle.borderBottomRightRadius = '50px';
    }
  };

  const setDispatchExpectedDate = ({ wrapperStyle, elDay }) => {
    circleDate({ wrapperStyle, elDay, backgroundColor: '#503AA9' });
  };

  const setServiceDate = ({ wrapperStyle, elDay, dateMilis }) => {
    const backgroundColor = '#F0EFFE';
    const dayStyle = elDay.style;
    dayStyle.backgroundColor = backgroundColor;

    if (getMilis(serviceStartDate) === dateMilis && getMilis(serviceEndDate) === dateMilis) {
      circleDate({ wrapperStyle, elDay, backgroundColor });
      return;
    }

    if (getMilis(serviceStartDate) === dateMilis) {
      dayStyle.borderTopLeftRadius = '50px';
      dayStyle.borderBottomLeftRadius = '50px';
    }
    if (getMilis(serviceEndDate) === dateMilis) {
      dayStyle.borderTopRightRadius = '50px';
      dayStyle.borderBottomRightRadius = '50px';
    }
  };

  const dayNumberText = (arg) => arg.dayNumberText.replace('일', '');

  const dayCellDidMount = (arg) => {
    const { el } = arg;
    const elWrapper = el.firstChild;
    const elDay = elWrapper.firstChild;
    const elText = elWrapper.children[1];
    elText.style.width = 'max-content';

    const dateMilis = arg.date.setHours(9, 0, 0, 0).valueOf();

    if (dateMilis === getMilis(birthExpectedDate)) {
      setBirthExpectedDate({ wrapperStyle: elWrapper.style, elDay });
    }

    if (dateMilis >= getMilis(hospitalStartDate) && dateMilis <= getMilis(hospitalEndDate)) {
      setHospitalDate({ wrapperStyle: elWrapper.style, elDay, dateMilis });
    }

    if (
      careCenterStartDate &&
      careCenterEndDate &&
      dateMilis >= getMilis(careCenterStartDate) &&
      dateMilis <= getMilis(careCenterEndDate)
    ) {
      setCareCenterDate({ wrapperStyle: elWrapper.style, elDay, dateMilis });
    }

    if (dateMilis === getMilis(dispatchExpectedDate)) {
      setDispatchExpectedDate({ wrapperStyle: elWrapper.style, elDay });
    }

    if (
      serviceStartDate &&
      serviceEndDate &&
      dateMilis >= getMilis(serviceStartDate) &&
      dateMilis <= getMilis(serviceEndDate)
    ) {
      setServiceDate({ wrapperStyle: elWrapper.style, elDay, dateMilis });
    }
  };

  const events = [
    {
      title: '출산일',
      date: birthExpectedDate || null,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#F3AF47',
    },
    {
      title: '입원기간',
      start: hospitalStartDate || null,
      end: hospitalEndDate || null,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#F3AF47',
    },
    {
      title: '조리원 이용기간',
      start: careCenterStartDate || null,
      end: careCenterEndDate || null,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#F3AF47',
    },
    {
      title: '파견일',
      date: dispatchExpectedDate || null,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#503AA9',
    },
    {
      title: '서비스 이용기간',
      start: serviceStartDate || null,
      end: serviceEndDate || null,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: '#503AA9',
    },
  ];

  const initialView = 'dayGridMonth';
  const plugins = [dayGridPlugin];
  const headerToobar = {
    center: 'title',
    left: 'prev',
    right: 'next',
  };

  return (
    <FullCalendar
      plugins={plugins}
      headerToolbar={headerToobar}
      initialView={initialView}
      initialEvents={events}
      locale={koLoc}
      initialDate={dispatchExpectedDate || convertDateString(dateFormat())}
      dayCellContent={dayNumberText}
      dayCellDidMount={dayCellDidMount}
      contentHeight="auto"
    />
  );
};

export default Calendar;
