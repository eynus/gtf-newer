import request from '@/utils/request'
import { baseUrl_user } from "@/api/set.js"
// 登录接口
export const login = data => request({ url: baseUrl_user + 'api/system/loginCheck', method: 'post', data })
// 修改密码接口
export const updateUserPwd = data => request({ url: baseUrl_user + 'api/system/user/updateUserPwd', method: 'post', data })
// 获取publicKey
export const getPublicKey = data => request({ url:  baseUrl_user + 'api/system/getPublicKey', method: 'get', data })
// 获取publicKey
export const loginOut = data => request({ url:  baseUrl_user + 'api/system/loginOut', method: 'get', data })