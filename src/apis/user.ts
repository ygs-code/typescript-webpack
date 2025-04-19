import { request, } from './request'
import { CaptchaServiceResult, IsUserIdExist, IsUserIdExistResult } from './user.d'

// 获取token
export const getToken = async () => {
  return await request.get('/GetJWT/v1.0')
}

export const verifyToken = async () => {
  return await request.get('/VerifyJWT/v1.0')
}

// 获取登录图形验证码
export const genAuthCaptcha = async () => {
  return await request.get<CaptchaServiceResult>('/CaptchaService/GenAuthCaptcha/v1.0')
}

// 校验邮箱是否已注册
export const isUserIdExist = async (params: IsUserIdExist) => {
  return await request.post<IsUserIdExistResult>('/EmailAuth/IsUserIDExist/v1.0', params, {})
}

// 发送邮箱验证码
export const emailSendCode = async (params = {}, captcha: string) => {
  return await request.post(`/EmailAuth/SendCode/v1.0/${captcha}`, params)
}

// 登录
export const emailLogin = async (code: string) => {
  return await request.get(`/EmailAuth/Login/v1.0/${code}`)
}

 


 







// export const getToken = async (params = {}) => {
//   // return new Promise((resolve, reject) => {
//   //     setTimeout(async () => {
//   //         resolve(await request.get('/GetJWT/v1.0', {}, {}))
//   //         // request.get('/GetJWT/v1.0', {}, {})
//   //     }, 1000)
//   // })
//   return await request.get('/GetJWT/v1.0', {}, {})
// }

// 发送 邮箱 或者 手机 验证码
export const EmailOrSmsSendCode = async (params = {}) => {
  return await request.post('/AccountService/EmailOrSmsSendCode/V1.0', params, {})
}



// 注册用户
export const Register = async (params = {}) => {
  return await request.post('/AccountService/Register/V1.0', params, {})
}


// 登录
export const Login = async (params = {}) => {
  return await request.post('/AccountService/Login/V1.0', params, {})
}



// 检查账号是否存在
export const CheckAccountExists = async (params = {}) => {
  return await request.post('/AccountService/CheckAccountExists/v1.0', params, {})
}

// 重置密码
export const UpsertPassword = async (params = {}) => {
  return await request.post('/AccountService/UpsertPassword/v1.0', params, {})
}


// 获取账号信息
export const GetAccountInfo = async (params = {}, options = {}) => {
  return await request.get('/AccountService/GetAccountInfo/v1.0', params, options)
}


// 提交实名验证
export const RealNameAuthentication = async (params = {}, options = {}) => {
  return await request.post('/AccountService/RealNameAuthentication/V1.0', params, options)
}



// 身份证居住地
export const GetRegionResidence = async (params = {}, options = {}) => {

  return await request.get('/AccountService/GetRegionResidence/V1.0', params, options)
}

 
 


// 获取用户信息
export const GetUserInfo = async (params = {}, options = {}) => {
  return await request.get('/AccountService/GetUserInfo/v1.0', params, options)
}
