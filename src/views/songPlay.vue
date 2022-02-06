<template>
  <div class="play_page">
    <div class="bg_url" :style="{'background-image':`url(${songInfo.al?.picUrl})`}" />
    <div class="song_info">
      <span class="song_name">{{ songInfo.name }}</span>
      <span class="name">{{ songInfo.raps }}</span>
    </div>
    <div class="volume">
      <svg-icon icon-class="volume" class="icon" />
      <Progress
        :percent="volumePercent"
        bar-width="250"
        @setVal="setVolume"
      />
    </div>
    <div class="lrc_box">
      <div ref="lrcRef" class="lrc_content">
        <p v-for="(item, index) in lrc" :key="index" :data-line-index="index" class="line" :class="[currentRow == index?'on':'']">
          <span>{{ item.txt }}</span>
        </p>
      </div>
    </div>
    <div class="controls">
      <div class="progress_warp">
        <span class="cur">{{ formatTime(storeState.currentTime.value) }}</span>
        <Progress
          :percent="percent"
          bar-width="250"
          @setVal="setTime"
          @moving="progressMove"
        />
        <span class="time">{{ formatTime(storeState.duration.value) }}</span>
      </div>
      <div class="buttons">
        <span>
          <svg-icon icon-class="suiji" />
          <!-- <svg-icon icon-class="liebiaoxunhuan" />
          <svg-icon icon-class="danquxunhuan" /> -->
        </span>
        <div class="center">
          <svg-icon icon-class="shangyishou" />
          <svg-icon v-if="storeState.playing.value" icon-class="songStop" class="play" @click="playState(false)" />
          <svg-icon v-else icon-class="songPlay" class="play" @click="playState(true)" />
          <svg-icon icon-class="xiayishou" />
        </div>
        <span>
          <svg-icon icon-class="list" />
        </span>
      </div>
      <!-- <audio ref="audioRef" autoplay controls crossorigin="*" :src="url" @loadedmetadata="initedSong" @timeupdate="timeupdate" /> -->
      <audioPlayer ref="audioComp" :url="url" style="display:none;" />
    </div>
  </div>
</template>

