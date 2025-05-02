import React from 'react';
import './index.scss';
import {formatDate} from '@/components/ReactRangePicker/utils';
import Context from '../context';
import dayjs from 'dayjs';

const Placeholder = ({
  showTime = false,
  customPlaceholder,
  placeholder,
  format,
  provider,
}) => {
  const {startDate, endDate} = provider;
  const s_date = startDate ? startDate : undefined,
    e_date = endDate ? endDate : undefined;

  if (customPlaceholder) {
    const {_date: _startDate} = startDate || {};
    const {_date: _endDate} = endDate || {};
    return customPlaceholder({startDate: _startDate, endDate: _endDate});
  }

  return (
    <div className="default-placeholder">
      <div className="text">
        {!!s_date || !!e_date ? (
          <div className="dates-container">
            <DateAndTime format={format} date={s_date} showTime={showTime} />
            {!!e_date && <b> ~ </b>}
            <DateAndTime format={format} date={e_date} showTime={showTime} />
          </div>
        ) : (
          placeholder || 'Select Date / Date Range'
        )}
      </div>
      <CalendarIcon />
    </div>
  );
};

const DateAndTime = ({date, format, showTime}) => {
  if (!date) return undefined;
  const _format = showTime ? 'dd-mm-yyyy h:mi A' : 'dd-mm-yyyy';

  console.log('date11==', date);
  // import dayjs from 'dayjs';

  // dayjs(_date).format('YYYY-MM-DD HH:mm:ss');

  const dateStr = ''; //formatDate(format || _format, date);
  return (
    <React.Fragment>
      <span className="date">
        {' '}
        {dayjs(date._date).format('YYYY-MM-DD HH:mm:ss')}{' '}
      </span>
    </React.Fragment>
  );
};

const CalendarIcon = () => {
  const dateDots = new Array(5).fill('');
  return (
    <div className="icon">
      <div className="calendar-hooks">
        <div className="hook" />
        <div className="hook" />
      </div>
      <div className="date-dots">
        {dateDots.map((dot, index) => (
          <div key={index} className="dot" />
        ))}
      </div>
    </div>
  );
};

export default function (props) {
  return (
    <Context.Consumer>
      {(provider) => <Placeholder {...props} provider={provider} />}
    </Context.Consumer>
  );
}
