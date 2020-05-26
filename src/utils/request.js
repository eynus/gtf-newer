import axios from 'axios'
import { getToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'
// import config from '@/config'

// create an axios instance
const service = axios.create({
  // baseURL:'lsp/api/', // api 的 base_url
  // baseURL:config.baseUrl.dev + 'lsp/api/', // api 的 base_url
  timeout: 500000 // request timeout
})


// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    config.headers['token'] = getToken()
    config.headers['uuid'] = Cookies.get('uuid')
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    let res = response.data
    if (res.code === '211') {
      removeToken('token')
      location.reload()
    }
    return response
  },
  error => {
    console.log('err' + error) // for debug
    /* Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    }) */
    return Promise.reject(error)
  }
)

export default service
