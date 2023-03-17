<template>
  <div class="video-detail" :class="{mask: !playing}" @click="togglePlay">
    <div class="video-warp" :class="{full: isVerticalScreen}">
      <VideoPlayer
        ref="playerRef"
        :url="videoUrl"
        :autoplay="true"
        :controls="false"
        @on-play="handlePlay"
        @on-pause="handlePause"
        @on-ended="handleEnded"
        @on-canplay="handleCanplay"
      />
      <div class="controls-icon">
        <span v-show="!playing && !loading" class="play" @click="handlePlay"><i class="iconfont icon-bofang" /></span>
      </div>
    </div>
    <div class="right-icon">
      <!-- 点赞 -->
      <li class="i-item">
        <i class="iconfont icon-zan" />
        <span class="title">{{ util.formatCount(videoCount?.likedCount || 0, 1) }}</span>
      </li>
      <!-- 评论 -->
      <li class="i-item" @click.stop="showComment = true">
        <i class="iconfont icon-pinglun-tianchong" />
        <span class="title">{{ util.formatCount(videoCount?.commentCount || 0, 1) }}</span>
      </li>
      <!-- 分享 -->
      <li class="i-item">
        <i class="iconfont icon-fenxiang1" />
        <span class="title">{{ util.formatCount(videoCount?.shareCount || 0, 1) }}</span>
      </li>
      <!-- 收藏 -->
      <li class="i-item">
        <i class="iconfont icon-xinjiantianjiabiaodanyemian" />
        <span class="title">收藏</span>
      </li>
    </div>
    <div class="video-info">
      <div class="header">
        <!-- 视频 -->
        <template v-if="route.query.type == 'video'">
          <img :src="detail?.creator?.avatarUrl" alt="" class="avatar">
          <span class="name">{{ detail?.creator?.nickname }}</span>
          <span v-if="!detail?.creator?.followed" class="like">+</span>
        </template>
        <!-- mv -->
        <template v-else>
          <img 
            v-for="(item, index) in detail.artists || []"
            :key="index" 
            :src="item?.img1v1Url" 
            class="avatar pic-item"
            :style="{'z-index': (detail?.artists?.length || 0) - (1 + index)}"
          >
          <span class="name" :style="{'marginLeft': `${0.7 * (detail?.artists?.length || 0) + ((detail?.artists?.length || 0) <= 1 ? 0.2 : 0)}rem`}">{{ formatNames(detail.artists) }}</span>
        </template>
      </div>
      <div class="title">
        {{ detail.title || detail.name || '' }}
      </div>
      <div class="desc">
        {{ detail.description || detail.desc || '' }}
      </div>
      <div class="time">
        {{ dayjs(detail.publishTime).format('YYYY-MM-DD') }}
      </div>
    </div>
    <div class="back-icon" @click="back">
      <i class="iconfont icon-xitongfanhui" />
    </div>
    <Comment
      :pop-show="showComment"
      pop-height="70%"
      teleport="body"
      @on-close="handleCommentClose"
      @click.stop
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import VideoPlayer from '@/components/video-player/index.vue'
import api from '@/api'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import util from '@/utils'
import Comment from './components/comment.vue'

const route = useRoute()

const router = useRouter()

type countType = {
  likedCount?: number,
  commentCount?: number,
  shareCount?: number
}

const playerRef = ref()

const loading = ref(true) // 视频加载中

const playing = ref(true) // 视频是否在播放

const detail = ref({} as anyObject)

const videoUrl = ref('')

const videoCount = ref({} as countType) // 视频点赞评论数

const showComment = ref(true) // 评论显示

const videoTypeFnMap = {
  'mv': () => {
    mvDetail()
    mvInfo()
    mvUrl()
  },
  'video': () => {
    getUrl()
    getVideoDetail()
    videoInfo()
  }
}

// 返回视频是否竖屏
const isVerticalScreen = computed(() => (detail?.value?.width || 0) < (detail?.value?.height || 0) || false)

function handleCommentClose(val:boolean): void {
  showComment.value = val
}

