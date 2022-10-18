import { keysObject } from '@/utils/types'
import Cookie from 'js-cookie'
export default {
  namespaced: true,
  state: {
    userInfo: (Cookie.get('user-info') && JSON.parse(<string>Cookie.get('user-info'))) || <object>{}
  },
  mutations: {
    SET_USERINFO(state:keysObject, info:object) {
      state.userInfo = info
    }
  },
  actions: {
    userInfo({ commit }:keysObject, info:object) {
      commit('SET_USERINFO', info)
      Cookie.set('user-info', JSON.stringify(info))
    }
  },
  getters: {}
}
