<template>
  <div class="load-warp">
    <li 
      v-for="(item, index) in lines" 
      :key="index" 
      class="line" 
      :style="{'--self-height': `${item.baseHeight*2/100}rem`, '--delay': index+1}"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted, withDefaults, defineProps } from 'vue'

interface propType {
  lineNum: number,
  lineWidth: number,
  baseHeight: number,
  lineColor: string
}

const props = withDefaults(defineProps<propType>(), {
  lineNum: 4,
  lineWidth: 3,
  baseHeight: 50,
  lineColor: 'red'
})

const lines = computed(() => {
  let temp = [] as object[]
  for (let i = 0; i <= props.lineNum; i++) {
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
  width: 100%;
  height: 0.4rem;

}
.line{
  --time: calc(var(--delay) * 200ms);
  width: v-bind('lineWidth * 2 / 100 + "rem"');
  height: var(--self-height);
  background-color: v-bind(lineColor);
  margin-right: 4px;
  animation-name: load;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  animation-delay:  var(--time);
  animation-timing-function: ease;
  border-radius: 0.06rem;
}
@keyframes load {
  0%,
  100% {
    height: var(--self-height);
  }
  50%{
    height: calc(100% - (var(--self-height)/2) );
  }
}
 
</style>
