/*
 * @Date: 2022-08-15 09:17:55
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-08-15 14:03:23
 * @FilePath: /react-ssr-lazy-loading/src/redux/models/home.js
 * @Description:
 */
// import {getPropsState} from "..";

export default (global) => ({
  state: {
    items: undefined,      /// getPropsState(global, "breadcrumb", "items")
  },
  reducers: {
    setBreadcrumb(state, newState) {
      return {
        ...state,
        items: newState
      };
    }
  },
  effects: {
    //   async incrementAsync(num1, rootState, num2) {
    //     /*
    //                 第二个变量rootState， 为当前model的state的值
    //                 第一个变量num1， 第三个变量num2分别， 调用incrementAsync时传递进来的第一个参数， 第二个参数，后面依次类推。
    //                 例如：dispatch.count.incrementAsync(10, 20)时，num1 = 10, num2 = 20
    //             */
    //     // await new Promise((resolve) => setTimeout(resolve, 2000));
    //     // this.increment(num1);
    //   },
    // },
    //   effects: (dispatch) => ({
    //     async incrementAsync(num1, rootState, num2) {
    //       await new Promise((resolve) => setTimeout(resolve, 2000))
    //       // 方式一
    //       // this.increment(num1);
    //       // 方式二
    //       dispatch.count.increment(num1)
    //     },
    //   }),
  }
});
