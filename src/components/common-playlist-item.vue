/** 
  歌单item通用组件
*/
<template>
  <li 
    v-for="(item, index) in list" 
    :key="index" 
    class="song-item" 
    @click="playListDetail(item)"
  >
    <img :src="item?.coverImgUrl" alt="" class="cover">
    <div class="song-info">
      <span class="song-title">{{ item?.name }}</span>
      <p class="sub-info">
        <span>{{ item?.trackCount }}首</span>
        <span v-if="showAuthor" class="author">，by{{ item?.creator?.nickname }}</span>
      </p>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue'
import { useRouter } from 'vue-router'
interface propsType { // props类型
  showAuthor: boolean,
  list: playListItemType[]
}

interface playListItemType { // 歌曲类型接口定义
  name: string,
  coverImgUrl: string,
  trackCount: number | string,
  creator: {nickname:string},
  id: number
}

const router = useRouter()

const props = withDefaults(defineProps<propsType>(), {
  showAuthor: false,
  list: () => ([])
})

function playListDetail(data: {id:number}) {
  router.push(`/songSheet/${data.id}`)
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.song-item{
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
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

