import request from '@/utils/request'

// 登录接口
export const login = data => request({ url: '/system/loginCheck', method: 'post', data })
// 获取publicKey
export const getPublicKey = data => request({ url: '/system/getPublicKey', method: 'get', data })
