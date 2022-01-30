import { createStore } from 'vuex'
import audioPlayer from './modules/audioPlayer'
export default createStore({
  modules: {
    audioPlayer
  }
})
