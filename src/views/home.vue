<template>
  <div>
    <refresh :loading="loading" />
    <van-pull-refresh v-model="pullUp" @refresh="onRefresh">
      <div class="home">
        <Swipe class="my-swipe" indicator-color="white" autoplay="5000">
          <SwipeItem v-for="(item, index) in bannerList" :key="index" @click="bannerDetail(item)">
            <div class="img_item">
              <img :src="item.pic" alt="">
              <span class="type_title" :style="{background:item.titleColor}">{{ item.typeTitle }}</span>
            </div>
          </SwipeItem>
        </Swipe>
        <!-- 金刚区图标 -->
        <div class="icon_scroll">
          <scroll
            :data="iconList"
            scroll-dom="icon_wrapper"
            :scroll-x="true"
          >
            <div class="scroll-wrapper icon_wrapper">
              <div class="scroll-content icon_content">
                <div v-for="(item, index) in iconList" :key="index" class="icon_item">
                  <span class="icon">
                    <img :src="item.iconUrl" alt="">
                    <span v-if="item.id == -1" class="date">{{ new Date().getDate() }}</span>
                  </span>
                  <span class="title">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 主内容 -->
        <div v-if="mainContent.length > 0" class="content">
          <div class="content_d">
            <div v-for="(item, index) in mainContent" :key="index" class="mode">
              <scroll-model v-if="item.showType == 'HOMEPAGE_SLIDE_PLAYLIST'" :mode-data="item" />
              <swiper-model v-else :mode-data="item" class="swiper_mode" />
            </div>
          </div>
        </div>
        <div class="bottom">
          {{ pageConfig.nodataToast }}
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted, nextTick } from 'vue'
import { Swipe, SwipeItem } from 'vant'
import api from '@/api'
import scrollModel from '@/components/scrollmodel.vue'
import swiperModel from '@/components/swiperModel.vue'
import refresh from '@/components/refresh.vue'
export default defineComponent({
  name: 'HOME',
  components: {
    Swipe,
    SwipeItem,
    scrollModel,
    swiperModel,
    refresh
  },
  setup(props, context) {
    // 状态数据
    const state = reactive({
      loading: true,
      pullUp: true,
      bannerList: [],
      iconList: [],
      mainContent: [],
      pageConfig: {},
      blockId: 1
    })
    // 方法
    const methods = {
      init() {
        this.getBanner()
        this.getIconList()
        this.getPageData()
      },
      // 首页模块数据
      async getPageData() {
        // 只取对应模块的数据，其他模块暂不处理
        const pageModes = [
          'HOMEPAGE_SLIDE_PLAYLIST',
          'HOMEPAGE_SLIDE_SONGLIST_ALIGN',
          'HOMEPAGE_NEW_SONG_NEW_ALBUM',
          // 'SHUFFLE_MUSIC_CALENDAR',
          'SLIDE_PODCAST_VOICE_MORE_TAB'
          // 'SLIDE_PLAYABLE_DRAGON_BALL_MORE_TAB'
        ]
        const { data: { blocks, pageConfig }}:any = await api.pageData()
        nextTick(() => {
          setTimeout(() => {
            state.loading = false
          }, 1000)
        })
        state.pageConfig = pageConfig
        const result = blocks.filter((item:object|any) => pageModes.includes(item.showType))
        // 将有tab的模块单独处理，将总数组分成一个tab对应一个tab数组
        state.mainContent = result.map((item:any) => {
          if (!item.uiElement || !item.uiElement.subTitle) {
            const formatCreatives:object[] = []
            item.creatives.map((_k:any) => {
              const cur = {
                label: _k.uiElement.mainTitle.title,
                data: [_k]
              }
              if (formatCreatives.length === 0) {
                formatCreatives.push({ ...cur })
              } else {
                const flag = formatCreatives.some((_f:any) => {
                  if (_f.label === _k.uiElement.mainTitle.title) {
                    _f.data.push(_k)
                    return true
                  }
                })
                if (!flag) {
                  formatCreatives.push({ ...cur })
                }
              }
            })
            return {
              ...item,
              formatCreatives,
              hasTabs: true,
              id: state.blockId++
            }
          }
          return {
            ...item,
            hasTabs: false,
            id: state.blockId++
          }
        })
      },
      // 轮播图
      async getBanner() {
        const { banners }:any = await api.swiperList({ type: 1 })
        state.bannerList = banners
      },
      // 轮播图跳转
      bannerDetail(banner:any) {
        const { targetType, url, targetId } = banner
        if (targetType === 3000) {
          window.location.href = url
        }
      },
      // 金刚区图标列表
      async getIconList() {
        const { data }:any = await api.homeIconList()
        state.iconList = data
      },
      onRefresh() {
        setTimeout(() => {
          state.pullUp = false
        }, 1000)
      }
    }

    // 计算属性
    const computes = {}

    onMounted(() => {
      methods.init()
    })

    return {
      ...toRefs(state),
      ...methods,
      ...computes
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.home{
  width:100%;
  margin-top: 0.12rem;
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 0.4rem;
    text-align: center;
    padding: 0 0.36rem;
    box-sizing: border-box;
    .img_item{
      width: 100%;
      height:2.8rem;
      position: relative;
      img{
        width:100%;
        height:100%;
        border-radius: 0.16rem;
      }
      .type_title{
        position: absolute;
        right:0;
        bottom:0;
        border-radius: 0.16rem 0 0.16rem 0;
        font-size: 0.2rem;
        color:#fff;
        // font-weight: bold;
        padding: 0.08rem 0.12rem;
      }
    }
  }
  .icon_scroll{
    width:100%;
    overflow: hidden;
    margin-top: 0.4rem;
    border-bottom: .5px solid rgba(0,0,0,.1);
    padding-bottom: 0.2rem;
    .icon_wrapper{
      .icon_content{
        display: inline-flex;
        padding-left: 0.36rem;
        box-sizing: border-box;
        .icon_item{
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 0.4rem;
          color: rgba(0,0,0,.6);
          position: relative;
          z-index: 99;
          .title{
            font-size: 0.24rem;
            font-weight: 500;
          }
          .icon{
            width:0.9rem;
            height:0.9rem;
            border-radius: 50%;
            background-color: rgb(250, 233, 236);
            margin-bottom: 0.12rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            img{
              width:100%;
              height:100%;
              -webkit-filter: drop-shadow(1rem 0 rgba(255, 88, 88,1));
              -moz-filter: drop-shadow(1rem 0 rgba(255, 88, 88,1));
              -o-filter: drop-shadow(1rem 0 rgba(255, 88, 88,1));
              filter: drop-shadow(1rem 0 rgba(255, 88, 88,1));
              position: relative;
              left: -1rem;
            }
            .date{
              position: absolute;
              left: 50%;
              top: 55%;
              transform: translate(-50%,-50%);
              color: #fff;
              font-size: 0.16rem;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
  .content{
    width: 100%;
    overflow: hidden;
    .content_d{
      width: 100%;
      box-sizing: border-box;
      .mode{
        overflow: hidden;
        width: 100%;
        // background-color: rgb(255, 253, 253);
        border-bottom: 0.2rem solid rgb(241, 241, 241);
        padding-bottom: 0.3rem;
        box-sizing: border-box;
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
        .swiper_mode{
          width: 100%;
          .swip{
            padding-left: 0.36rem;
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
                }
                .sub{
                  font-size: 0.24rem;
                  text-align: left;
                }
              }
            }
          }
        }
      }
    }
  }
  .bottom{
    width: 100%;
    padding: 0.4rem 0;
    box-sizing: border-box;
    font-size: 0.28rem;
  }
}

</style>
