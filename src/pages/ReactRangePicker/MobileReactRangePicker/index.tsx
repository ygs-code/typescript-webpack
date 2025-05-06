import React, { Component, useState, useEffect } from 'react';
import DatePicker, {
  Calendar,
  CalendarPicker,
} from '@/components/ReactRangePicker';

import { DatePicker as AnedDatePicker, Modal } from 'antd';
const { RangePicker } = AnedDatePicker;

export default (props) => {
  const { onChange = () => {} } = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <>
      <CalendarPicker
        value={value}
        visible={open}
        showTime
        selectTime
        onChange={([startDate, endDate]) => {
          setOpen(false);
          setValue([startDate, endDate]);
          onChange([startDate, endDate]);
        }}
      />
      <RangePicker
        showTime
        open={false}
        value={value}
        onChange={(v)=>{
          if(v){
            setValue([startDate, endDate]);
            onChange([startDate, endDate]);
          }else{
            setValue(undefined);
            onChange(undefined);
          }
        }}
        onClick={() => {
          setOpen(true);
        }}
      />
    </>
  );
};
