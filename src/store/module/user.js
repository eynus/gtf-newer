import { login } from '@/api/user'
// import { setToken, getToken, removeToken } from '@/utils/util'

export default {
  state: {
    userName: localStorage.getItem('userName'),
    userId: localStorage.getItem('userId'),
    // token: getToken(),
    role: JSON.parse(localStorage.getItem('role')) || [],
    moblie: localStorage.getItem('moblie'),
  },
  mutations: {
    setUserName(state, name) {
      state.userName = name
      localStorage.setItem('userName', name)
    },
    setUserId(state, userId) {
      state.userId = userId
      localStorage.setItem('userId', userId)
    },
    setRole(state, role) {
      state.role = role
      localStorage.setItem('role', JSON.stringify(role))
    },
    // setToken (state, token) {
    //   state.token = token
    //   setToken(token)
    // },
    setMoblie(state, moblie) {
      state.moblie = moblie
      localStorage.setItem('moblie', moblie)
    },

    // removeToken () {
    //   state.token = ''
    //   removeToken()
    // }
  },
  getters: {
    userName: state => state.userName,
    role: state => state.role
  },
  actions: {
    // 登录
    handleLogin({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({ userName, password })
          .then(res => {
            const result = res.data.data[0]
            if (result.success === '1') {
              // commit('setToken', result.data.token)
              commit('setMoblie', userName)
              commit('setUserName', result.data.user.userName)
              commit('setUserId', result.data.user.userId)
              commit('setRole', [result.data.user.id])
              resolve(result.data.user.id)
              // }
            } else {
              let message = result.message
              reject(message)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise(resolve => {
        console.log(state)
        // commit('setToken', '')
        commit('setMoblie', '')
        commit('setUserName', '')
        commit('setUserId', '')
        commit('setRole', '')
        // removeToken()
        resolve()
      })
    }
  }
}
