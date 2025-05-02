import React from 'react';

import {
  getNewMonthFrom,
  getCustomDateObject,
  getActualDate,
  noHandler,
  dateToInt,
  getTime,
  makeZero,
} from '@/components/ReactRangePicker/utils';

import {monthsFull, monthsShort} from '@/components/ReactRangePicker/const';

import Grids from '../grids';
import Navigator from '../navigator';
import MonthPicker from '../month-picker';
import YearPicker from '../year-picker';
import Footer from '../footer';
// import TimePicker from '../time-picker';
import Context from '../context';
import './index.scss';

 

import dayjs from 'dayjs';


import TimePicker from '../TimePicker/src';

const ANIMATE_LEFT = 'move-left';
const ANIMATE_RIGHT = 'move-right';
// 开始时间配置
const START_DATE_TIME = {
  hours: '00',
  minutes: '00',
  seconds: '00',
  period: 'AM',
};

// 结束时间配置
const END_DATE_TIME = {
  hours: '23',
  minutes: '59',
  seconds: '59',
  // period: 'AM',
};

// Pm 结束时间配置
const END_DATE_TIME_END_OF_DAY = {
  hours: '23',
  minutes: '59',
  seconds: '59',
  // period: 'PM',
};

function getDefaultValues(date) {
  if (!date) return undefined;

  if (!date instanceof Date) {
    console.warn(
      ' start and end must be a valid date object in defaultValue prop '
    );
    return undefined;
  }

  let customDate = getCustomDateObject(date);
  let time = getTime(12, date);
  return getActualDate(dateToInt(customDate), time);
}

class Calander extends React.Component {
  actualDate = new Date();
  actualIntDate = dateToInt(getCustomDateObject(this.actualDate));
  //flag to prevent month change when the month slide animation is still running
  is_animating = false;
  enable_range = false;
  state = {
    date: new Date(this.actualDate),
    animationClass: '',
    showMonthPopup: false,
    showYearPopup: false,
    showTimePopup: false,
  };

  componentDidMount() {
    const {defaultValue, disableRange, provider} = this.props;
    this.enable_range = disableRange !== true;
    let startDate = getDefaultValues(
      defaultValue ? defaultValue.startDate : undefined
    );
    let endDate = getDefaultValues(
      defaultValue ? defaultValue.endDate : undefined
    );

    if (endDate && !startDate) {
      console.warn(
        ' defaultValue prop must have a startDate if there is an endDate '
      );
      return;
    }

    if (startDate) {
      provider.updateContext({
        startDate,
        endDate,
      });
      this.setState({...this.state, date: startDate._date});
    }
  }

  componentWillReceiveProps({disableRange, isVisible}) {
    this.enable_range = disableRange !== true;
    if (!isVisible && this.props.isVisible !== isVisible) {
      // if calendar is hiding, make sure all the popup hide as well
      // so user dont see them next time when calendar is visible
      // using time-out with 300ms so hiding of popup transition is not visible to user when hide animation is running
      setTimeout(
        () =>
          this.setState({
            showMonthPopup: false,
            showYearPopup: false,
            showTimePopup: false,
          }),
        300
      );
    }
  }

  onMonthChange = (increment) => {
    if (this.is_animating) return;
    if (increment === 1) {
      this.setState({
        animationClass: ANIMATE_RIGHT,
      });
    } else {
      this.setState({
        animationClass: ANIMATE_LEFT,
      });
    }
    this.is_animating = true;
    // added timeout of same time as animation, so after the animation is done we can remove the animation class
    setTimeout(() => {
      const {date} = this.state;
      date.setMonth(date.getMonth() + increment);
      this.setState(
        {
          animationClass: '',
          date: date,
        },
        () => (this.is_animating = false)
      );
    }, 500);
  };

  onMonthSelect = () => {
    this.setState({
      showMonthPopup: true,
    });
  };

