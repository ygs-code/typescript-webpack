/*
 * @Date: 2022-08-04 09:21:17
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-08-16 19:12:21
 * @FilePath: /react-ssr-lazy-loading/src/index.js
 * @Description:
 */
import store from "@/redux/Store.js";

import {getBrowserHistory} from "src/router/history";

import routesComponent from "src/router/routesComponent";
import React from "react";
import {createRoot, hydrateRoot} from "react-dom/client";

import App from "./App/index.js";

// 如果是开发环境 先拷贝 服务器文件到 dist
let {
  RENDER // 环境参数
} = process.env; // 环境参数

const isSsr = RENDER === "ssr";

const renderApp = (App) => {
  const history = getBrowserHistory();

  if (isSsr && !module.hot) {
    return hydrateRoot(
      document.getElementById("root"),
      <App
        {...{
          history,
          store,
          routesComponent
        }}
      />
    );
  } else {
    const $root = createRoot(document.getElementById("root"));
    $root.render(
      <App
        {...{
          history,
          store,
          routesComponent
        }}
      />
    );

    return $root;
  }
};

// node 服务器中只能在这个页面使用window
window.main = () => {
  // preloadReady().then(() => {
  window.$root = renderApp(App);
  // });
};

 
// 监听热更新
if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error('Cannot apply hot update.', err);
    }
  });
  if (window.$root) {
    let App = require('./App').default;

    renderApp(App);
  }
}


// if (module.hot) {
//   // accept 函数的第一个参数指出当前文件接受哪些子模块的替换，这里表示只接受 ./AppComponent 这个子模块
//   // 第2个参数用于在新的子模块加载完毕后需要执行的逻辑
//   module.hot.accept(
//     // ["./App/index.js"],
//     () => {
//       console.log("有个模块更新");
//       // 新的 AppComponent 加载成功后重新执行下组建渲染逻辑
//       // let App = require('./App').default;
//       // renderApp(App);
//       //   ReactDOM.render(<App />, document.getElementById('root'));
//     });
// }

// window.store = store;

