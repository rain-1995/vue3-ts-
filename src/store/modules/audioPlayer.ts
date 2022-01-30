export default {
  namespaced: true,
  state: {
    currentTime: <number|string>0,
    duration: <number>0
  },
  mutations: {
    UPDATE_TIME(state:any, time:number) {
      state.currentTime = time
    },
    SET_DURATION(state:any, time:number) {
      state.duration = time
    }
  },
  actions: {
    // 同步当前播放时间
    updateCurrentTime({ commit }:any, time:number):void {
      commit('UPDATE_TIME', time)
    }
  },
  getters: {}
}
