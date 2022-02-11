export default {
  namespaced: true,
  state: {
    currentTime: <number|string>0,
    setCurrentTime: <number|string>0,
    duration: <number>0,
    volume: <number>1, // 音量控制
    playing: <boolean>false, // 是否在播放
    url: <string>'', // 歌曲地址
    songInfo: <object>{} // 歌曲信息
  },
  mutations: {
    // 获取音频的当前播放时间
    GET_TIME(state:any, time:number) {
      state.currentTime = time
    },
    // 设置音频的播放时间
    SET_TIME(state:any, time:number) {
      state.setCurrentTime = time
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
    },
    // 设置音频地址
    SET_URL(state:any, url:string) {
      state.url = url
    },
    // 歌曲信息
    SET_SONG(state:any, song:object) {
      state.songInfo = song
    }
  },
  actions: {
    // 同步当前播放时间
    getCurrentTime({ commit }:any, time:number):void {
      commit('GET_TIME', time)
    },
    // 设置当前播放时间
    setCurrentTime({ commit }:any, time:number):void {
      commit('SET_TIME', time)
    },
    songInfo({ commit }:any, song:object) {
      commit('SET_SONG', song)
    }
  },
  getters: {}
}
