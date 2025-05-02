import React from 'react';
import {noHandler} from '@/components/ReactRangePicker/utils';

import './index.scss';

class YearPicker extends React.Component {
  years_to_display = 12;
  state = {
    year: undefined,
    years: []
  };

  componentDidMount() {
    const {year} = this.props;
    this.setYearData(year, year);
  }
  componentWillReceiveProps({year}) {
    this.setYearData(year, year);
  }

  setYearData = (selectedYear, startYear) => {
    this.setState({
      year: selectedYear,
      years: this.getYearsToRender(startYear),
      sartYear: startYear,
      endYear: startYear + this.years_to_display - 1
    });
  };

  getYearsToRender = year => {
    let counter = year,
      limit = year + this.years_to_display,
      years = [];
    while (counter < limit) {
      years.push(counter++);
    }
    return years;
  };

  onYearChange = incrementBy => {
    const {year, years} = this.state;
    this.setYearData(year, years[0] + this.years_to_display * incrementBy);
  };

  render() {
    const {year, years, sartYear, endYear} = this.state;
    const {visible} = this.props;
    const {onChange = noHandler('no handler for year picker')} = this.props;
    return (
      <div className={`year-picker${visible ? ' visible' : ' hidden'}`}>
        <div className="navigator">
          <button className="arrow prev btn btn-outline ripple" onClick={e => this.onYearChange(-1)} />
          <div className="values">
            {' '}
            {sartYear} - {endYear}
          </div>
          <button className="arrow next btn btn-outline ripple" onClick={e => this.onYearChange(1)} />
        </div>
        <div className="year-grid">
          {years.map((yearItem, index) => {
            return (
              <div
                key={index}
                className={`year-container${
                  year === yearItem ? ' selected' : ''
                } btn btn-outline ripple`}
                onClick={() => onChange(yearItem)}
              >
                {' '}
                <div className="year">{yearItem}</div>{' '}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default YearPicker;
