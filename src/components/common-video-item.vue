/** 
    视频列表item通用组件
*/
<template>
  <div class="video-item" @click="playDetail">
    <div class="left-cover">
      <img class="cover" :src="data.coverUrl || data.cover" alt="">
      <span v-if="(data.playTime || data.playCount || 0) > 100 * 10000" class="tag">百万播放</span>
      <span class="time">{{ dayjs(data.durationms || data.duration).format('mm:ss') }}</span>
    </div>
    <div class="video-info">
      <p class="title-line">
        <img v-if="data.type == 0" src="@/assets/icon/MV-icon.png" alt="" class="mv-tag">
        <span class="title">{{ data.title || data.name }}</span>
      </p>
      <p class="name">
        {{ formatUser(data.creator || data.artists || []) }}
      </p>
      <p class="play-count">
        {{ util.formatCount(data.playTime || data.playCount || 0, 1) }}次播放
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue'
import dayjs from 'dayjs'
import util from '@/utils'
import api from '@/api'
import { useRouter } from 'vue-router'
interface propType {
    data: videoItemType,
}

type videoItemType = { // 视频类型接口定义
  coverUrl?: string,
  creator?: [],
  vid?: number,
  playTime?: number,
  title?: string,
  durationms?:number,
  type?: number,
  cover?: string,
  playCount?: number,
  duration?: number,
  artists?: [],
  name?: string,
  id?: number,
}

const router = useRouter()

const props = withDefaults(defineProps<propType>(), {
  data: () => ({})
})

function formatUser(list = []) {
  return list.length && list.map(item => item?.userName || item?.name).join('/')
}

async function playDetail() {
  const type = props?.data?.type == 1 ? 'video' : 'mv'
  router.push(`/playVideo/${props.data.id || props.data.vid}?type=${type}`)
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.video-item{
  width:100%;
  display: flex;
  align-items: flex-start;
  padding: 0 0.3rem;
  box-sizing: border-box;
  margin-bottom: 0.4rem;
  .left-cover{
    width:2.8rem;
    height: 1.7rem;
    position: relative;
    .cover{
      width: 100%;
      height:100%;
      border-radius: 0.12rem;
    }
    .tag{
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
      padding: 0.04rem;
      background-color: rgba(255,255,255,.9);
      color: rgba(0,0,0,.8);
      font-size: 0.16rem;
      border-radius: 0.06rem;
    }
    .time{
      position: absolute;
      right: 0.16rem;
      bottom: 0.08rem;
      color: rgba(255,255,255,1);
      font-size: 0.24rem;
    }
  }
  .video-info{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 0.2rem;
    font-size: 0.24rem;
    flex: 1;
    min-width: 0;
    .title-line{
      font-size: 0.28rem;
      display: inline-flex;
      align-items: flex-start;
      .mv-tag{
        width: 0.4rem;
        height: auto;
        margin-right: 0.08rem;
      }
      .title{
        text-align: left;
        line-height: 18px;
        margin-top: 1px;
        display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
        -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
        -webkit-line-clamp: 2; /* 2行，只有 webkit内核支持 */
        word-break: break-all; /* 纯英文换行 */
        overflow: hidden;
      }
    }
    .name{
      margin: 0.2rem 0 0.12rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: left;
      
    }
    .name,.play-count{
      color: rgba(0,0,0,.7);
    }
  }
}
</style>

