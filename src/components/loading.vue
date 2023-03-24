<template>
  <div class="load-warp">
    <div 
      v-for="(item, index) in lines" 
      :key="index" 
      class="line" 
      :style="{'--self-height': `${item.baseHeight}px`, '--delay': index + 1}"
    />
    <div v-if="text" class="text">
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, withDefaults, defineProps } from 'vue'

interface propType {
  lineNum: number,
  lineWidth: number,
  baseHeight: number,
  lineColor: string,
  animationTime: number,
  text: string,
  textColor: string
}

const props = withDefaults(defineProps<propType>(), {
  lineNum: 4, // 线条数量
  lineWidth: 2, // 线条宽度
  baseHeight: 10, // 线条基础高度
  lineColor: 'red', // 线条颜色
  animationTime: 0.5, // 动画一次完成的时间 单位秒
  text: '', // 文本
  textColor: '#000' // 文本颜色
})

const lines = computed(() => {
  let temp = [] as any[]
  for (let i = 0; i < props.lineNum; i++) {
    const line = {
      baseHeight: props.baseHeight + i * String(props.lineNum).length
    }
    temp = [...temp, line]
  }
  return temp
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.load-warp{
  display: flex;
  align-items: flex-end;
  position: relative;
  height: 0.4rem;
  text-align: center;
}
.line{
  --time: calc(var(--delay) * 200ms); // 动画延迟时间
  width: v-bind('lineWidth * 2 / 100 + "rem"');
  height: calc(var(--self-height));
  background-color: v-bind(lineColor);
  margin-right: 3px;
  animation-name: load;
  animation-duration: v-bind('animationTime + "s"');
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  animation-delay:  var(--time);
  animation-timing-function: ease;
  border-radius: 0.06rem;
  @keyframes load {
    0%,
    100% {
      height: var(--self-height);
    }
    50%{
      height: calc(var(--self-height) / 2 / var(--delay));
    }
  }
}
.text{
  font-size: 0.2rem;
  color: v-bind(textColor);
  margin-left: 0.12rem;
}
</style>
