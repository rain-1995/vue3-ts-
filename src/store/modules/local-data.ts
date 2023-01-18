import { keysObject } from '@/utils/types'
import Cookie from 'js-cookie'

export default {
  namespaced: true,
  state: {
    history: Cookie.get('h-key') ? JSON.parse(<string>Cookie.get('h-key')) : [] as []
  },
  mutations: {
    UPDATE_HISTORY(state: keysObject, { data = [], type }: {data: [], type: string}) {
      if (type == 'update') {
        state.history = [...state.history, ...data]
        state.history = state.history.length > 10 ? state.history.slice(0, 10) : state.history
        Cookie.set('h-key', JSON.stringify(state.history))
      } else if (type == 'delete') {
        state.history = []
        Cookie.set('h-key', JSON.stringify(state.history))
      }
    }
  },
  actions: {}
}
