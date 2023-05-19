<template>
  <div class="sheet" @click="emit('on-click', sheet.id)">
    <span class="pic">
      <img :src="sheet.coverImgUrl" alt="">
      <span class="count">
        <svg-icon icon-class="bofang" class="bofang" />
        {{ util.formatCount(sheet.playCount) }}
      </span>
    </span>
    <div class="name">
      {{ sheet.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue'
import util from '@/utils'

interface propsType {
  sheet: anyObject
}

const props = withDefaults(defineProps<propsType>(), {
  sheet: () => ({})
})

const emit = defineEmits(['on-click'])
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.sheet{
  display: flex;
  flex-direction: column;
  // flex: 1;
  flex-wrap: wrap;
  white-space: normal;
  min-width: 0;
  word-break: break-all;
  align-items: center;
  width: 30%;
  margin-bottom: 0.3rem;
  .pic{
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.16rem;
    position: relative;
    img{
      width: 100%;
      height: 100%;
      border-radius: 0.16rem;
    }
    .count{
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
      color: #fff;
      font-size: 0.2rem;
      background-color: rgba(0,0,0,.2);
      padding: 0.08rem 0.12rem;
      border-radius: 0.6rem;
      display: flex;
      align-items: center;
      .bofang{
        font-size: 0.16rem;
      }
    }
  }
  .name{
    font-size: 0.24rem;
    word-break: break-all;
    overflow-wrap: break-word;
    overflow: hidden;
    text-align: left;
    line-height: 0.32rem;
    max-width: 2rem;
    display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp: 2;
  }
}
</style>
