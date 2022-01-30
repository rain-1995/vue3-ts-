<template>
  <div>
    <audio
      ref="audioRef"
      autoplay
      controls
      crossorigin="*"
      :src="url"
      @loadedmetadata="loadedmetadata"
      @timeupdate="timeupdate"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'AUDIOPLAYER',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const store = useStore()
    const audioRef = ref<any>(null)
    // 状态数据
    const state = reactive({})

    // 方法
    const methods = {
      // 获取当前播放时间
      timeupdate(e:any) {
        const { currentTime }:any = e.target
        store.dispatch('audioPlayer/updateCurrentTime', currentTime)
      },
      loadedmetadata(e:any) {
        const { target: { duration }} = e
        store.commit('audioPlayer/SET_DURATION', duration)
      },
      setPlayTime(time:number) {
        audioRef.value.currentTime = time
      }
    }

    // 计算属性
    const computes = {}

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...methods,
      ...computes,
      audioRef
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

