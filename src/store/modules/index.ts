import { keysObject } from '@/utils/types'
import Cookie from 'js-cookie'

export default {
  namespaced: true,
  state: {
    useGradualColor: true
  },
  mutations: {
    IS_USE_GRADUAL_COLOR(state: keysObject, data: boolean) {
      state.useGradualColor = data
    }
  },
  actions: {}
}
