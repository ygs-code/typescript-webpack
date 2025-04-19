import axios from 'axios';
import Token from './token';
import { baseURL } from './baseURL';
import { redirects } from './redirect';
import { localStorage } from 'src/storage';
import { i18n } from '@/utils';
 
//多语言
const t = (key: string) => i18n.t(key)


import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { error } from './globalMessage';

// 定义一个常见后端请求返回
export type BoStdReply<T> = {
  success: boolean;
  code: number;
  error?: string;
  objRef?: string;
  resultObj?: T;
};

// 拓展 axios 请求配置，加入我们自己的配置
interface RequestOptions {
  // 是否全局展示请求 错误信息
  globalErrorMessage?: boolean;
  // 是否全局展示请求 成功信息
  globalSuccessMessage?: boolean;

  globalErrorRedirect?: boolean;
}

// 拓展自定义请求配置
interface ExpandAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  baseURL?: string;
  interceptorHooks?: InterceptorHooks;
  requestOptions?: RequestOptions;
  timeout?: number;
}

// 拓展 axios 请求配置
interface ExpandInternalAxiosRequestConfig<D = any>
  extends InternalAxiosRequestConfig<D> {
  interceptorHooks?: InterceptorHooks;
  requestOptions?: RequestOptions;
}

// 拓展 axios 返回配置
interface ExpandAxiosResponse<T = any, D = any> extends AxiosResponse<T, D> {
  config: ExpandInternalAxiosRequestConfig<D>;
}

export interface InterceptorHooks {
  requestInterceptor?: (
    config: InternalAxiosRequestConfig
  ) => Promise<InternalAxiosRequestConfig>;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (
    response: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>;
  responseInterceptorHttpCatch?: (error: any) => any;
  responseInterceptorCatch?: (error: any) => any;
}

// 导出Request类，可以用来自定义传递配置来创建实例
export default class Request {
  // axios 实例
  private _instance: AxiosInstance;
  // 默认配置
  private _defaultConfig: ExpandAxiosRequestConfig = {
    // 默认请求前缀
    // baseURL: '/api',
    // 默认超时时间
    timeout: 1000 * 60 * 5,
    requestOptions: {
      // 默认全局展示请求错误信息
      globalErrorMessage: true,
      // 默认全局展示请求成功信息
      globalSuccessMessage: true,
      // 全局重定向
      globalErrorRedirect: true,
    },
  };
  private _interceptorHooks?: InterceptorHooks;

  constructor(config: ExpandAxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this._instance = axios.create(Object.assign(this._defaultConfig, config));

    this._interceptorHooks = config.interceptorHooks;
    this.setupInterceptors();
  }

  // 通用拦截，在初始化时就进行注册和运行，对基础属性进行处理
  private setupInterceptors() {
    // 添加请求拦截器
    this._instance.interceptors.request.use(
      this._interceptorHooks?.requestInterceptor,
      this._interceptorHooks?.requestInterceptorCatch
    );

    // 添加响应拦截器
    this._instance.interceptors.response.use(
      this._interceptorHooks?.responseInterceptor,
      this._interceptorHooks?.responseInterceptorHttpCatch
    );
  }

  // 定义核心请求
  public request(config: ExpandAxiosRequestConfig): Promise<AxiosResponse> {
    // 这里直接返回，不需要我们再使用 promise 封装一层
    return this._instance.request(config);
  }

  public get<T = any>(
    url: string,
    params?: any,
    config?: ExpandAxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this._instance.get(url, {
      params,
      ...config,
    });
  }

  public post<T = any>(
    url: string,
    params?: any,
    config?: ExpandAxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this._instance.post(url, params, config);
  }

  // public delete<T = any>(
  //   url: string,
  //   params?: any,
  //   config?: ExpandAxiosRequestConfig
  // ): Promise<AxiosResponse<T>> {
  //   return this._instance.delete(url, params, config);
  // }

