import { request } from '../request'

// 发送出金请求
export const postWithdrawal = async (params = {}) => {
  return await request.post('/WalletService/Withdrawal/v1.0', params)
}

// 获取银行卡钱包信息
export const getCreditCardsWallets = async (params = {}) => {
  return await request.get('/WalletService/GetCreditCardsWallets/V1.0', params)
}

// 获取交易账号可取金额信息
export const getAmountAvailable = async (params = {}) => {
  return await request.get('/WalletService/GetAmountAvailable/V1.0', params)
}