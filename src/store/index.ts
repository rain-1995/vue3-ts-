import { createStore } from 'vuex'
import audioPlayer from './modules/audioPlayer'
import user from './modules/user'
export default createStore({
  modules: {
    audioPlayer,
    user
  }
})
