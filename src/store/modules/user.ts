import { keysObject } from '@/utils/types'
import Cookie from 'js-cookie'
import api from '@/api'
export default {
  namespaced: true,
  state: {
    userInfo: (Cookie.get('user-info') && JSON.parse(<string>Cookie.get('user-info'))) || <object>{},
  },
  mutations: {
    SET_USERINFO(state:keysObject, info:object) {
      state.userInfo = info
    }
  },
  actions: {
    // 设置用户信息
    userInfo({ commit }:keysObject, info:object) {
      commit('SET_USERINFO', info)
      Cookie.set('user-info', JSON.stringify(info))
    },
    // 获取用户账号信息
    async getUserInfo() {
      try {
        const result = await api.accountInfo()
        return Promise.resolve(result)
      } catch (error) {
        console.log(error, 'error')
      }
    },
    // 获取用户账号信息
    async loginStatus() {
      try {
        const result = await api.loginStatus()
        return Promise.resolve(result)
      } catch (error) {
        console.log(error, 'error')
      }
    },
    // 获取用户详情
    async userDetail({ commit }:keysObject, user: { userId: number }) {
      try {
        const result = await api.userDetail({ uid: user.userId })
        return Promise.resolve(result)
      } catch (error) {
        console.log(error, 'error')
      }
    },
    // 退出登录
    async logout({ commit }:keysObject) {
      try {
        await api.logout()
        Cookie.remove('user-info')
        commit('SET_USERINFO', {})
        return Promise.resolve(true)
      } catch (error) {
        console.log(error, 'error')
      }
    }
  },
  getters: {}
}
