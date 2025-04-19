import { request } from '../request'

//获取银行卡信息
export const getBanks = async () => {
  return await request.get<any>('/WalletService/GetBanks/V1.0')
}

//获取支付链信息
export const getPaymentChain  = async () => {
  return await request.get<any>('/WalletService/GetPaymentChain/V1.0')
}

// 获取银行卡钱包信息
export const getCreditCardsWallets = async (params = {}) => {
  return await request.get('/WalletService/GetCreditCardsWallets/V1.0', params)
}

//新增银行卡
export const postBindBankCard = async (params = {}) => {
  return await request.post<any>('/WalletService/BindBankCard/V1.0', params)
}

//新增钱包地址
export const postBindWalletAddr = async (params = {}) => {
  return await request.post<any>('/WalletService/BindWalletAddr/V1.0', params)
}

//删除银行卡
export const deleteBankCard = async (cardNum: string) => {
  return await request.delete<any>(`/WalletService/DeleteBankCard/V1.0/${cardNum}`)
}

//删除钱包地址
export const deleteWalletAddr = async (walletAddr: string) => {
  return await request.delete<any>(`/WalletService/DeleteWalletAddr/V1.0/${walletAddr}`)
}


