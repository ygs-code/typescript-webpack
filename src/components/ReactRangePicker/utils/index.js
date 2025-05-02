import {monthsShort, monthsFull} from '@/components/ReactRangePicker/const';
import {formators} from './date-formators.js';

export const makeZero = (time) => {
  return parseInt(time) < 10 ? '0' + parseInt(time) : time;
};

export const getDays = (month, year) => {
  // Month here is 1-indexed (January is 1, February is 2, etc). This is
  // because we're using 0 as the day so that it returns the last day
  // of the last month,  so we add +1 to the month number
  // so it returns the correct amount of days
  if (typeof month !== 'number' || typeof year !== 'number') {
    const date = new Date();
    month = date.getMonth();
    year = date.getFullYear();
  }
  return new Date(year, month + 1, 0).getDate();
};

export const getDaysArray = ({month, year}) => {
  const days = getDays(month, year);
  const daysArray = [];
  let i = 1;
  for (i; i <= days; i += 1) {
    daysArray.push(i);
  }
  return daysArray;
};

export const getNewMonthFrom = (from, months = 0) => {
  const newInstance = new Date(from);
  newInstance.setMonth(newInstance.getMonth() + months);
  newInstance.setDate(1);
  return newInstance;
};

export const noHandler = (message) => () => console.log(message);

export const getCustomDateObject = (date = new Date()) => {
  return {
    day: date.getDay(),
    date: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  };
};

export const getTime = (format, date = new Date()) => {
  const tempHours = date.getHours();

  // const hours = format === 12 && tempHours > 12 ? tempHours - 12 : tempHours;

  const period = format === 12 ? (tempHours > 12 ? 'PM' : 'AM') : '';

  return {
    hours: tempHours,
    // 分钟
    minutes: date.getMinutes(),
    // 秒
    seconds: date.getSeconds(),
    period,
  };
};

export const getActualDate = (intDate = '', timeObj = {}, format = 12) => {
  const strDate = (intDate || '').toString();

  let hours, minutes, seconds, period;

  if (!strDate || strDate.length !== 8) {
    return {};
  }

  // 年
  const year = parseInt(strDate.substring(0, 4), 10);
  // 月
  const month = parseInt(strDate.substring(4, 6), 10);

  // 日;
  const date = parseInt(strDate.substring(6, 8), 10);

  console.log('timeObj==>', timeObj);

  // 声明一个新的日期对象
  const newDate = new Date(year, month, date);

  if (!timeObj) {
    const time = getTime(format);

    hours = makeZero(time.hours);
    minutes = makeZero(time.minutes);
    seconds = makeZero(time.seconds);
    period = time.period;
  } else if (typeof timeObj === 'object') {
    // 时间
    hours = makeZero(parseInt(timeObj.hours, 10));

    // 分钟
    minutes = makeZero(timeObj.minutes);

    // 秒
    seconds = makeZero(timeObj.seconds);

    // 上午下午
    period = '' + timeObj.period;

    // format date to 24 hours for date object
    // if (period === 'PM') {
    //   dateHours = hours < 12 ? hours + 12 : hours;
    // } else {
    //   dateHours = hours === 12 ? 0 : hours;
    // }
    // 设置日期对象的小时和分钟
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds);
  }
  return {
    _date: newDate,
    _intDate: intDate,
    customObject: {
      // 时
      minutes,
      // 分
      hours,
      // 秒
      seconds,
      // 上下午
      period,

      date,
      // 月
      month,
      // 年
      year,
      monthNameShort: monthsShort[month],
      monthNameFull: monthsFull[month],
      day: newDate.getDay(),
    },
  };
};

export const dateToInt = (date) => {
  // make sure both month and day starts with 0 if single digit;
  const month = date.month < 10 ? '0' + date.month : date.month;
  const day = date.date < 10 ? '0' + date.date : date.date;
  return parseInt('' + date.year + month + day, 10);
};

export const formatDate = (format, date = new Date()) => {
  console.log('format22==', format);
  console.log('formators22==', formators);
  console.log('date22==', date);

  formators.forEach((formator) => {
    // console.log('formator==',formator);
    // console.log('date==',date);

    const _f = formator(format, date);
    format = _f || format;
  });
  return format;
};
