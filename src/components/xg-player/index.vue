<template>
  <div id="player" />
</template>

<script lang="ts" setup>
import { ref, onMounted, withDefaults, defineProps, nextTick, defineEmits, defineExpose } from 'vue'
import XGPlayer from 'xgplayer'

type propType = {
    url?: string,
    poster?: string,
    autoplay?: boolean,
    volume?: number,
    ignores?: any[],
    controls?: boolean
}

const props = withDefaults(defineProps<propType>(), {
  url: '',
  poster: '',
  autoplay: true,
  volume: 1,
  ignores: () => ([]),
  controls: true
})

const emit = defineEmits(['on-play', 'on-pause', 'on-timeupdate', 'on-waiting', 'on-ended', 'on-canplay'])

defineExpose({ play, pause, replay })

const player = ref()

// 初始化播放器
function initPlayer() {
  player.value = new XGPlayer({
    id: 'player',
    url: props.url,
    fluid: true, // 是否开启流式布局，宽度=父元素的宽，高度自适应
    'x5-video-player-type': 'h5',
    playsinline: true,
    controls: props.controls,
    autoplay: props.autoplay,
    volume: props.volume, // 音量
    poster: props.poster, // 封面
    ignores: props.ignores // 关闭播放器内置组件集合
  })
  props.autoplay && autoPlay()
  registerEvents()
}

// 注册播放器事件监听
function registerEvents() {
  player.value.on('play', () => emit('on-play'))
  player.value.on('pause', () => emit('on-pause'))
  player.value.on('timeupdate', () => emit('on-timeupdate'))
  player.value.on('waiting', () => emit('on-waiting'))
  player.value.on('ended', () => emit('on-ended'))
  player.value.on('canplay', () => emit('on-canplay'))
}

// 自动播放
function autoPlay() {
  player.value.once('ready', () => {
    nextTick(() => {
      const video = document.querySelector('#player video') as HTMLVideoElement
      video && (video.muted = true)
      play()
      nextTick(() => {
        setTimeout(() => {
          video && (video.muted = false)
        }, 500)
      })
    })
  })
}

function play() {
  player.value.play()
}

function pause() {
  player.value.pause()
}

function destroy() {
  player.value.destroy()
}

function replay() {
  player.value.replay()
}

onMounted(() => {
  initPlayer()
})
</script>

<style lang="scss" rel="stylesheet/scss" >
#player{
  .xgplayer-start{
    display: none !important;
  }
}
</style>
