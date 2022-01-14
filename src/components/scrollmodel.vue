<template>
  <div v-if="Object.keys(data).length">
    <div class="header">
      <div class="title">
        <span v-if="!data.hasTabs">{{ data.uiElement.subTitle.title }}</span>
        <div v-else class="title_tab">
          <span v-for="(tab, index) in data.formatCreatives" :key="index" class="tab_title">
            {{ tab.label }}
          </span>
        </div>
      </div>
      <span class="button">更多<svg-icon icon-class="rightjiantou" class="icon" /></span>
    </div>
    <scroll
      :data="data.creatives"
      :scroll-dom="`scroll_mode${data.id}`"
      :scroll-x="true"
    >
      <div class="scroll-wrapper scroll_mode" :class="`scroll_mode${data.id}`">
        <div class="scroll-content mode_content">
          <div v-for="(block, index) in data.creatives" :key="index" class="item">
            <template v-if="block.creativeType == 'scroll_playlist'">
              <Swipe class="" :show-indicators="false" style="height:3rem;" autoplay="4000" vertical>
                <SwipeItem v-for="(swip, index) in block.resources" :key="index">
                  <div class="swip">
                    <span class="pic">
                      <img :src="swip.uiElement.image.imageUrl" alt="">
                    </span>
                    <div class="name">
                      {{ swip.uiElement.mainTitle.title }}
                    </div>
                  </div>
                </SwipeItem>
              </Swipe>
            </template>
            <template v-else>
              <div v-for="(item, index) in block.resources" :key="index" class="swip">
                <span class="pic">
                  <img :src="item.uiElement.image.imageUrl" alt="">
                  <span class="count">
                    <svg-icon icon-class="bofang" class="bofang" />
                    {{ formatCount(item.resourceExtInfo.playCount) }}
                  </span>
                </span>
                <div class="name">
                  {{ item.uiElement.mainTitle.title }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import { Swipe, SwipeItem } from 'vant'
export default defineComponent({
  name: 'SCROLLMODEL',
  components: { Swipe, SwipeItem },
  props: {
    modeData: {
      default: {},
      type: Object

    }
  },
  setup(props, context) {
    // 状态数据
    const state = reactive({
      data: props.modeData
    })

    // 方法
    const methods = {
      formatCount(num:number) {
        return num < 10000
          ? num
          : num < 100000000
            ? `${(num / 10000).toFixed(0)}万`
            : `${(num / 100000000).toFixed(0)}亿`
      },
    }

    // 计算属性
    const computes = {}

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...methods,
      ...computes
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 0.36rem;
    .title{
      font-size: 0.36rem;
      font-weight: bold;
      .tab_title{
        color: rgba(0,0,0,.3);
        &::after{
          display: inline-block;
          content: '';
          width: .5px;
          height: 0.28rem;
          background-color: rgba(0,0,0,.3);
          margin: 0 0.16rem;
        }
        &:last-child::after{
            content: '';
            display: none;
          }
      }
      .active{
        color: #000;
      }
    }
    .button{
      font-size: 0.24rem;
      border: 1px solid rgba(0,0,0,.3);
      padding: 0.08rem 0.12rem;
      border-radius: 0.2rem;
      display: flex;
      align-items: center;
      .icon{
        font-size: 0.12rem;
      }
    }
  }
  .scroll_mode{
    .mode_content{
      display: inline-flex;
      box-sizing: border-box;
      padding-left: 0.36rem;
      .item{
        margin-right: 0.2rem;
        flex: 1;
        .swip{
          display: flex;
          flex-direction: column;
          flex: 1;
          // flex-wrap: wrap;
          white-space: normal;
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
            overflow-x: hidden;
            text-align: left;
            line-height: 0.32rem;
          }
        }
      }
    }
  }
</style>

