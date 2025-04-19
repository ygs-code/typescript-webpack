import { request } from '../../request'

//获取下级客户 客户列表
export const getCustomerList = async (params = {}) => {
  return await request.get<any>('/SubordinateCustomerService/GetCustomerList/V1.0', params)
}