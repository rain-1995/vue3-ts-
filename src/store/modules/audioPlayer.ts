export default {
  namespaced: true,
  state: {
    currentTime: <number|string>0,
    duration: <number>0,
    volume: <number>1, // 音量控制
    playing: <boolean>true // 是否在播放
  },
  mutations: {
    // 音频的当前播放时间
    UPDATE_TIME(state:any, time:number) {
      state.currentTime = time
    },
    // 音频时长
    SET_DURATION(state:any, time:number) {
      state.duration = time
    },
    // 设置音量
    SET_VOLUME(state:any, volume:number) {
      state.volume = volume
    },
    // 控制播放暂停
    PLAYING(state:any, val:boolean) {
      state.playing = val
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
