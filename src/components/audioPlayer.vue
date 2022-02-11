<template>
  <div>
    <audio
      ref="audioRef"
      :autoplay="true"
      controls
      crossorigin="*"
      :src="storeState.url.value"
      :volume="storeState.volume.value"
      @loadedmetadata="loadedmetadata"
      @timeupdate="timeupdate"
      @playing="playing"
      @pause="pause"
      @ended="ended"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import useState from '@/utils/useState'
export default defineComponent({
  name: 'AUDIOPLAYER',
  setup(props, context) {
    const store = useStore()
    const audioRef = ref<any>(null)
    const storeState = useState('audioPlayer', ['volume', 'playing', 'url', 'setCurrentTime'])
    // 状态数据
    const state = reactive({
    })

    // 方法
    const methods = {
      playing() {
        store.commit('audioPlayer/PLAYING', true)
      },
      pause() {
        store.commit('audioPlayer/PLAYING', false)
      },
      ended() {
        store.commit('audioPlayer/PLAYING', false)
      },
      // 获取当前播放时间
      timeupdate(e:any) {
        const { currentTime }:any = e.target
        store.dispatch('audioPlayer/getCurrentTime', currentTime)
      },
      loadedmetadata(e:any) {
        const { target: { duration }} = e
        store.commit('audioPlayer/SET_DURATION', duration)
      },
      setPlayTime(time:number) {
        audioRef.value.currentTime = time
      },
      play() {
        audioRef.value.play()
      },
      stop() {
        audioRef.value.pause()
      }
    }
    watch(() => storeState.setCurrentTime.value, (n) => {
      nextTick(() => methods.setPlayTime(n))
    })
    watch(() => storeState.playing.value, (n) => {
      nextTick(() => n ? methods.play() : methods.stop())
    }, {
      immediate: true
    })
    // 计算属性
    const computes = {}

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...methods,
      ...computes,
      audioRef,
      storeState
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

