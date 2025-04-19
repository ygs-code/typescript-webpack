import { request } from '../request'

//获取出入金报表
export const getDepositWithdrawalReport = async (params = {}) => {
  return await request.get<any>('/ReportService/GetDepositWithdrawalReport/V1.0', params)
}