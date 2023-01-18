import { createStore } from 'vuex'
import audioPlayer from './modules/audioPlayer'
import user from './modules/user'
import localData from './modules/local-data'
export default createStore({
  modules: {
    audioPlayer,
    user,
    localData
  }
})
