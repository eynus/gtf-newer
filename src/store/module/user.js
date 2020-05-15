import { login } from '@/api/user/user'
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
      console.log('userInfo', userInfo);

      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    //保存用户信息
    setUserPower(state, userPower) {
      state.userPower = userPower
      localStorage.setItem('userPower', JSON.stringify(userPower))
    },
    //保存用户权限
    setRole(state, role) {
      state.role = role
      console.log(state.role, 'this is role');

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
    handleLogin({ commit }, { username, password, kaptcha, publicKey, type }) {

      return new Promise((resolve, reject) => {
        login({ kaptcha, username, password, publicKey, type })
          .then(res => {
            const { code, data } = res.data;
            if (code === 1000) {
              let authList = data.userPower.map((item, index) => {
                let list = []
                if(item.childs&&item.childs.length){
                  list = item.childs.map((item,index)=>item.resIdentif)
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
              resolve(data.userInfo.realName)
            } else {
              reject(data)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 退出登录
    handleLogOut({ commit }) {
      return new Promise(resolve => {
        commit('setUserInfo', {})
        commit('setUserPower', [])
        commit('setRole', '')
        commit('removeToken')
        resolve()
      })
    }









  }
}
