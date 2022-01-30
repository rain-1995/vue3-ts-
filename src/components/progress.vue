<template>
  <div class="progress">
    <div
      ref="progressRef"
      class="bar"
      @click="progressClick"
      @touchstart="barTouchStart"
      @touchmove="barTouchMove"
      @touchend="barTouchEnd"
    >
      <div
        class="track"
        :style="{width:`${percent}%`}"
      />
      <div
        class="dot"
        :style="{left:`${percent}%`}"
      />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, computed, onMounted, watch } from 'vue'
export default defineComponent({
  name: 'PROGRESS',
  props: {
    percent: { // 进度
      type: [Number, String],
      default: 0
    },
    dotSize: { // 圆点大小
      type: [Number, String],
      default: 20
    },
    dotColor: { // 圆点颜色
      type: String,
      default: '#fff'
    },
    barWidth: { // 进度栏宽度
      type: [Number, String],
      default: 150
    },
    barColor: { // 进度栏颜色
      type: [Number, String],
      default: 150
    },
    trackColor: { // 进度颜色
      type: String,
      default: '#fff'
    }
  },
  setup(props, { emit }) {
    const progressRef = ref<any>(null)// 绑定进度条 dom
    // 状态数据
    const state = reactive({
      percent: <number|string>0
    })

    // 方法
    const methods = {
      // 进度条点击
      progressClick(e:MouseEvent) {
        const { pageX } = e
        const clickPosition = pageX - progressRef.value.offsetLeft
        const percent = (clickPosition / progressRef.value.offsetWidth * 100).toFixed(3)
        state.percent = this.formatPercent(percent)
        emit('setVal', this.formatPercent(percent))
      },
      barTouchStart(e:TouchEvent) {
        // console.log('s', e)
      },
      barTouchMove(e:TouchEvent) {
        // console.log('m', e)
        const { touches } = e
        const clickPosition = touches[0].pageX - progressRef.value.offsetLeft
        const percent = (clickPosition / progressRef.value.offsetWidth * 100).toFixed(3)
        state.percent = this.formatPercent(percent)
        emit('setVal', this.formatPercent(percent))
      },
      barTouchEnd(e:TouchEvent) {
        // console.log('e', e)
      },

      formatPercent(num:number|string) {
        return num < 0 ? 0 : num > 100 ? 100 : num
      }
    }
    watch(() => props.percent, (n) => {
      state.percent = n
    })

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...methods,
      progressRef
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .progress{
    .bar{
      width:6rem;
      height: 0.04rem;
      background: rgba(255,255,255,.4);
      position: relative;
      .track{
        position: absolute;
        width: 2rem;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1;
        background: rgba(255,255,255,.9);
      }
      .dot{
        position: absolute;
        width: 0.2rem;
        height: 0.2rem;
        border-radius: 50%;
        background: #fff;
        left: 0;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
</style>

