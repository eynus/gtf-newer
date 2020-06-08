/**
 * @Description:自定义按钮权限指令
 * @author 阮鹏卿
 * @date 2020/6/5
 */
export const authDirective =  {
  install (Vue) {
    Vue.directive('auth', {
      bind (el, binding) {
        const auths = JSON.parse(localStorage.getItem('user_auth'))
        const isAllow = isAllowed(binding.value, auths)
        if (!isAllow && binding.value) {
          el.style.display = 'none'
        }
      }
    })
  }
}

function isAllowed (_auth, auths) {
  if (typeof _auth === 'string') {
    return auths.includes(_auth)
  } else if (_auth instanceof Array) {
    return _auth.some(auth => auths.filter(item => item === auth).length !== 0)
  }
  return false
}
