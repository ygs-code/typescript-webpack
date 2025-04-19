/*
 * @Author: your name
 * @Date: 2021-09-29 11:46:06
 * @LastEditTime: 2021-09-29 15:02:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/common/js/request/token.js
 */
import dayjs from "dayjs";
interface Config {
  url?: string;
}
class Token {
  options: { overtime: number };
  tokenKey: string;
  queue: Array<any>;
  doNotToken: Array<any>;
  constructor(doNotToken: string[] = [], tokenKey = "token") {
    this.options = {
      // 超时时间 x 分钟 失效
      overtime: 60 * 24 * 30,
    };
    this.tokenKey = tokenKey
    this.queue = [];
    //配置不需要token的请求
    this.doNotToken = [...doNotToken, "/GetJWT/v1.0",];
  }

  subscribeQueue({ resolve, reject }: { resolve: Function, reject: Function }) {
    this.queue.push({ resolve, reject });
  }
  publishQueue(token: String) {
    this.queue.forEach((item) => {
      const { resolve } = item;
      resolve(token);
    });
    this.queue = [];
  }
  clearQueue() {
    this.queue.forEach((item) => {
      const { reject } = item;
      reject(null);
    });
    this.queue = [];
  }
  set(value: String) {


   
    // if (process.browser && window && window.localStorage) {
    let token = JSON.stringify({
      token: value,
      time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    });




    localStorage.setItem(this.tokenKey, token);
    // }
  }


  get(config?: Config) {
    // if (process.browser && window && window.localStorage) {

    const {
      overtime,
    } = this.options
    const { url } = config || {}


    const value = localStorage.getItem(this.tokenKey);
    const { token, time } = value ? JSON.parse(value) : {};


    return new Promise((resolve, reject) => {
      if (!config) {
        return resolve(token);
      } else if (url && ~(this.doNotToken.indexOf(url))) {
        return resolve('');
      } else if (token && time && dayjs().toDate().getTime() > dayjs(time).add(overtime, 'minute').toDate().getTime()) {
        // 如果是超时了，就返回空
        this.set('')
        // this.subscribeQueue({ resolve, reject });
        return resolve('');
      }
      else if (!token) {
        this.subscribeQueue({ resolve, reject });
      }
      else {
        this.publishQueue(token)
        this.set(token)
        return resolve(token);
      }
    });
    // } else {
    //   return Promise.resolve('')
    // }
  }
}

export { Token };
export default new Token();
