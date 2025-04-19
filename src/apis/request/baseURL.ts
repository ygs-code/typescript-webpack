let {
    NODE_ENV, // 环境参数
    WEB_ENV, // 环境参数
    DOMAIN_NAME,
    DOMAIN_MIDDLE,
} = process.env // 环境参数

//    是否是生产环境
const isEnvProduction = NODE_ENV === 'production'
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === 'development'


export const baseURL = isEnvProduction ? DOMAIN_NAME + DOMAIN_MIDDLE : DOMAIN_MIDDLE;

console.log('DOMAIN_NAME:',DOMAIN_NAME)
console.log('DOMAIN_MIDDLE:',DOMAIN_MIDDLE)
console.log('baseURL:',baseURL)

 