import { request } from '../request'

//获取交易订单报表
export const getOrderDealReport = async (params = {}) => {
  return await request.get<any>('/ReportService/GetOrderDealReport/V1.0', params)
}