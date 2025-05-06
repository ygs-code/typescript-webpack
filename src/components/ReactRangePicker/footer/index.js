import React from 'react';
import {noHandler} from '@/components/ReactRangePicker/utils';
import Context from '../context';

import dayjs from 'dayjs';
import './index.scss';

const Footer = ({
  onToday = noHandler(),
  onClose = noHandler(),
  showTime = false,
  customFooter,
  provider,
  onShowTimePopup = () => {},
  showTimePopup,
}) => {
  // 开始时间和结束时间
  const {startDate, endDate} = provider;

  // const {
  //   endDate,
  //   startDate,
  // }=this.props.provider;

  if (startDate) {
    console.log(
      'startDate66===',
      dayjs(startDate._date).format('YYYY-MM-DD HH:mm:ss')
    );
  }

  if (endDate) {
    console.log(
      'endDate77===',
      dayjs(endDate._date).format('YYYY-MM-DD HH:mm:ss')
    );
  }

  console.log('provider=======', provider);

  // if (customFooter) {
  //   return customFooter({
  //     today: onToday,
  //     startDate: startDate ? startDate._date : undefined,
  //     endDate: endDate ? endDate._date : undefined,
  //     close: () => onClose(startDate, endDate),
  //   });
  // }

  // 开始日期
  let fDate = '',
    //  开始时间
    fDateTime = '',
    // 结束日期
    lDate = '',
    // 结束时间
    lDateTime = '';

  // 如果有开始时间
  if (startDate && startDate.customObject) {
    const {_date} = startDate;
    const {date, monthNameShort, year, hours, minutes, period, seconds} =
      startDate.customObject;

    fDate = dayjs(_date).format('YYYY-MM-DD');

    fDateTime = showTime ? hours + ':' + minutes + ':' + seconds : '';

  
  }

  // 如果有结束时间
  if (endDate && endDate.customObject) {
    const {_date} = endDate;
    const {date, monthNameShort, year, hours, minutes, period, seconds} =
      endDate.customObject;
    lDate = dayjs(_date).format('YYYY-MM-DD');
    lDateTime = showTime ? hours + ':' + minutes + ':' + seconds : '';
  }

  return (
    <div className="default-footer">
      {/* 如果没有选择时间 */}
      {!fDate && !lDate && <div className="hint">Select a date/range</div>}

      {!!fDate && (
        <div className="selected-dates">
          {/* <div className="date-heading"> Selected Date </div> */}
          <div className={`holder-wrapper${!lDate ? ' center-items' : ''}`}>
            {/* 开始时间 */}
            {fDate && (
              <DateHolder
                heading={lDate ? 'From' : ''}
                date={fDate}
                time={fDateTime}
                onShowTimePopup={() => {
                  onShowTimePopup(true, 'startTime');
                }}
              />
            )}
            {/* 结束日期 */}
            {lDate && (
              <DateHolder
                heading="To"
                date={lDate}
                time={lDateTime}
                onShowTimePopup={() => {
                  onShowTimePopup(true, 'endTime');
                }}
              />
            )}
          </div>
        </div>
      )}
      {/* 按钮 */}
      <Buttons
        disableSelect={!fDate && !lDate}
        onToday={onToday}
        onClose={(e) => {
          if (showTimePopup) {
            onShowTimePopup(false);
          } else {
            onClose();
          }
        }}
      />
    </div>
  );
};

const Buttons = ({disableSelect, onToday, onClose}) => {
  return (
    <div className="buttons">
      <button className="today" onClick={onToday}>
        {' '}
        TODAY{' '}
      </button>
      <button disabled={disableSelect} className="select" onClick={onClose}>
        {' '}
        Select{' '}
      </button>
    </div>
  );
};

const DateHolder = ({
  heading = '',
  date = '',
  time,
  extraClass = '',
  onShowTimePopup = () => {},
}) => {
  console.log();

  return (
    <div className={'date-holder ' + extraClass}>
      <div className="heading"> {heading} </div>
      <div className="date-box">
        {' '}
        <span className="date btn btn-outline ripple"> {date} </span>{' '}
        <span className="time btn btn-outline ripple" onClick={onShowTimePopup}>
          {' '}
          {time}{' '}
        </span>{' '}
      </div>
    </div>
  );
};

export default function (props) {
  return (
    <Context.Consumer>
      {(provider) => <Footer {...props} provider={provider} />}
    </Context.Consumer>
  );
}
