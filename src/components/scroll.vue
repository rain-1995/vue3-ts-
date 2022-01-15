<template>
  <div class="horizontal-container">
    <slot />
  </div>
</template>

<script lang='ts'>
import BScroll from 'better-scroll'
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted, watch, nextTick } from 'vue'
export default defineComponent({
  name: 'SWIPER',
  props: {
    // 是否有滚动到指定位置功能
    hasScrollTo: {
      type: Boolean,
      default: false
    },
    // 指定滚动到的目标元素
    scrollToDom: {
      type: String,
      default: ''
    },
    // bscroll初始化指定的dom对象
    scrollDom: {
      type: String,
      default: ''
    },
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true
    },
    /**
     * 是否开启横向滚动
     */
    scrollX: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 列表的数据
     */
    data: {
      type: Array,
      default: null
    },
    /**
     * 是否派发滚动到底部的事件，用于上拉加载
     */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发列表滚动开始的事件
     */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 当数据更新后，刷新scroll的延时。
     */
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  setup(props, { emit }) {
    // 状态数据
    const state = reactive({
      scroll: null as any
    })

    // 方法
    const methods = {
      _initScroll() {
      // better-scroll的初始化
        state.scroll = new BScroll((document.querySelector(`.${props.scrollDom}`)) as any, {
          probeType: props.probeType,
          click: props.click,
          scrollX: props.scrollX,
          eventPassthrough: 'vertical',
          // scrollbar: true
        })
        // 是否派发滚动事件
        if (props.listenScroll) {
          state.scroll.on('scroll', (pos:any) => {
            emit('scroll', pos)
          })
        }

        // 是否派发滚动到底部事件，用于上拉加载
        if (props.pullup) {
          state.scroll.on('scrollEnd', () => {
          // 滚动到底部
            if (state.scroll.y <= (state.scroll.maxScrollY + 50)) {
              emit('scrollToEnd')
            }
          })
        }

        // 是否派发顶部下拉事件，用于下拉刷新
        if (props.pulldown) {
          state.scroll.on('touchend', (pos:any) => {
          // 下拉动作
            if (pos.y > 50) {
              emit('pulldown')
            }
          })
        }

        // 是否派发列表滚动开始的事件
        if (props.beforeScroll) {
          state.scroll.on('beforeScrollStart', () => {
            emit('beforeScroll')
          })
        }
      // 滚动到指定位置
      // if(this.hasScrollTo){
      //   this.scrollToElement()
      // }
      },
      disable() {
      // 代理better-scroll的disable方法
        state.scroll && state.scroll.disable()
      },
      enable() {
      // 代理better-scroll的enable方法
        state.scroll && state.scroll.enable()
      },
      refresh() {
      // 代理better-scroll的refresh方法
        state.scroll && state.scroll.refresh()
      },
      scrollTo() {
      // 代理better-scroll的scrollTo方法
        state.scroll && state.scroll.scrollTo.apply(state.scroll, arguments)
      },
      scrollToElement() {
      // 代理better-scroll的scrollToElement方法
      // this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        if (props.hasScrollTo) {
          state.scroll && state.scroll.scrollToElement(document.querySelector(props.scrollToDom), 1000, 0, 0)
        }
      }
    }

    // 计算属性
    const computes = {}
    watch(() => props.data, () => {
      nextTick(() => {
        setTimeout(() => {
          methods.refresh()
        }, 1000)
      })
    })
    onMounted(() => {
      // nextTick(() => {
      //   setTimeout(() => {
      methods._initScroll()
      //   }, 1000)
      // })
    })

    return {
      ...toRefs(state),
      ...methods,
      ...computes
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss">
  .horizontal-container {
    width:100%;
    overflow: hidden;
    .scroll-wrapper {
      width: 100%;
      white-space: nowrap;
      overflow :hidden;
      .scroll-content{
        display :inline-block;
        .scroll-item{
          display:inline-block;
          text-align: center;
        }
      }
    }
  }

</style>
