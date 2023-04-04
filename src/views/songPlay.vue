<template>
  <div class="play_page">
    <div class="bg_url" :style="{'background-image':`url(${songInfo.al?.picUrl})`}" />
    <span class="back-icon" @click="back">
      <i class="iconfont icon-xiangxiajiantou" />
    </span>
    <div class="song_info">
      <span class="song_name">{{ songInfo.name }}</span>
      <span class="name">{{ songInfo.raps }}</span>
    </div>
    <div ref="coverPage" class="cover_page" :style="{opacity:showLrc ? 0 : 1}" @click="toggleShow">
      <!-- <div> -->
      <div class="track" :class="[storeState.playing.value ? 'track_on' : '']">
        <img src="../assets/icon/swith.png" alt="">
      </div>
      <div v-show="songInfo.al?.picUrl" class="cover" :class="[storeState.playing.value ? 'cover_on' : '']">
        <img v-cloak :src="songInfo.al?.picUrl" alt="">
      </div>
      <!-- </div> -->
    </div>
    <div ref="lrcPage" class="lrc_page" :style="{opacity:showLrc ? 1 : 0}" @click="toggleShow">
      <div class="volume">
        <svg-icon icon-class="volume" class="icon" />
        <Progress
          :percent="volumePercent"
          :bar-width="250"
          @setVal="setVolume"
        />
      </div>
      <div class="lrc_box">
        <div ref="lrcRef" class="lrc_content">
          <p
            v-for="(item, index) in lrc"
            :key="index"
            :data-line-index="index"
            class="line"
            :class="[currentRow == index?'on':'']"
          >
            <span>{{ item.txt }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="controls">
      <div class="progress_warp">
        <span class="cur">{{ formatTime(storeState.currentTime.value) }}</span>
        <Progress
          :percent="percent"
          :bar-width="250"
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
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, onMounted, nextTick, onUnmounted, watch } from 'vue'
import api from '@/api'
import timeUtil from '@/utils/timeUtil'
import Progress from '@/components/progress.vue'
import useState from '@/utils/useState'
import { useStore } from 'vuex'
import { keysObject } from '@/utils/types'
import { useRouter, useRoute } from 'vue-router'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash')
export default defineComponent({
  name: 'SONGPLAY',
  components: {
    Progress
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()
    const lrcRef = ref() // 歌词容器ref
    const coverPage = ref() // 唱片页ref
    const lrcPage = ref() // 歌词页ref
    const centerHeight = ref<number>(0) // 页面中心高度
    const scrollHeight = 50 // 歌词每次滚动距离
    const storeState = useState('audioPlayer', ['currentTime', 'duration', 'volume', 'playing'])
    // 状态数据
    const state = reactive({
      lrc: [] as object[], // 歌词
      songInfo: {} as anyObject,
      currentRow: 0, // 当前播放位置
      percent: <number|string>0, // 歌曲进度条
      moving: false,
      volumePercent: <number>storeState.volume.value * 100, // 音量进度条
      showLrc: false
    })
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
      back() {
        router.back()
      },
      // 唱片歌词切换
      toggleShow() {
        state.showLrc = !state.showLrc
        const display = {
          'true': 'block',
          'false': 'none'
        }
        setTimeout(() => {
          coverPage.value.style.display = display[<keyof typeof display>`${!state.showLrc}`]
          lrcPage.value.style.display = display[<keyof typeof display>`${state.showLrc}`]
        }, 400)
      },
      // 播放暂停
      playState(val:boolean) {
        store.commit('audioPlayer/PLAYING', val)
      },
      // 歌曲详情
      async detail():Promise<void> {
        const { songs }:keysObject = await api.songDetail({ ids: route.params.id })
        state.songInfo = {
          ...songs[0],
          raps: songs[0].ar.map((item:keysObject) => item.name).join('/')
        }
        store.dispatch('audioPlayer/songInfo', state.songInfo)
      },
      // 获取歌词
      async getLyric():Promise<void> {
        const { lrc }:keysObject = await api.lyric({ id: route.params.id })
        state.lrc = this.formatLrc(lrc.lyric)
      },
      // 获取歌曲地址
      async getMusicUrl():Promise<void> {
        const { data }:keysObject = await api.songUrl({ id: route.params.id })
        store.commit('audioPlayer/SET_URL', data[0].url)
        await nextTick()
        // store.commit('audioPlayer/PLAYING', true)
      },
      // 歌词处理，时间与文本分别保存
      formatLrc(lrc:string):object[] {
        const splitLrc = lrc.split('\n')
        const formatLyric = splitLrc
          .map((item:string) => {
            const splitItem = item.split(']')
            const txt = splitItem.pop()
            return splitItem.map(s => {
              return {
                time: timeUtil.timeToSec(s.replace('[', '')),
                txt
              }
            })
          })
          .flat()
          .filter((item:keysObject) => item.txt !== '')
          .sort((a:keysObject, b:keysObject) => a.time - b.time)
        console.log('first', formatLyric)
        return formatLyric
      },
      // 歌词随时间同步滚动，设置进度条
      lrcScroll: _.throttle(function(time:number):void {
        state.percent = (time / storeState.duration.value * 100).toFixed(3)
        const lineDoms:keysObject = document.querySelectorAll('.line')
        for (let index = 0; index < state.lrc.length; index++) {
          const item:keysObject = state.lrc[index]
          if (time >= item.time) {
            const { lineIndex } = lineDoms[index].dataset
            if (index === Number(lineIndex)) {
              nextTick(() => {
                state.currentRow = index
                lrcRef.value.style.transform = `translateY(${(centerHeight.value - scrollHeight * (index + 1)) / 50}rem)`
              })
            }
          }
        }
      }, 500),
      // 拖拽，点击进度条同步设置播放时间
      setTime(val:number) :void {
        const currentTime = (val * storeState.duration.value) / 100
        store.dispatch('audioPlayer/setCurrentTime', currentTime)
      },
      // 设置音量
      setVolume(val:number):void {
        const volume = val / 100
        store.commit('audioPlayer/SET_VOLUME', volume)
      },
      // 当前页面禁止滑动
      disabledScroll(e:keysObject):void {
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
      storeState,
      coverPage,
      lrcPage
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .play_page{
    width:100%;
    height: 100%;
    position: relative;
    z-index: 0;
    .back-icon{
      position: absolute;
      left: 0.3rem;
      top: 0.4rem;
      z-index: 100;
      i{
        font-size: 0.44rem;
        font-weight: bold;
        color: #fff;
      }
    }
    .bg_url{
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: -1;
      background-color: rgba(0,0,0,.2);
      background-size: cover;
      background-position: center;
      &::after{
        display: block;
        content: "";
        width: 150%;
        height: 150%;
        position: absolute;
        left: 0;
        top: 0;
        right:0;
        bottom:0;
        transform: translate(-1rem,-1rem);
        background: inherit;
        filter: blur(20px) brightness(30%);
      }
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
    .cover_page{
      position: relative;
      width:100%;
      height:8.6rem;
      opacity: 0;
      transition: all .5s;
      display: block;
      .track{
        width:1.6rem;
        height:auto;
        position: absolute;
        left:48%;
        top:0;
        z-index: 2;
        transition: all .7s;
        transform: rotate(-30deg);
        transform-origin: 0 0;

        img{
          width:100%;
          height:100%;
        }
      }
      .track_on{
        transform: rotate(0deg);
      }
      .cover_on{
        animation-play-state:running !important;
      }
      @keyframes rotate {
        from{
          transform:translate(-50%,0) rotate(0deg);
        }
        to{
          transform:translate(-50%,0) rotate(360deg);
        }
      }
      .cover{
        width:5rem;
        height:5rem;
        background: url('../assets/icon/coverall.png') 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left:50%;
        transform: translate(-50%,0);
        margin-top: 1.2rem;
        animation: rotate 8s linear infinite;
        animation-play-state:paused;
        img{
          width:62%;
          height: 62%;
          border-radius: 50%;
          position: absolute;
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
        }
      }
    }
    .lrc_page{
      opacity: 0;
      transition: all .5s;
      display: none;
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
          font-size: 0.36rem;
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
            font-size: 0.76rem;
            margin: 0 0.7rem;
            box-sizing: border-box;
          }

        }
      }
    }
  }
</style>