function formatNames(list = []) {
  return list.length && list.map((i:anyObject) => i.name).join('/') || ''
}

function back() {
  router.back()
}

async function getUrl() {
  type url = {
    url?: string
  }
  type urlsType = url[]
  const { urls = [] }: {urls?: urlsType} = await api.videoUrl({ id: route.params.id })
  videoUrl.value = urls.length && urls[0]?.url || ''
}

async function getVideoDetail() {
  const res: response = await api.videoDetail({ id: route.params.id })
  detail.value = res.data
}

async function videoInfo() {
  const data = await api.videoInfo({ vid: route.params.id })
  videoCount.value = data
}

async function mvDetail() {
  const res: response = await api.mvDetail({ mvid: route.params.id })
  detail.value = res.data
}

async function mvUrl() {
  const res: response = await api.mvUrl({ id: route.params.id })
  videoUrl.value = res?.data?.url || ''
}

async function mvInfo() {
  const data = await api.mvInfo({ mvid: route.params.id })
  videoCount.value = data
}

function togglePlay() {
  playing.value = !playing.value
  playing.value ? playerRef.value.play() : playerRef.value.pause()
}

function handlePlay() {
  playing.value = true
  loading.value = false
  playerRef.value.play()
}

function handlePause() {
  playing.value = false
  playerRef.value.pause()
}

function handleWait() {
  loading.value = true
}

function handleEnded() {
  playing.value = false
}

function handleCanplay() {
  loading.value = false
  playerRef.value.autoPlay()
}

onMounted(() => {
  videoTypeFnMap[route.query.type as keyof typeof videoTypeFnMap]()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.video-detail{
  width:100%;
  height: 100%;
  background-color: #000;
  position: relative;
  .video-warp{
    width: 100%;
    height: 4rem;
    margin-top: 3rem;
    position: relative;
    .controls-icon{
      position: absolute;
      left:50%;
      top: 50%;
      transform: translate(-50%,-50%);
      z-index: 10;
      .iconfont{
        font-size: 1rem;
        color: #fff;
      }
    }
  }
  
  .full{
    height: 100%;
    margin: 0;
    overflow: hidden;
  }
  .right-icon{
    position: absolute;
    right: 0.3rem;
    bottom: 2rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    .i-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 0.4rem;
      .iconfont{
        font-size: 0.64rem;
        color: #fff;
      }
      .title{
        color: #fff;
        font-size: 0.28rem;
        margin-top: 0.16rem;
      }
    }

  }
  .video-info{
    position: absolute;
    left: 0;
    bottom: 1.6rem;
    width: 100%;
    z-index: 10;
    color: rgba(255,255,255,.9);
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
    text-align: left;
    padding: 0 2rem 0 0.3rem;
    box-sizing: border-box;
    .header{
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;
      width: 100%;
      position: relative;
      height: .7rem;
      .name{
        margin: 0 0.2rem;
        font-weight: 500;
        // flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.28rem;
      }
      .avatar{
        width: 0.7rem;
        height:0.7rem;
        border-radius: 50%;
        border: 2px solid #fff;
      }
      .like{
        padding: 0.08rem 0.16rem;
        border-radius: 0.2rem;
        color: #fff;
        font-size: 0.28rem;
        background-color: red;
      }
      .pic-item{
        position: absolute;
        &:not(:first-child){
          left: 7%;
        }
      }
    }
    .desc,.title{
      font-size: 0.28rem;
      line-height: 0.4rem;

    }
    .desc{
      margin: 0.16rem 0;
    }
    .time{
      font-size: 0.24rem;
      color: rgba(255,255,255,.6);
    }
  }
  .back-icon{
    position: absolute;
    left: 0.2rem;
    top: 0.4rem;
    color: #fff;
    z-index: 10;
    i{
      font-size: 0.4rem;
    }
  }
}
.mask::after{
  content: '';
  display: block;
  width:100%;
  height: 100%;
  position: absolute;
  left: 0;
  top:0;
  background-color: rgba(0,0,0,.1);
  z-index: 1;
}
 
</style>

