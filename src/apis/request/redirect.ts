
import Token from "./token";
import { getHistory } from "src/router/history";

 


// src/router/history.js

// import store, { actions, dispatch, useSelector } from "src/redux/index";

const Codes = {
    401: '请重新登录',
    404: '请求地址有误',
}


const redirects = {
    200: () => { },
    400: (result: any) => {
        // 清楚token
        // Token.set('')
        // getHistory().push('/login')
    },
    401: (result: any) => {
        // 清楚token
        Token.set('')
        getHistory().push('/login')
    },
    404: (result: any) => {
        console.log('redirects 404')
    },

    503: (result: any) => {
        console.log('redirects 503')
    }
}


export {
    Codes,
    redirects
}