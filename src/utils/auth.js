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
 * 权鉴
 * @param {*} name 即将跳转的路由
 * @param {*} roles 用户权限 1,2,3
 * @param {*} routes 路由列表 this.$router [{name:'xx',children:[{..}]},{name:'xx'},children:[{...}]]
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, roles, routes) => {
  const routePermissionJudge = list => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(roles, item)
      }
    })
  }
  return routePermissionJudge(routes)
}
/**
 * @param {*} roles 用户权限 1,2,3
 * @param {*} route 路由列表
 */
const hasAccess = (roles, route) => {
  if (route.meta && route.meta.roles) return hasOneOf(roles, route.meta.roles)
  else return true
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}
