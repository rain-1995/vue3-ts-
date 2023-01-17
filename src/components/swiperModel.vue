<template>
  <div>
    <div class="header">
      <div class="title">
        <span v-if="!modeData.hasTabs">{{ modeData.uiElement.subTitle.title }}</span>
        <div v-else class="title_tab">
          <span
            v-for="(tab, index) in modeData.formatCreatives"
            :key="index"
            class="tab_title"
            :class="[index == tabIndex ? 'active' : '']"
            @click="handleTab(index)"
          >
            {{ tab.label }}
          </span>
        </div>
      </div>
      <!-- <span class="button">更多<svg-icon icon-class="rightjiantou" class="icon" /></span> -->
    </div>
    <div class="swiper_mode">
      <Swipe ref="swiperRef" class="" :lazy-render="true" :show-indicators="false" width="340" :loop="false">
        <SwipeItem v-for="(swip, index) in modeData.hasTabs?modeData.formatCreatives[tabIndex].data:modeData.creatives" :key="index" class="s_item">
          <div class="swip" :class="[modeData.blockCode == 'HOMEPAGE_BLOCK_TOPLIST'?'border':'']">
            <div v-if="modeData.blockCode == 'HOMEPAGE_BLOCK_TOPLIST'" class="toplist">
              <span class="name">{{ swip.uiElement?.mainTitle?.title }}</span>
              <svg-icon icon-class="rightjiantou" class="icon" />
            </div>
            <div
              v-for="(swipItem, index) in swip.resources"
              :key="swipItem.resourceId"
              class="list_item"
              @click="play(swipItem)"
            >
              <span class="avatar">
                <img :src="swipItem.uiElement.image.imageUrl" alt="">
              </span>
              <div class="info">
                <span class="main">{{ swipItem?.uiElement?.mainTitle?.title }}</span>
                <span class="sub">{{ swipItem?.uiElement?.subTitle?.title }}</span>
              </div>
            </div>
          </div>
        </SwipeItem>
      </Swipe>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted, nextTick } from 'vue'
import { Swipe, SwipeItem } from 'vant'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'SWIPERMODEL',
  components: { Swipe, SwipeItem },
  props: {
    modeData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, context) {
    const swiperRef = ref()
    const router = useRouter()
    // 状态数据
    const { modeData: { formatCreatives = {}}} = props
    const state = reactive({
      modeData: props.modeData,
      currentTab: formatCreatives[0]?.label || '',
      tabIndex: 0
    })

    // 方法
    const methods = {
      handleTab(index:number) {
        state.tabIndex = index
        swiperRef.value.swipeTo(0, { immediate: true })
      },
      play(song:any) {
        if (song.resourceType === 'song') {
          router.push(`/songPlay/${song.resourceId}`)
        }
      }
    }

    // 计算属性
    const computes = {}

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...methods,
      ...computes,
      swiperRef
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
  .swiper_mode{
    width: 100%;
    .swip{
      margin-left: 0.36rem;
      .toplist{
        display: flex;
        align-items: center;
        font-size: 0.32rem;
        font-weight: bold;
        justify-content: center;
        padding: 0.2rem 0 0.3rem;
        box-sizing: border-box;
        .icon{
          font-size: 0.24rem;
          color:rgba(0,0,0,.5);
          margin-left: 0.12rem;
        }
      }
      .list_item{
        display: flex;
        align-items: flex-end;
        padding:0.16rem 0;
        border-bottom: .5px solid rgba(0,0,0,.2);
        &:last-child{
          border-bottom: none;
        }
        .avatar{
          width: 0.9rem;
          height: 0.9rem;
          margin-right: 0.2rem;
          img{
            width: 100%;
            height: 100%;
            border-radius: 0.16rem;
          }
        }
        .info{
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
          padding-right: 0.2rem;
          box-sizing: border-box;
          .main{
            font-size: 0.28rem;
            font-weight: bold;
            margin-bottom: 0.2rem;
            text-align: left;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .sub{
            font-size: 0.24rem;
            text-align: left;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    .border{
      // width:90%;
      box-shadow: 0 0.04rem 0.24rem 0 rgba(0, 0, 0, 0.1);
      margin: 0.2rem 0 0.2rem 0.36rem;
      border-radius: 0.3rem;
      padding: 0.2rem;
      box-sizing: border-box;
      .list_item{
        border: none;
      }
    }
    .s_item:last-child .border{
      margin-right: 0.3rem;

    }
  }
</style>