  monthChanged = (month, monthIndex) => {
    const {date} = this.state;
    date.setMonth(monthIndex);
    this.setState({
      date,
      showMonthPopup: false,
    });
  };

  onYearSelect = () => {
    this.setState({
      showYearPopup: true,
    });
  };

  yearChanged = (year) => {
    const {date} = this.state;
    date.setFullYear(year);
    this.setState({
      date,
      showYearPopup: false,
    });
  };

  // 选中日期
  onDateSelect = (date) => {
    console.log('date===', date);

    // 可以转
    console.log(
      'day===',
      dayjs(date + ' 00:00:00').format('YYYY-MM-DD HH:mm:ss')
    );
    // debugger;

    /*

const date1 = dayjs('2019-01-25')
const date2 = dayjs('2018-06-05')
date1.diff(date2) // 20214000000 default milliseconds


*/

    const {
      onDateSelected = noHandler(),
      selectTime,
      provider,
      onClose,
      closeOnSelect,
    } = this.props;

    console.log('this.props.provider==', this.props.provider);

    const {showTimePopup} = this.state;

    // 获取开始时间和结束时间
    const {date1Time, date2Time} = getTimes(provider);

    let startTime = `${date1Time.hours}:${date1Time.minutes}:${date1Time.seconds}`; // 00:00:00 AM
    let endTime = `${date2Time.hours}:${date2Time.minutes}:${date2Time.seconds}`; // 23:59:59 PM

    //  const {date1Time, date2Time} = $getTimes(provider);

    // 获取开始日期和结束日期
    const {selectedDate1, selectedDate2} = getIntDates(provider);
    const newState = {
      // 开始日期
      selectedDate1,
      // 结束日期
      selectedDate2,
      // 开始时间
      date1Time,
      // 结束时间
      date2Time,
    };

    console.log('newState==', newState);

    console.log('this.enable_range==', this.enable_range);
    console.log('date==', date);

    // 不是双联的
    if (!this.enable_range && !!date) {
      // 显示时间组件
      // this.setState({
      //   showTimePopup: selectTime ? true : showTimePopup,
      // });

      // 设置开始日期
      provider.updateContext({
        startDate: getActualDate(date, date1Time),
      });

      // 选中开始日期
      onDateSelected(getActualDate(date, date1Time));

      !selectTime && closeOnSelect && onClose();

      return;
    }

    // 这里处理选中的日期

    console.log('date33===', date);
    // 如果选中日期没有 则给开始日期
    if (!selectedDate1) {
      console.log('date44===', date);
      newState.selectedDate1 = date;
      newState.selectedDate2 = undefined;
    } else if (!!selectedDate1 && !selectedDate2) {
      // make sure selectedDate1 is always smaller then selectedDate2
      // 交换大小
      // 判断日期大小

      // // 开始日期
      // selectedDate1,
      // // 结束日期
      // selectedDate2,
      // // 开始时间
      // startTime,
      //  // 结束时间
      // startDate,

      console.log('111', date + ' ' + startTime);
      console.log('22', selectedDate1 + ' ' + endTime);

      console.log('startTime==', startTime);
      console.log('startTime==', endTime);

      // 开始
      const date1 = dayjs(selectedDate1 + ' ' + startTime);

      // 结束
      const date2 = dayjs(date + ' ' + endTime);

      console.log('diff==', date1.diff(date2));
      // debugger;

      // if (date < selectedDate1) {

      // date1Time, date2Time

      // const newState = {
      //   // 开始日期
      //   selectedDate1,
      //   // 结束日期
      //   selectedDate2,
      //   // 开始时间
      //   date1Time,
      //   // 结束时间
      //   date2Time,
      // };

      // 交换日期
      if (date1.diff(date2) > 0) {
        // 开始
        newState.selectedDate1 = date;
        // 结束
        newState.selectedDate2 = selectedDate1;

        // let temp = {
        //   ...newState.date1Time,
        // };

        // newState.date1Time = newState.date2Time;
        // newState.date2Time = temp;

      } else {
        newState.selectedDate2 = date;
      }
    } else if (!!selectedDate1 && !!selectedDate2) {
      newState.selectedDate1 = date;
      newState.selectedDate2 = undefined;
    }

    const d1 = newState.selectedDate1,
      d2 = newState.selectedDate2;

    // 时间
    // newState.date2Time =  date2Time;  //  d1 === d2 ? {...END_DATE_TIME_END_OF_DAY} : date2Time;

    this.setState(newState);

    // 获取开始日期还是结束日期  问题在于这里
    const _startDate = getActualDate(d1, date1Time);


    // 结束日期
    const _endDate = getActualDate(d2, date2Time);


    // 设置开始日期 和 结束日期
    provider.updateContext({
      startDate: _startDate,
      endDate: _endDate,
    });

    // 选中的时间
    onDateSelected(_startDate, _endDate);

    if (selectTime) {
      // this.showTime();
    } else if (!selectTime && d2) {
      closeOnSelect && onClose();
    }
  };

