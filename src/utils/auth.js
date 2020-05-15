import Cookies from 'js-cookie'

const TokenKey = 'token'
/**
 * 获取token
 */
export function getToken() {
  return Cookies.get(TokenKey)
}
/**
 * 设置token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
/**
 * 删除token
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}


/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
// export const hasOneOf = (targetarr, arr) => {
//   return targetarr.some(_ => arr.indexOf(_) > -1)
// }
