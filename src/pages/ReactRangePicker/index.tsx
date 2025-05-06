import React, { Component } from 'react';
import DatePicker, { Calendar } from '@/components/ReactRangePicker';


import { DatePicker as AnedDatePicker, Space } from 'antd';


// import DatePicker from 'react-range-picker';
import TimePicker from './TimePicker/src';
import MobileReactRangePicker from './MobileReactRangePicker';
import dayjs from 'dayjs';
import './index.css';

const PickerWithCustomePlaceholder = ({ onDateSelect }) => {
  const placeholder = ({ startDate, endDate }) => {
    let _startDate = '';
    let _endDate = '';
    if (startDate) {
      _startDate = `${startDate.getDate()}/${
        startDate.getMonth() + 1
      }/${startDate.getFullYear()}`;
    }

    if (endDate) {
      _endDate = `${endDate.getDate()}/${
        endDate.getMonth() + 1
      }/${endDate.getFullYear()}`;
    }
    return (
      <div>
        <div
          className="_placeholder"
          style={{ border: '1px solid gray', padding: '5px 10px' }}>
          {!_startDate ? 'click here ' : `${_startDate} - ${_endDate}`}
        </div>
      </div>
    );
  };
  return (
    <div>
      <br />
      <br />
      <h3>With custom placeholder</h3>
      <br />
      <DatePicker placeholder={placeholder} onDateSelect={onDateSelect} />
    </div>
  );
};

class ControlledVisibility extends Component {
  state = { visible: true };
  onDateSelect = (f, l) => console.log(' date selecred ', f, l);
  render() {
    return (
      <DatePicker
        onDateSelected={this.onDateSelect}
        defaultValue={{
          startDate: new Date('2020-01-05'),
          endDate: '',
        }}
        onClose={() => this.setState({ visible: false })}
        onOpen={() => this.setState({ visible: true })}
        visible={this.state.visible}
        closeOnOutsideClick={false}
        // dateFormat="DD-MM-YYYY h:miA"
        // disableRange
        // rangeTillEndOfDay
        // selectTime
      />
    );
  }
}

class App extends Component {
  onDateSelect = (startDate, endDate) => {
    console.log('startDate==', dayjs(startDate).format('YYYY-MM-DD HH:mm:ss'));
    console.log('endDate==', dayjs(endDate).format('YYYY-MM-DD HH:mm:ss'));
  };

  onClose = (startDate, endDate) => {
    console.log(
      ' ok/select:  startDate => %s , endDate => %s ',
      startDate,
      endDate
    );
  };

  render() {
    return (
      <div style={{   overflow: 'hidden', height: '100vh' ,    width: '100vw'}}>
       <div>
           <MobileReactRangePicker />
         </div>  
        {/* <div>
          <DatePicker
            onDateSelected={this.onDateSelect}
            value={[dayjs('2025-01-05 00:00:00'), dayjs('2025-01-10 23:59:59')]}
            defaultValue={
              {
                // startDate:    new Date('2020-01-05'),
                // endDate: ''
              }
            }
            onChange={([startDate, endDate]) => {
              console.log('[startDate, endDate]==', startDate, endDate);

             
            }}
            onClose={this.onClose}
            onOpen={() => console.log(' openend')}
            // dateFormat="MMMM dd  YYYY @ h:mi A"
            dateFormat="DD-MM-YYYY h:miA"
            // disableRange
            rangeTillEndOfDay
            selectTime
          />
        </div>

        <br />

        <div>
          <Calendar
            value={[dayjs('2025-01-05 00:00:00'), dayjs('2025-01-10 23:59:59')]}
            visible={true}
            showTime
               dateFormat="DD-MM-YYYY h:miA"
               selectTime
            onChange={([startDate, endDate]) => {
              console.log('[startDate, endDate]==', startDate, endDate);

              
            }}
          />
        </div>

        <div>
          <TimePicker />
        </div>

        <div>
          <h2> With custom footer</h2>
          <DatePicker
            onDateSelected={this.onDateSelect}
            onClose={this.onClose}
            disableRange
            // rangeTillEndOfDay
            selectTime
            footer={({ startDate, endDate, close, today }) => (
              <div
                style={{
                  border: '1px solid green',
                  padding: '2px, 10px',
                  minWidth: 200,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                {startDate ? startDate.getDate() : null}
                {endDate ? ', ' + endDate.getDate() : null}
                <button onClick={close}>OK</button>
                <button onClick={today}>Today</button>
              </div>
            )}
          />
        </div>
        <br />
        <div>
          <h2> With custom date format and placeholder text</h2>
          <DatePicker
            onDateSelected={this.onDateSelect}
            onClose={this.onClose}
            disableRange
            dateFormat="MMMM dd  YYYY @ h:mi A"
            placeholderText="Date of birth and time"
            selectTime
          />
        </div>
        <br />
        <div>
          <h2> Close onSelect </h2>
          <DatePicker
            onDateSelected={this.onDateSelect}
            onClose={this.onClose}
            disableRange
            dateFormat="MMMM dd  YYYY @ h:mi A"
            placeholderText="Date of birth and time"
            // selectTime
            closeOnSelect
          />
        </div>
        <br /> */}
        {/* <div>
            <h1> Controlled visibility </h1>
            <div 
            // style={{
            //     paddingTop: '200px', 
            // }}
            
            >
                <ControlledVisibility /> 
            </div>
        
          </div> */}
        <br />
        {/* <PickerWithCustomePlaceholder onDateSelect={this.onDateSelect} /> */}
      </div>
    );
  }
}

export default App;
