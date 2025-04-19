import { request, } from '../request'


//获取支付方式
export const getPaymentGateway = async (params = {}) => {
    return await request.get('WalletService/GetPaymentGateway/v1.0', params)
}

// 发送入金请求
export const postDeposit = async (params = {}) => {
  return await request.post('/WalletService/Deposit/V1.0', params)
}

// export const verifyToken = async () => {
//   return await request.get('/VerifyJWT/v1.0')
// }

// // 获取登录图形验证码
// export const genAuthCaptcha = async () => {
//   return await request.get<CaptchaServiceResult>('/CaptchaService/GenAuthCaptcha/v1.0')
// }

// // 发送邮箱验证码
// export const emailSendCode = async (params = {}, captcha: string) => {
//   return await request.post(`/EmailAuth/SendCode/v1.0/${captcha}`, params)
// }

// // 登录
// export const emailLogin = async (code: string) => {
//   return await request.get(`/EmailAuth/Login/v1.0/${code}`)
// }
// // 发送 邮箱 或者 手机 验证码
// export const EmailOrSmsSendCode = async (params = {}) => {
//   return await request.post('/AccountService/EmailOrSmsSendCode/V1.0', params, {})
// }

