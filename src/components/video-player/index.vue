<template>
  <video
    ref="player"
    class="video"
    :src="props.url"
    playsinline="true"
    x5-video-player-type="h5"
    :controls="props.controls"
    :autoplay="props.autoplay"
    :muted="props.muted"
    @play="emit('on-play')"
    @pause="emit('on-pause')"
    @ended="emit('on-ended')"
    @canplay="emit('on-canplay')"
    @timeupdate="(e) => emit('on-timeupdate', e)"
  />
</template>
  
<script lang="ts" setup>
import { ref, withDefaults, defineProps, nextTick, defineEmits, defineExpose } from 'vue'
  
type propType = {
  url?: string,
  poster?: string,
  autoplay?: boolean,
  muted?: boolean,
  controls?: boolean
}
  
const props = withDefaults(defineProps<propType>(), {
  url: '',
  poster: '',
  autoplay: true,
  muted: false,
  controls: true
})
  
const emit = defineEmits(['on-play', 'on-pause', 'on-timeupdate', 'on-ended', 'on-canplay'])
  
defineExpose({ play, pause, autoPlay })
  
const player = ref()
  
// 自动播放
function autoPlay() {
  player.value.muted = true
  nextTick(() => {
    play()
    nextTick(() => {
      setTimeout(() => {
        player.value.muted = false
      }, 500)
    })
  })
}
  
function play() {
  player.value && player.value.play()
}
  
function pause() {
  player.value && player.value.pause()
}
     
</script>
  
<style lang="scss" rel="stylesheet/scss" scoped>
.video{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
  
