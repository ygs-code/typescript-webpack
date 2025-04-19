import { request } from '../request'

//发送出金请求
export const postResetPassword = async (params = {}) => {
  return await request.post<any>('/AccountService/ResetPassword/v1.0', params)
}