  selectToday = () => {
    // return if cards are animating
    if (this.is_animating === true) return;

    const {date} = this.state;
    const {selectTime, onDateSelected, provider, onClose, closeOnSelect} =
      this.props;
    const savedDate = getCustomDateObject(date);
    const currentDate = getCustomDateObject(new Date(this.actualDate));

    if (date === this.actualIntDate) {
      this.onDateSelect();
    }

    const goingBack =
      currentDate.year < savedDate.year ||
      (currentDate.year === savedDate.year &&
        currentDate.month < savedDate.month)
        ? true
        : false;
    if (goingBack) {
      this.setState({
        animationClass: ANIMATE_LEFT,
      });
    } else if (currentDate.month > savedDate.month) {
      this.setState({
        animationClass: ANIMATE_RIGHT,
      });
    }

    const fDate = getActualDate(this.actualIntDate, {...START_DATE_TIME});

    const lDate = this.enable_range
      ? getActualDate(this.actualIntDate, {
          ...END_DATE_TIME_END_OF_DAY,
        })
      : null;

    provider.updateContext({
      startDate: fDate,
      endDate: lDate,
    });

    if (onDateSelected) {
      onDateSelected(fDate, lDate);
      closeOnSelect && onClose();
    }

    // added timeout of same time as animation, so after the animation is done we can remove the animation class
    setTimeout(() => {
      this.setState(
        {
          animationClass: '',
          date: new Date(this.actualDate),
        },
        () => {
          this.is_animating = false;
          if (!this.enable_range && !!selectTime) {
            // this.showTime();
          }
        }
      );
    }, 500);
  };

  showTime = () => {
 
    this.setState({
      showTimePopup: true,
    });
  };

  closeTime = () => {
   
    this.setState({
      showTimePopup: false,
    });
  };

  onTimeSelected = (hours, minutes, period) => {
    const {onDateSelected, provider, closeOnSelect, onClose} = this.props;
    let {date1Time, date2Time} = getTimes(provider);
    const {selectedDate1, selectedDate2} = getIntDates(provider);

    if (selectedDate2) {
      date2Time = {
        hours,
        minutes,
        period,
      };
    } else {
      date1Time = {
        hours,
        minutes,
        period,
      };
      date2Time = {...END_DATE_TIME};
    }
    this.setState({
      showTimePopup: false,
    });
    const _startDate = getActualDate(selectedDate1, date1Time);
    const _endDate = selectedDate2
      ? getActualDate(selectedDate2, date2Time)
      : void 0;

    //
    provider.updateContext({
      startDate: _startDate,
      endDate: _endDate,
    });
    onDateSelected(_startDate, _endDate);
    if (closeOnSelect && this.enable_range && _endDate) {
      onClose();
    } else if (closeOnSelect && !this.enable_range) {
      onClose();
    }
  };

