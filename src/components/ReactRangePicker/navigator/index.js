import React from 'react';
import {noHandler} from '@/components/ReactRangePicker/utils';

import './index.scss';

const Navigator = ({
  month = '',
  year = 2018,
  onMonthChange = noHandler('no month change handler'),
  onSelectMonth = noHandler(' no month select handler'),
  onSelectYear = noHandler(' no year select handler')
}) => {
  return (
    <div className="navigator">
      <button className="arrow prev btn btn-outline ripple" onClick={e => onMonthChange(-1)} />
      <div className="values">
        <button className="month btn btn-outline ripple" onClick={onSelectMonth}>
          {' '}
          {month}{' '}
        </button>
        <button className="year btn btn-outline ripple" onClick={onSelectYear}>
          {' '}
          {year}{' '}
        </button>
      </div>
      <button className="arrow next btn btn-outline ripple" onClick={e => onMonthChange(1)} />
    </div>
  );
};

export default Navigator;
