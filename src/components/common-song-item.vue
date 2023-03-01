<template>
  <div class="list">
    <div v-for="(item, index) in list" :key="index" class="list_item" @click="play(item)">
      <span class="left">
        <span class="num">{{ index+1 }}</span>
        <img src="" alt="" class="avatar">
      </span>
      <div class="right">
        <p class="info">
          <span class="main">{{ item.name }}</span>
          <span class="sub">{{ item.authors }}-{{ item.al.name }}</span>
        </p>
        <p class="icon">
          <svg-icon v-if="item.mv !== 0" icon-class="mv_bofang" />
          <svg-icon icon-class="gengduo" class="more" />
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted, withDefaults, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface songType {
  name: string, 
  authors: string,
  al: {
    name: string
  },
  mv: string | number
}

interface propsType { // props类型
  showAuthor: boolean,
  list: songType[]
}

const props = withDefaults(defineProps<propsType>(), {
  showAuthor: false,
  list: () => ([])
})

// 播放
function play({ id }:{id:number}) {
  router.push(`/songPlay/${id}`)
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list{
  width:100%;
  overflow: auto;
  padding-top: 1rem;
  box-sizing: border-box;
  .list_item{
  display: flex;
  align-items: center;
  padding: 0.2rem;
  box-sizing: border-box;
  .left{
      font-size: 0.24rem;
      color: rgba(0,0,0,.3);
      margin-right: 0.3rem;
      .num{
      font-size: 0.28rem;
      }
  }
  .right{
      display: inline-flex;
      align-items: center;
      flex: 1;
      justify-content: space-between;
      width:0;
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
      .sub{
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
          margin-left: 0.2rem;
      }
      }
  }
  }
}
 
</style>