<script lang='ts'>
import { useRoute } from 'vue-router'
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted, getCurrentInstance, nextTick, onUnmounted, watch } from 'vue'
import api from '@/api'
import timeUtil from '@/utils/timeUtil'
import Progress from '@/components/progress.vue'
import useState from '@/utils/useState'
import audioPlayer from '@/components/audioPlayer.vue'
import { useStore } from 'vuex'
const _ = require('lodash')
export default defineComponent({
  name: 'SONGPLAY',
  components: {
    Progress,
    audioPlayer
  },
  setup(props, context) {
    const route = useRoute()
    const store = useStore()
    const lrcRef = ref()
    const audioComp = ref()
    const centerHeight = ref<number>(0)
    const storeState = useState('audioPlayer', ['currentTime', 'duration', 'volume','playing'])
    // 状态数据
    const state = reactive({
      lrc: [] as object[],
      songInfo: {},
      currentRow: 0,
      url: '',
      percent: <number|string>0,
      recordIndex: 0,
      flag: true,
      height: 0,
      moving: false,
      volumePercent: <number>storeState.volume.value * 100
    })
    console.log('first', state.volumePercent)
    watch(() => storeState.currentTime.value, (n) => {
      methods.lrcScroll(n)
    })
    // 方法
    const methods = {
      // 页面初始数据
      init():void {
        this.getLyric()
        this.getMusicUrl()
        this.detail()
      },
      playState(val:boolean) {
        store.commit('audioPlayer/PLAYING', val)
      },
      // 歌曲详情
      async detail():Promise<void> {
        const { songs }:any = await api.songDetail({ ids: route.params.id })
        state.songInfo = {
          ...songs[0],
          raps: songs[0].ar.map((item:any) => item.name).join('/')
        }
      },
      // 获取歌词
      async getLyric():Promise<void> {
        const { lrc }:any = await api.lyric({ id: route.params.id })
        state.lrc = this.formatLrc(lrc.lyric)
      },
      // 获取歌曲地址
      async getMusicUrl():Promise<void> {
        const { data }:any = await api.songUrl({ id: route.params.id })
        state.url = data[0].url
        await nextTick()
        store.commit('audioPlayer/PLAYING', true)
      },
      // 歌词处理，时间与文本分别保存
      formatLrc(lrc:string):object[] {
        const splitLrc = lrc.split('\n')
        let formatLyric = splitLrc
          .filter((item:string) => item && item.split(']')[1] !== '')
          .map((item:string) => {
            const time:string = /\[([^\[\]]*)\]/.exec(item)![1]
            const txt = item.split(']')[1]
            return {
              time: timeUtil.timeToSec(time),
              txt
            }
          })
        formatLyric = formatLyric.sort((a:any, b:any) => a.time - b.time)
        console.log('first', formatLyric)
        return formatLyric
      },
      // 歌词随时间同步滚动，设置进度条
      lrcScroll: _.throttle(function(time:number):void {
        console.log('time', time)
        // if (state.moving) {
        state.percent = (time / storeState.duration.value * 100).toFixed(3)
        // }
        // const item:any = state.lrc[state.recordIndex]
        // const active:any = document.querySelectorAll('.line')[state.recordIndex]
        // if (time >= item.time &&state.flag) {
        //   const { lineIndex } = active.dataset
        //   if (state.recordIndex === Number(lineIndex)) {
        //     state.currentRow = state.recordIndex
        //     console.log('state.flag', state.flag)
        //     state.recordIndex += 1
        //     if (state.recordIndex >= state.lrc.length) {
        //       state.flag = false
        //       return
        //     }
        //     state.height=centerHeight.value-active.offsetHeight*state.recordIndex
        //     nextTick(() => {
        //       lrcRef.value.style.transform = `translateY(${(state.height)}px)`
        //     })
        //   }
        // }
        for (let index = 0; index < state.lrc.length; index++) {
          const item:any = state.lrc[index]
          if (time >= item.time && state.flag) {
            const active:any = document.querySelectorAll('.line')[index]
            const { lineIndex } = active.dataset
            if (index === Number(lineIndex)) {
              // console.log('index', index);
              state.recordIndex += 1
              if (lineIndex == state.lrc.length - 1 && time > item.time) {
                // state.currentRow = state.lrc.length-1
                // state.flag = false
                // console.log('hhh');
                // return
              }
              nextTick(() => {
                // console.log('aaa');
                state.currentRow = index
                const a = centerHeight.value - active.offsetHeight * (index + 0)
                lrcRef.value.style.transform = `translateY(${a}px)`
              })
            }
          }
        }
        // state.lrc.forEach((item:any, index:number) => {
        //   if (time >= item.time && state.flag) {
        //     const active:any = document.querySelectorAll('.line')[index]
        //     const { lineIndex } = active.dataset
        //     if (index === Number(lineIndex)) {
        //       // console.log('index', index);
        //       state.recordIndex += 1
        //       if (lineIndex == state.lrc.length-1&&time>item.time) {
        //         state.currentRow = state.lrc.length-1
        //         // state.flag = false
        //         console.log('hhh');
        //         return
        //       }
        //       nextTick(() => {
        //         console.log('aaa');
        //         state.currentRow = index
        //         lrcRef.value.style.transform = `translateY(${(centerHeight.value - active.offsetHeight * (index + 1))}px)`
        //       })
        //     }
        //   }
        // })
      }, 500),
      // 拖拽，点击进度条同步设置播放时间
      setTime(val:number) :void {
        const currentTime = (val * storeState.duration.value) / 100
        audioComp.value.setPlayTime(currentTime)
      },
      setVolume(val:number):void {
        const volume = val / 100
        store.commit('audioPlayer/SET_VOLUME', volume)
      },
      // 当前页面禁止滑动
      disabledScroll(e:any):void {
        e.preventDefault()
        e.stopPropagation()
      },
      formatTime(time:number) {
        return timeUtil.secToTime(time)
      },
      progressMove(val:number) {
        state.moving = true
      }
    }

    onMounted(() => {
      methods.init()
      centerHeight.value = document.documentElement.clientHeight / 3
      lrcRef.value.style.transform = `translateY(${centerHeight.value / 50}rem)`
      document.addEventListener('touchmove', methods.disabledScroll, { passive: false })
      document.addEventListener('mousewheel', methods.disabledScroll, { passive: false })
    })
    onUnmounted(() => {
      document.removeEventListener('touchmove', methods.disabledScroll)
      document.removeEventListener('mousewheel', methods.disabledScroll)
    })

    return {
      ...toRefs(state),
      ...methods,
      lrcRef,
      audioComp,
      storeState
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .play_page{
    width:100%;
    height: 100%;
    // display: flex;
    // flex-direction: column;
    // background-color: rgba(42, 34, 34,.8);
    // background-size: 100% 100%;
    position: relative;
    z-index: 0;

    .bg_url{
      position: fixed;
      width: 100%;
      height: 100%;
      filter: blur(50px) brightness(50%);
      z-index: -1;
      background-color: rgba(0,0,0,.2);
    }
    .song_info{
      width: 100%;
      display: flex;
      flex-direction: column;
      color: rgba(255,255,255,1);
      padding-top: 0.4rem;
      box-sizing: border-box;
      margin-bottom: 0.4rem;
      align-items: center;
      .song_name{
        font-size: 0.32rem;
        margin-bottom: 0.12rem;
      }
      .name{
        font-size: 0.28rem;
        color: rgba(255,255,255,.4);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 3rem;
      }
    }
    .volume{
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: flex-start;
      width:100%;
      padding-left: 0.6rem;
      box-sizing: border-box;
      margin-bottom: 0.3rem;
      .icon{
        font-size: 0.24rem;
        margin-right: 0.3rem;
      }
    }
    .lrc_box{
      width: 100%;
      // flex: 1;
      // padding-top: 0.4rem;
      box-sizing: border-box;
      height: 8.6rem;
      overflow: auto;
      position: relative;
      .lrc_content{
        width: 100%;
        height: 100%;
        // overflow-y: hidden;
        transition: all .6s;
        .line{
          width: 100%;
          font-size: 0.28rem;
          padding: 0.3rem 0.6rem;
          box-sizing: border-box;
          color: rgba($color: #fff, $alpha: .5);
          span{
            line-height: 0.4rem;
          }
        }
        .on{
          color: rgba($color: #fff, $alpha: .9);
          font-size: 0.32rem;
        }
      }
    }
    .controls{
      width: 100%;
      position: fixed;
      left: 0;
      bottom: 0;
      .progress_warp{
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 0.24rem;
        color: #fff;
        .time{
          color: rgba(255,255,255,.6);
        }
      }
      .buttons{
        width:100%;
        display: flex;
        align-items: center;
        color: #fff;
        justify-content: space-between;
        padding: 0.4rem;
        box-sizing: border-box;
        .center{
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.32rem;
          .play{
            font-size: 0.7rem;
            padding: 0 0.7rem;
            box-sizing: border-box;
          }

        }
      }
    }
  }
</style>