  render() {
    const {
      date,
      animationClass,
      showMonthPopup,
      showYearPopup,
      showTimePopup,
    } = this.state;
    const {onClose = noHandler(), footer, selectTime} = this.props;
    const prevMonth = getNewMonthFrom(date, -1);
    const nextMonth = getNewMonthFrom(date, 1);
    const currentMonth = getNewMonthFrom(date, 0);
    const {month, year} = getCustomDateObject(date);

    console.log('this.props.provider==', this.props.provider);

    console.log('showTimePopup==',showTimePopup);

    return (
      <div className="full-date-picker-container">
        <div>
          <div className="date-picker">
            {/* 月组件 */}
            <MonthPicker
              months={monthsShort}
              selected={month}
              // visible={showMonthPopup}
              visible={showMonthPopup}
              onChange={this.monthChanged}
            />

            {/* 年组件 */}
            <YearPicker
              year={year}
              visible={showYearPopup}
              onChange={this.yearChanged}
            />

            {/* 时间组件 */}
            <TimePicker 
            onClose={()=>{

            }}
           open={showTimePopup}

            // 
            
            
            // visible={showTimePopup} onDone={this.onTimeSelected}
            
            
            />

            {/*  */}
            <Navigator
              month={monthsFull[month]}
              year={year}
              onMonthChange={this.onMonthChange}
              onSelectMonth={this.onMonthSelect}
              onSelectYear={this.onYearSelect}
            />

            {/* 月组件 */}
            <Grids
              prevMonth={prevMonth}
              currentMonth={currentMonth}
              nextMonth={nextMonth}
              animationClass={animationClass}
              onDateSelect={this.onDateSelect}
              rangeEnabled={this.enable_range}
            />

            {/* time 组件 */}
          </div>

          {/* 下面组件 */}
          <Footer
            customFooter={footer}
            onToday={this.selectToday}
            onClose={onClose}

            showTime={!!selectTime}

            onShowTimePopup={()=>{

       
               this.showTime();
            }}
          />
        </div>
      </div>
    );
  }
}

// 这个是判断选中的日期
function getIntDates(provider) {
  const {
    startDate,
    endDate,

    // startTime,
    // endTime,
  } = provider;

  // _initDate 是存放日期

  console.log('startDate===', startDate);
  return {
    // 开始
    selectedDate1: provider.startDate ? provider.startDate._intDate : '',
    // 结束
    selectedDate2: provider.endDate ? provider.endDate._intDate : '',
    // startTime,
    // endTime,
  };
}

function getTimes(provider) {
  // 开始日期和结束日期
  const {startDate, endDate} = provider;
  let date1Time = {
    hours: makeZero(START_DATE_TIME.hours),
    minutes: makeZero(START_DATE_TIME.minutes),
    seconds: makeZero(START_DATE_TIME.seconds),
  };

  let date2Time = {
    hours: makeZero(END_DATE_TIME.hours),
    minutes: makeZero(END_DATE_TIME.minutes),
    seconds: makeZero(END_DATE_TIME.seconds),
  };

  if (startDate && startDate.customObject) {
    // 从Obj那获取
    const {hours, minutes, seconds, period} = startDate.customObject;

    // 时 分
    date1Time = {
      hours,
      minutes,
      seconds,
    };
  }
  if (endDate && endDate.customObject) {
    const {hours, minutes, seconds, period} = endDate.customObject;
    date2Time = {
      hours,
      minutes,
      seconds,
      // timeString: toTimeString({
      //   hours,
      //   minutes,
      //   seconds,
      // }),
    };
  }
  return {
    date1Time,
    date2Time,
  };
}

export default function (props) {
  return (
    <Context.Consumer>
      {(provider) => {
        return <Calander {...props} provider={provider} />;
      }}
    </Context.Consumer>
  );
}
