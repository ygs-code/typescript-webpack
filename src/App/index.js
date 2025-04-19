/*
 * @Date: 2022-08-05 09:22:30
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-08-16 19:07:47
 * @FilePath: /react-ssr-lazy-loading/src/App/App.js
 * @Description:
 */
// import "antd/dist/antd.css";
import "./index.scss";
// import "./index.css";
import "src/assets/css/base.scss";
// import "src/assets/css/tailwind.scss";


import {ConfigProvider} from "antd";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import Routers from "src/router";
import React, {Component} from "react";
import {Provider} from "react-redux";
import {getToken} from "@/apis";
import {token} from "@/apis/request";
import {I18nextProvider} from 'react-i18next';
import {i18n} from '@/utils';
import RoutesComponentProvider from "src/router/RoutesComponentProvider.js";
import {LanguageProvider} from '@/components/Language';
 
 





// import 'tailwindcss/tailwind.css';
// let {
//   NODE_ENV, // 环境参数
//   HTML_WEBPACK_PLUGIN_OPTIONS = ""
// } = process.env; // 环境参数





class Index extends Component {
  componentDidMount() {


    token.get().then((value) => {
      if (!value) {
        getToken();
      }
    });




  }
  render() {
    const {history, store, routesComponent,} = this.props;
  

    const defaultData = {
      borderRadius: 4,
      colorPrimary: '#D4A767',
    };


 
    /*
  Warning: Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.
  来自Provider组件
  */
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: defaultData.colorPrimary,
                  borderRadius: defaultData.borderRadius,
                  // colorPrimary: '#00b96b',
                  //  colorBgTrigger: '#ff4d4f'
                },
                // components: {
                //   Button: {
                //     colorPrimary: data.Button?.colorPrimary,
                //     algorithm: data.Button?.algorithm,
                //   },
                // },
              }}

            >
              <RoutesComponentProvider value={routesComponent}>
                <Routers
                  level={1}
                  history={history}
                // routesComponent={routesComponent}
                />
              </RoutesComponentProvider>


            </ConfigProvider>
          </LanguageProvider>
        </I18nextProvider>
      </Provider>
    );
  }
  componentDidCatch(error, info) {
    console.error("Error：", error);
    console.error("错误发生的文件栈：", info.componentStack);
  }
}

// Index.propTypes = {
//     location: PropTypes.string,
//     store: PropTypes.object,
//     history: PropTypes.object,
//     dispatch: PropTypes.func,
//     state: PropTypes.object,
// };
// 映射 state 到 props


export default (Index);
