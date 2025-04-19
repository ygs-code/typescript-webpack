import {createBrowserHistory, createMemoryHistory, createHashHistory} from "history";

let history = {};

export const getBrowserHistory = (props = {}, type) => {
  let options =
  {
    basename: "/", // 基链接
    forceRefresh: false, // 是否强制刷新整个页面
    // keyLength: 10, // location.key的长度
    //  getUserConfirmation: (message,callback) => callback(window.confirm(message)) // 跳转拦截函数
    ...props,
  };
  history = type === 'has' ? createHashHistory(options) : createBrowserHistory(options);
  return history;
};



export const getMemoryHistory = (props = {}) =>
  (history = createMemoryHistory(props));

export {history};

export const getHistory = () => {
  return history;
};
