<template>
  <div class="list_item" @click="play()">
    <div class="right">
      <p class="info">
        <span class="main">{{ data.name }}</span>
        <span class="sub">{{ formatAuthor(data?.ar || []) }} - {{ data?.al?.name }}</span>
        <span v-if="data?.originSongSimpleData" class="origin">原唱：{{ formatOrigin(data?.originSongSimpleData) }}</span>
      </p>
      <p class="icon">
        <svg-icon v-if="data.mv !== 0" icon-class="mv_bofang" />
        <svg-icon icon-class="gengduo" class="more" />
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type songType = {
  name?: string, 
  authors?: string,
  al?: {
    name?: string
  },
  mv?: string | number,
  id?: number |string,
  ar?: [],
  originSongSimpleData?: object
}

interface propsType { // props类型
  showAuthor: boolean,
  data: songType
}

const props = withDefaults(defineProps<propsType>(), {
  showAuthor: false,
  data: () => ({})
})

function formatOrigin({ artists = [] }: {artists?: []} = {}) {
  if (artists && artists.length) {
    return artists.map(item => item?.name).join('/')
  }
  return ''
}

function formatAuthor(list:[]) {
  return list.length && list.map(item => item.name).join('/')
}

// 播放
function play() {
  const { id } = props.data
  router.push(`/songPlay/${id}`)
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list_item{
  width:100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0.2rem .3rem 0;
  box-sizing: border-box;
  
  .right{
    display: inline-flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    min-width:0;
    border-bottom: .5px solid rgba(0,0,0,.1);
    padding-bottom: .2rem;
    .info{
      font-size: 0.32rem;
      font-weight: 500;
      margin-right: 0.2rem;
      box-sizing: border-box;
      min-width:0;
      &>span{
        display: block;
        text-align: left;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .main{
        font-size: 0.28rem;
      }
      .sub,.origin{
        margin-top: 0.16rem;
        color:rgba(0,0,0,.4);
        font-size: 0.24rem;
      }
    }
    .icon{
      display: inline-flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.3);
      font-size: 0.24rem;
      .more{
        font-size: 0.32rem;
        margin-left: 0.2rem;
        color: rgba(0,0,0,.5);
      }
    }
  }
}
 
</style>

