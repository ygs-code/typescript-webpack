import { request } from '../request'

// 获取手机号信息
export const getRegionCode = async () => {
    return await request.get('/AccountService/GetRegionCode/V1.0')
}


/**上传图片文件，仅支持.jpg .png .pdf */
export const postFileUpload = async (params: FormData) => {
    return await request.post<any>('/FileService/FileUpload/V1.0', params)
}

// 实名认证
export const realNameAuthentication = async (params: any) => {
    return await request.post<any>('/AccountService/RealNameAuthentication/V1.0', params)
}

// 更新账户信息 手机号 邮箱
export const updateAccountAuthInfo = async (params: any) => {
    return await request.post<any>('/AccountService/UpdateAccountAuthInfo/V1.0', params)
}

// 获取账号信息
export const GetRegistration = async (params = {}, options = {}) => {
    return await request.get('/AccountService/GetRegistration/v1.0', params, options)
  }