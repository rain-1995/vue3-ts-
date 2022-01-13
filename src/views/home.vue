<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
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
      <div class="content">
        <div class="content_d">
          <div v-for="(item, index) in mainContent" :key="index" class="mode">
            <div class="header">
              <div class="title">
                <span>歌单</span>
              </div>
              <span class="button">更多<svg-icon icon-class="rightjiantou" class="icon" /></span>
            </div>
            <div v-if="item.showType == 'HOMEPAGE_SLIDE_PLAYLIST'">
              <scroll
                :data="bannerList"
                :scroll-dom="`scroll_mode${index}`"
                :scroll-x="true"
              >
                <div class="scroll-wrapper scroll_mode" :class="`scroll_mode${index}`">
                  <div class="scroll-content mode_content">
                    <div v-for="(block, index) in item.creatives" :key="index" class="item">
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
                        <div class="swip">
                          <span class="pic">
                            <img :src="block.uiElement.image.imageUrl" alt="">
                          </span>
                          <div class="name">
                            {{ block.uiElement.mainTitle.title }}
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </scroll>
            </div>
            <div v-else class="swiper_mode">
              <Swipe class="" indicator-color="white" :width="340" :loop="false">
                <SwipeItem>
                  <div class="swip">
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                  </div>
                </SwipeItem>
                <SwipeItem>
                  <div class="swip">
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                  </div>
                </SwipeItem>
              </Swipe>
            </div>
          </div>
          <!-- <div class="mode">
            <div class="header">
              <div class="title">
                <span>播客|有声书</span>
              </div>
              <span class="button">更多<svg-icon icon-class="rightjiantou" class="icon" /></span>
            </div>
            <div class="swiper_mode">
              <Swipe class="" indicator-color="white" :width="340" :loop="false">
                <SwipeItem>
                  <div class="swip">
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                  </div>
                </SwipeItem>
                <SwipeItem>
                  <div class="swip">
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                    <div class="list_item">
                      <span class="avatar">
                        <img src="http://p1.music.126.net/S5Q1O1fpCFTxgpHONWJQNw==/109951166920022773.jpg" alt="">
                      </span>
                      <div class="info">
                        <span class="main">teqtetqt</span>
                        <span class="sub">teqtetqt</span>
                      </div>
                    </div>
                  </div>
                </SwipeItem>
              </Swipe>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </van-pull-refresh>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import { Col, Swipe, SwipeItem } from 'vant'
import api from '@/api'
export default defineComponent({
  name: 'HOME',
  components: { Swipe, SwipeItem },
  setup(props, context) {
    // 状态数据
    const state = reactive({
      loading: true,
      bannerList: [],
      iconList: [],
      mainContent: []
    })
    // 方法
    const methods = {
      init() {
        console.log(`this`, this)
        this.getBanner()
        this.getIconList()
        this.getPageData()
      },
      async getPageData() {
        const { data: { blocks, pageConfig }}:any = await api.pageData()
        state.mainContent = blocks.filter((item:object|any) => (item.showType) != 'BANNER')
        console.log(`object`, state.mainContent)
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
          state.loading = false
        }, 1000)
      }
    }

    // 计算属性
    const computes = {}

    onMounted(() => {
      methods.init()
      // api.pageData()
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
          z-index: 999;
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
                  img{
                    width: 100%;
                    height: 100%;
                    border-radius: 0.16rem;
                  }
                }
                .name{
                  font-size: 0.24rem;
                  word-break: break-all;
                  overflow-wrap: break-word;
                  overflow-x: hidden;
                  text-align: left;
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
                .main{
                  font-size: 0.32rem;
                  font-weight: bold;
                  margin-bottom: 0.2rem;
                }
                .sub{
                  font-size: 0.24rem;
                }
              }
            }
          }
        }
      }
    }
  }
}

</style>
