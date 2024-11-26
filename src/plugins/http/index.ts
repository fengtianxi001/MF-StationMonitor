import axios from 'axios'
import { getToken } from '@/plugins/auth'
import { router } from '@/router'
import { message } from '@/plugins/utils/message'

export const http = axios.create({
  baseURL: '/bridge',
  timeout: 60 * 1000,
  withCredentials: true,
})

// 请求拦截器
http.interceptors.request.use(
  (config: any) => {
    config.headers['X-AUTH-TOKEN'] = getToken()
    config.headers['X-Router-Url'] = '/infoManage/bridgeManage' //'/infoManage/bridgeManage'
    config.params = config.params ?? {}
    config.params['X-TIME'] = new Date().getTime()
    return config
  },
  (error: any) => Promise.reject(error)
)

// 响应拦截器
http.interceptors.response.use(
  (response: any) => {
    const result = response.data
    if (result instanceof Blob) {
      return response.data
    }
    if (result.code === '6102') {
      console.log('请求没权限,需要退回登录页')
      message.error(result.msg)
      router.push('/Login')
      return Promise.reject(result)
    } else if (result.code !== '0000') {
      message.error(result.msg)
      return Promise.reject(result)
    }
    return result.data
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// const BuiltInErrorCatch = {

// }
export default http
