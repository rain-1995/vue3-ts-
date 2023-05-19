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
      <div class="button" @click="toSheet">
        <span>更多<i class="iconfont icon-xiangxiajiantou" /></span>
      </div>
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
                  <div class="swip" @click="handleClick(swip)">
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
              <div v-for="(item, index) in block.resources" :key="index" class="swip" @click="handleClick(item)">
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
import { defineComponent, toRefs, reactive, onMounted } from 'vue'
import { Swipe, SwipeItem } from 'vant'
import { keysObject } from '@/utils/types'
import { useRouter } from 'vue-router'
import util from '@/utils'
export default defineComponent({
  name: 'SCROLLMODEL',
  components: { Swipe, SwipeItem },
  props: {
    modeData: {
      default: {},
      type: Object

    }
  },
  setup(props, { emit }) {
    // 状态数据
    const state = reactive({
      data: props.modeData
    })

    const router = useRouter()

    // 方法
    const methods = {
      formatCount(num:number) {
        return util.formatCount(num)
      },
      // 点击操作，交给父组件处理
      handleClick(data:keysObject) {
        emit('handleClick', data)
      },
      toSheet() {
        router.push('/sheetSquare')
      }
    }

    // 计算属性
    const computes = {}

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...methods,
      ...computes,
      router
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
      padding-top: .08rem;
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
      height:.44rem;
      width: 0.96rem;
      font-size: 0.24rem;
      border: 1px solid rgba(0,0,0,.3);
      // padding: 0.08rem 0.12rem;
      border-radius: 0.2rem;
      display: flex;
      align-items: center;
      text-align: center;
      // justify-content: space-around;
      padding-left: 0.14rem;
      box-sizing: border-box;
      i{
        font-size: 0.12rem;
        transform: rotate(-90deg);
        display: inline-block;
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

