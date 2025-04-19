import { request, } from './request'




// 获取国家和地区
export const GetRegionCode = async (params = {}) => {
    const data = await request.get('/AccountService/GetRegionCode/V1.0', params)

    return data
}

// 获取注册图形验证码
export const getGenRegCaptcha = async (params = {}) => {
    const data = await request.get('/CaptchaService/GenRegCaptcha/v1.0', params, {
    })
    return data
}




// 获取登录图形验证码
export const GenAuthCaptcha = async (params = {}) => {
    const data = await request.get('/CaptchaService/GenAuthCaptcha/v1.0', params)
    return data
}



/**上传图片文件，仅支持.jpg .png .pdf */
export const uploadImg = async (params: FormData) => {


    return await request.post<any>('/FileService/FileUpload/V1.0', params)
}


export const DepositLinkSite = async (params: {
    checkoutId: string,
    chargeId: string
}) => {
    const {
        checkoutId,
        chargeId
    } = params


    return await request.get<any>(`/WalletService/DepositLinkSite/v1.0/${checkoutId}/${chargeId}`)
}


