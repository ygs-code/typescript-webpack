import { request } from '../../request'

//获取下级客户 交易订单报表
export const getCustomerOrderDealReportList = async (params = {}) => {
  return await request.get<any>('/SubordinateCustomerService/GetCustomerOrderDealReportList/V1.0', params)
}

//获取下级客户的交易账号
export const getCustomerTradingAccountList = async (params = {}) => {
  return await request.get<any>(`/SubordinateCustomerService/GetCustomerTradingAccountList/V1.0/${params}`)
}