import React from 'react';

// 日历上下文
const Context = React.createContext({});

export class Provider extends React.Component {
  state = {
    // 今天
    today: new Date(),
    // 开始日期
    startDate: undefined,
    // 结束日期
    endDate: undefined,
    // 开始时间
    // startTime: undefined,
    // // 结束时间
    // endTime: undefined
  };
  // 更新上下文
  updateContext = partialState => {
    this.setState({...this.state, ...partialState});
  };
  render() {
    // 传递给子组件的上下文
    return (
      <Context.Provider
        value={{...this.state, updateContext: this.updateContext}}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Context;
