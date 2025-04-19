import { request } from '../../request'

//获取下级客户 出入金报表
export const getCustomerDepositWithdrawalReportList = async (params = {}) => {
  return await request.get<any>('/SubordinateCustomerService/GetCustomerDepositWithdrawalReportList/V1.0', params)
}
