import React from 'react';
import ReactDOM from 'react-dom';

import Placeholder from './placeholder';
import Calendar from './calendar';
import {Provider} from './context';

/*
  apis ==>

   onDateSelected (function)  - 'gets called when a date/range is selected and time selected',
   onClose (function) - 'when your pressed ok/select button in footer'
   disableRange (boolean) - 'if true user can select only one single'
   selectTime (boolean) - if true time picker will show up each time a date gets selected
   rangeTillEndOfDay (boolean) - if true end(last) date of range will have time of 11:59 PM(end of day) else it will have 12:00
   selectTime(boolean) - show time picker if true after very date selection

   placeholder (function which return a React Component) - if user wants custom placeholder, placeholder function will recieve following object as param
      {startDate (date object),
      endDate (date object)}
      
   footer (function which return a React Component) - if user wants custom footer, footer will recieve following object as param
      {startDate (date object)
      endDate (date object)
      today (function) - to select today's date
      close (function) - closes the calendar and calls onClose API callback}

 */

const hiddenStyle = {
  top: '-150%'
};

class RangePicker extends React.Component {
  // 创建日历ref
  calendar_ref = React.createRef();
  // 创建弹出层ref
  popup_ref = React.createRef();
  // 日历是否受控
  // 受控组件：组件的状态由父组件控制，父组件通过props传递给子组件，子组件不能直接修改状态，只能通过props来获取和使用状态
  isVisibilityControlled = false;
  constructor(props) {
    super(props);

    // 日历是否受控组件 显示 标志控制
    this.isVisibilityControlled = typeof props.visible === 'boolean';

    this.state = {
      // 日历是否显示
      showCalendar: false,
      // 日历位置样式
      style: hiddenStyle
    };
  }

  componentDidMount() {

    
    const {current: popup} = this.popup_ref;
    // 监听鼠标点击事件，关闭日历
    // 关闭日历的条件是：点击的不是日历本身，并且日历是打开的状态
    // 鼠标按下事件
    window.addEventListener('mousedown', this.handleOutsideClick, false);

    
    // 鼠标移动事件
    popup && popup.addEventListener('mousedown', this.preventBubbling, false);

    // force upate as style in render function won't get calculated because "calendar_ref.current" was null
    // on componentDidMount "calendar_ref.current" will be available, so force rerender the component
    // to calulate the popup position
    // 强制更新组件，重新计算日历位置样式
    if (this.isVisibilityControlled) {
      this.setState({});
    }
  }

  componentWillUnmount() {
    const {current: popup} = this.popup_ref;
    // 销毁事件
    window.removeEventListener('mousedown', this.handleOutsideClick, false);
    popup &&
      popup.removeEventListener('mousedown', this.preventBubbling, false);
  }

  preventBubbling = e => {
    e.stopPropagation();
  };

  //
  handleOutsideClick = () => {
    const {closeOnOutsideClick, onClose} = this.props;
    if (closeOnOutsideClick === false) {
      return;
    }
    const {showCalendar} = this.state;

    // if calendar is hidden, return.
    if (!showCalendar) {
      return;
    }

    // if user clicked outside of the calendar then hide it
    // 关闭日历
    this.setState({
      showCalendar: false
    });

    onClose && onClose();
  };

   // 计算日历位置
  calculateCalendarPosition = isVisible => {
    const {current} = this.calendar_ref;
    if (!current || !isVisible) return hiddenStyle;
    const top = current.offsetTop;
    const left = current.offsetLeft;
    return {
      left,
      top
    };
  };

  toggleCalendar = () => {
    const {showCalendar} = this.state;
    const {onOpen, visible} = this.props;
    if (
      (this.isVisibilityControlled && !visible) ||
      (!this.isVisibilityControlled && !showCalendar)
    ) {
      onOpen && onOpen();
    }

    if (this.isVisibilityControlled) return;

    let style = this.calculateCalendarPosition(!showCalendar);
    this.setState({
      showCalendar: !showCalendar,
      style
    });
  };

  // 关闭日历
  onClose = () => {
    const {onClose} = this.props;
    this.toggleCalendar();
    onClose && onClose();
  };

  // 选择日期
  onDateSelected = (startDate, endDate) => {
    const {onDateSelected} = this.props;
    const firstDate = startDate ? startDate._date : null;
    const lastDate = endDate ? endDate._date : null;
    onDateSelected && onDateSelected(firstDate, lastDate);
  };

  render() {
    const {showCalendar} = this.state;
    const {placeholder, dateFormat, placeholderText} = this.props;
    const visible = this.isVisibilityControlled
      ? this.props.visible === true
      : showCalendar;
    const style = this.calculateCalendarPosition(visible);
    return (
      <Provider>
        <div className="date-picker-app-wrapper" ref={this.calendar_ref}>
          <div className="user-placeholder" onClick={this.toggleCalendar}>
            <Placeholder
              customPlaceholder={placeholder}
              showTime={this.props.selectTime}
              placeholder={placeholderText}
              format={dateFormat}
            />
          </div>
          {/* 日历 */}
          {PortalCreator(
            <div
              style={style}
              className={'calendar' + (visible ? ' visible' : '')}
              ref={this.popup_ref}
            >
              <Calendar
                {...this.props}
                // 选中日期
                onDateSelected={this.onDateSelected}
            
                // 日历是否显示
                isVisible={visible}
                 // 关闭日历
                onClose={this.onClose}
              />
            </div>
          )}
        </div>
      </Provider>
    );
  }
}

// 把这个节点插入到 body 中 
const PortalCreator = child => {
  let container = document.getElementById('__range-picker-container');
  if (!container) {
    container = document.createElement('div');
    container.id = '__range-picker-container';
    document.body.appendChild(container);
  }
  return ReactDOM.createPortal(child, container);
};

export default RangePicker;
