import { request } from '../request'

//发送出金请求
export const createMT5Account = async (params = {}) => {
  return await request.post<any>('/AccountService/CreateMT5Account/V1.0', params)
}