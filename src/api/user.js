import request from '@/utils/request'

/* 问题点列表 */
export const login = data => request({ url: '/system/loginCheck', method: 'post', data })
// 获取publicKey
export const getPublicKey = data => request({ url: '/system/getPublicKey', method: 'get', data })
// 获取验证码
export const getGenerationVerificationCode = data => request({ url: '/system/getGenerationVerificationCode', method: 'post', data })
