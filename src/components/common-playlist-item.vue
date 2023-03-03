/** 
  歌单item通用组件
*/
<template>
  <li 
    class="sheet-item" 
    @click="playListDetail()"
  >
    <img :src="data?.coverImgUrl" alt="" class="cover">
    <div class="song-info">
      <span class="song-title">{{ data?.name }}</span>
      <p class="sub-info">
        <span>{{ data?.trackCount }}首</span>
        <span v-if="showAuthor" class="author">，by{{ data?.creator?.nickname }}</span>
        <span v-if="showPlayCount && data.playCount" class="play-count">，播放{{ util.formatCount(data?.playCount || 0, 1) }}次</span>
      </p>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import util from '@/utils/index'
interface propsType { // props类型
  showAuthor: boolean,
  data: playListItemType,
  showPlayCount: boolean
}

type playListItemType = { // 歌曲类型接口定义
  name?: string,
  coverImgUrl?: string,
  trackCount?: number | string,
  creator?: {nickname:string},
  id?: number,
  playCount?: number
}

const router = useRouter()

const props = withDefaults(defineProps<propsType>(), {
  showAuthor: false, // 是否显示作者
  data: () => ({}),
  showPlayCount: false // 是否显示播放量
})

function playListDetail() {
  router.push(`/songSheet/${props.data.id}`)
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.sheet-item{
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  &:last-child{
    margin-bottom: 0;
  }
  .cover{
    width:1rem;
    height:1rem;
    border-radius: 0.16rem;
    margin-right: 0.2rem;
  }
  .song-info{
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    font-size: 0.28rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  .song-title{
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
  }
  .sub-info{
    font-size: 0.24rem;
    color: rgba(0,0,0,.3);
    margin-top: 0.12rem;
    text-align: left;
  }
}
</style>

