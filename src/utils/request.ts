import axios from 'axios'
import qs from 'qs'
import { paramsModel } from './types'
import { Toast } from 'vant'
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 30000,
})
http.interceptors.request.use(config => {
  return config
}, err => {
  Promise.reject(err)
})
http.interceptors.response.use(res => {
  const { data } = res
  if (data.code !== 200) {
    Toast(data.msg || data.message)
    return Promise.reject(data)
  }
  return Promise.resolve(data)
}, err => {
  const { data } = err.response
  Toast(data.msg || data.message)
  return Promise.reject(err.response)
})
const request:paramsModel = (method = 'get', url = '', data = {}):object => {
  const dataMap = {
    'post': { data: qs.stringify(data) },
    'get': { params: data }
  }
  url = method === 'post' ? `${url}?timestamp=${new Date().getTime()}` : url
  return http({
    withCredentials: true,
    method,
    url,
    ...dataMap[<keyof typeof dataMap>method]
  } as object)
    .then((res) => {
      return Promise.resolve(res)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}
export default request
