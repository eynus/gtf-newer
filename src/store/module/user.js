import { login, loginOut } from '@/api/user/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

export default {
  state: {
    token: getToken(),
    userInfo: JSON.parse(localStorage.getItem('userInfo')),
    userPower: JSON.parse(localStorage.getItem('userPower')),
    role: JSON.parse(localStorage.getItem('role'))
  },
  mutations: {
    //保存用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo

      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    //保存用户信息
    setUserPower(state, userPower) {
      const handleAuth = (userPower) => {
        let arr = []
        userPower.forEach(item => {
          arr.push(item.resIdentif)
          if (item.childs.length) {
            let res = handleAuth(item.childs)
            arr = arr.concat(res)
          }
        })
        return arr
      }
      state.userPower = userPower
      let userAuth = handleAuth(userPower)
      localStorage.setItem('user_auth', JSON.stringify(userAuth))
      localStorage.setItem('userPower', JSON.stringify(userPower))
    },
    //保存用户权限
    setRole(state, role) {
      state.role = role
      localStorage.setItem('role', JSON.stringify(role))
    },
    //保存token
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    }

  },
  getters: {
    // userName: state => state.userName,
    role: state => state.role
  },
  actions: {
    // 登录-设置和保存用户基本信息
    handleLogin({ commit, state }, { username, password, kaptcha, publicKey, type }) {

      return new Promise((resolve, reject) => {
        login({ kaptcha, username, password, publicKey, type })
          .then(res => {
            const { code, data, message } = res.data;
            if (code === 1000) {
              let authList = data.userPower.map((item, index) => {
                let list = []
                if (item.childs && item.childs.length) {
                  list = item.childs.map((item, index) => item.resIdentif)
                }
                return {
                  resIdentif: item.resIdentif,
                  // id: item.pkId,
                  childs: list
                }
              })
              commit('setUserInfo', data.userInfo)
              commit('setUserPower', data.userPower)
              commit('setRole', authList)
              commit('setToken', data.token)
              resolve()
            } else if (code === 1013) {
              resolve('init')//需要重置密码
            } else {
              reject([message, 'user'])
            }
          })
          .catch(err => {
            reject([err, 'server'])
          })
      })
    },
    // 退出登录
    handleLogOut({ commit }) {
      return new Promise(resolve => {

        loginOut()
          .then(res => {
            const { code, data, message } = res.data;
            if (code === 1000) {
              commit('setUserInfo', {})
              commit('setUserPower', [])
              commit('setRole', '')
              commit('removeToken')
              resolve()
            } else {
              reject([message])
            }
          })
          .catch(err => {
            reject([err, 'server'])
          })
      })
    }
  }
}
