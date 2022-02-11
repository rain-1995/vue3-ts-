import axios from 'axios'
import qs from 'qs'
import { paramsModel } from './types'
import { Toast } from 'vant'
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
  if (data.code !== 200) {
    Toast(data.msg)
    return Promise.reject(data)
  }
  return Promise.resolve(data)
}, err => {
  Toast(`请求失败,${err.response.status}${err.response.data.msg}`)
  return Promise.reject(err.response)
})
const request:paramsModel = (method = 'get', url = '', data = {}):object => {
  const dataMap = {
    'post': { data: qs.stringify(data) },
    'get': { params: data }
  }
  return http({
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
