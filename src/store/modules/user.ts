import { keysObject } from '@/utils/types'
export default {
  namespaced: true,
  state: {
    userInfo: <object>{}
  },
  mutations: {
    SET_USERINFO(state:keysObject, info:object) {
      state.userInfo = info
    }
  },
  actions: {
    userInfo({ commit }:keysObject, info:object) {
      commit('SET_USERINFO', info)
    }
  },
  getters: {}
}
