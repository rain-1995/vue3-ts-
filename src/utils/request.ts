import axios from 'axios'
import qs from 'qs'
import { paramsModel } from './types'
import { Toast } from 'vant'
import { keysObject } from '@/utils/types'
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 30000
})
http.interceptors.request.use(config => {
  return config
}, err => {
  Promise.reject(err)
})
http.interceptors.response.use(res => {
  const { data } = res
  console.log(data, 'data')
  if (data.code !== 200) {
    return Promise.reject(data)
  }
  return Promise.resolve(data)
}, err => {
  const { data } = err.response
  Toast(data.msg || data.message)
  return Promise.reject(err.response)
})
/**
 *
 * @param method 请求方式
 * @param url 请求地址
 * @param data 请求数据
 * @param options 配置参数
 * @returns promise
 */
const request:paramsModel = (method = 'get', url = '', data = {}, options:keysObject = {}):object => {
  const dataMap = {
    'post': { data: qs.stringify(data) },
    'get': { params: data }
  }
  url = `${url}?timestamp=${new Date().getTime()}`
  return http({
    withCredentials: true,
    method,
    url,
    ...dataMap[<keyof typeof dataMap>method]
  } as object)
    .then((res) => {
      console.log(res, 'resolve')
      return Promise.resolve(res)
    })
    .catch((err) => {
      console.log(err, 'reject')
      const { message = true, resolve = false } = options
      message && Toast(err.msg || err.message)
      if (resolve) {
        return Promise.resolve(err)
      }
      return Promise.reject(err)
    })
}
export default request