  public put<T = any>(
    url: string,
    params?: any,
    config?: ExpandAxiosRequestConfig
  ): Promise<T> {
    return this._instance.put(url, params, config);
  }

  public delete<T = any>(
    url: string,
    params?: any,
    config?: ExpandAxiosRequestConfig
  ): Promise<T> {
    return this._instance.delete(url, {
      params,
      ...config,
    });
  }
}

// 请求拦截器
export const transform: InterceptorHooks = {
  // 请求拦截器
  requestInterceptor: async (config: InternalAxiosRequestConfig) => {
    const token = await Token.get(config);

    // console.log('NEXT_LOCALE==', await getCookie('NEXT_LOCALE'))
    // 请求头携带token
    config.headers.set('Authorization', token ? `Bearer ${token}` : '');
    config.headers.set('Language', localStorage.getItem('language'))

    return config;
  },

  // 响应拦截器
  async responseInterceptor(result) {
    const res = result as ExpandAxiosResponse;
    // axios 返回值
    const { data, status, config } = res;
    const { requestOptions: { globalErrorMessage } = {}, url } = config;
    const {
      error: errorMsg,
      resultObj,
      code,
      ...more
    }: { error: string; resultObj: any; code: keyof typeof redirects } = data;
    // // 与后端约定的请求成功码
    const SUCCESS_CODE = 200;
    // http状态码
    if (status !== 200) {
      return Promise.reject(res);
    }

    if (code !== SUCCESS_CODE) {
      return await transform?.responseInterceptorCatch?.(result);

      // return Promise.reject(result)
    }






    if (url == '/GetJWT/v1.0') {

      Token.set(resultObj);
      // 如果有了token，就发布队列
      Token.publishQueue(resultObj);
    }

    // if (res.config.requestOptions?.globalSuccessMessage) {
    //   // 这里全局提示请求成功
    // }
    return {
      code,
      ...more,
      data: resultObj,
    };
  },

  // 请求前错误，
  requestInterceptorCatch(err) {
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(err);
  },

  // 响应 http code 错误
  responseInterceptorHttpCatch(err) {
    const { config } = err;

    // 这里用来处理 http 常见错误，进行全局提示
    const mapErrorStatus = new Map([
      [400, t('Request.WrongRequestMethod')], // 请求方式错误
      [401, t("Request.PleaseLogInAgain")], // '请重新登录'
      [403, t("Request.AccessDenied")], // 拒绝访问
      [404, t("Request.TheRequestAddressIsIncorrect")],  // 请求地址有误
      [500, t("Request.ServerError")], // 服务器错误
    ]);
    const message =
      // (err?.response?.status && mapErrorStatus.get(err?.response?.status)) ||
      (err?.response?.code && mapErrorStatus.get(err?.response?.code)) ||
      t("Request.RequestErrorPleaseTryAgainLater"); // 请求出错，请稍后再试
    // 此处全局报错
    console.error('全局报错=', message);
    error(message);
    return Promise.reject(err.response);
  },

  // 响应后业务错误
  responseInterceptorCatch(result) {
    const res = result as ExpandAxiosResponse;
    // axios 返回值
    const { data, status, config } = res;
    const {
      requestOptions: { globalErrorMessage, globalErrorRedirect } = {},
      url,
    } = config;
    const {
      error: errorMsg,
      resultObj,
      code,
      message,
      ...more
    }: { error: string; resultObj: any; message: string; code: keyof typeof redirects } = data;

    // 状态
    if (globalErrorMessage) {
      // 这里全局提示错误
      console.error('error:', errorMsg);
 


      error(t(`Service.${message}`));
    }

    if (globalErrorRedirect) {
      code && redirects[code](result);
    }

    return Promise.reject(data);
  },
};

// 具体使用时先实例一个请求对象
export const request = new Request({
  baseURL,
  // timeout: 1000 * 60 * 10,
  interceptorHooks: transform,
});

// 定义请求返回
export interface ResModel {
  str: string;
  num: number;
}
