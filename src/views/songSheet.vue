<template>
  <div v-if="pageLoaded" class="song_sheet">
    <div
      class="sh_header"
      :class="[detailInfo?.officialPlaylistType?'':'person']"
      :style="{'background-image':`url(${detailInfo.backgroundCoverUrl || detailInfo.coverImgUrl})`}"
    >
      <div
        class="fixed_line"
        :style="{'--url':isScroll ? `url(${detailInfo.backgroundCoverUrl || detailInfo.coverImgUrl})` : ''}"
      >
        <div class="center_title">
          <svg-icon icon-class="rightjiantou" class="back" @click="back" />
          <NoticeBar
            v-show="isScroll"
            class="name scroll_name"
            background="rgba(0,0,0,0)"
            :text="detailInfo.name"
            speed="40"
            :scrollable="isScroll"
            delay="0.3"
          />
          <span v-show="!isScroll" class="name">{{ detailInfo?.officialPlaylistType?'官方动态歌单':'歌单' }}</span>
          <span v-show="isScroll" class="like_btn"><svg-icon icon-class="jiahao" class="search" /> 收藏</span>
        </div>
        <div class="other">
          <!-- <svg-icon icon-class="search" class="search" />
          <svg-icon icon-class="gengduo" class="more" /> -->
        </div>
      </div>
      <!-- 个人歌单 -->
      <div v-if="!detailInfo?.officialPlaylistType" class="info">
        <div class="cover">
          <img :src="detailInfo.coverImgUrl" alt="">
        </div>
        <div class="introduce">
          <p class="title">
            {{ detailInfo.name }}
          </p>
          <p class="author">
            <img :src="detailInfo?.creator?.avatarUrl" alt="">
            <span class="name">{{ detailInfo?.creator?.nickname }}</span>
            <span class="like">+</span>
          </p>
          <p class="desc">
            <span>{{ detailInfo.description }}</span>
            <!-- <svg-icon icon-class="rightjiantou" /> -->
          </p>
        </div>
      </div>
      <!-- 官方歌单 -->
      <div v-else class="official">
        <p class="title">
          {{ formatTitle(detailInfo.name) }}
        </p>
        <p class="update">
          {{ detailInfo.updateFrequency }}
        </p>
        <p class="desc">
          <span>{{ detailInfo.description }}</span>
          <!-- <span class="more">更多</span> -->
        </p>
      </div>
    </div>
    <div class="play_list">
      <div v-cloak class="operate" :style="{opacity:isScroll?0:1}">
        <span class="item">
          <svg-icon icon-class="add" class="icon" />
          <span>{{ formatCount(detailInfo.subscribedCount) }}</span>
        </span>
        <span class="item border">
          <svg-icon icon-class="pinglun" class="icon" />
          {{ formatCount(detailInfo.commentCount) }}
        </span>
        <span class="item">
          <svg-icon icon-class="share" class="icon" />
          {{ formatCount(detailInfo.shareCount) }}
        </span>
      </div>
      <div v-if="playList.length" class="list">
        <div v-for="(item, index) in playList" :key="index" class="list_item" @click="play(item)">
          <span class="left">
            <span class="num">{{ index+1 }}</span>
            <img src="" alt="" class="avatar">
          </span>
          <div class="right">
            <p class="info">
              <span class="main">{{ item.name }}</span>
              <span class="sub">{{ item.authors }}-{{ item.al.name }}</span>
            </p>
            <p class="icon">
              <svg-icon v-if="item.mv !== 0" icon-class="mv_bofang" @click.stop="viewMv(item.mv)" />
              <!-- <svg-icon icon-class="gengduo" class="more" /> -->
            </p>
          </div>
        </div>
      </div>
      <Loading v-else :base-height="8" text="加载中..." style="margin-top: 50px;" />
    </div>
  </div>
  <div v-else class="page-load">
    <Loading :base-height="8" text="加载中..." />
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, reactive, onMounted, nextTick } from 'vue'
import api from '@/api'
import { NoticeBar, Sticky } from 'vant'
import { keysObject } from '@/utils/types'
import { useRoute, useRouter } from 'vue-router'
import util from '@/utils'
import Loading from '@/components/loading.vue'
export default defineComponent({
  name: 'SONGSHEET',
  components: {
    NoticeBar,
    Sticky,
    Loading
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    // 状态数据
    const state = reactive({
      playList: <anyObject[]>[],
      detailInfo: <keysObject>{},
      isScroll: false,
      pageLoaded: false
    })

    // 方法
    const methods = {
      init() {
        this.detail()
        this.getPlayList()
      },
      viewMv(id: number) {
        router.push(`/playVideo/${id}?type=mv`)
      },
      // 官方标题关键字提取
      formatTitle(title:string):string {
        if (title.indexOf('|') !== -1) {
          return title.split('|').filter((item:string) => item.indexOf('雷达') !== -1).join('')
        } else {
          return /\[([^\[\]]*)\]/.exec(title)?.[1] || title
        }
      },
      formatCount(num:number) {
        return util.formatCount(num)
      },
      // 歌单歌曲
      async getPlayList() {
        const { songs }:keysObject = await api.playlistSongs({ id: route.params.id })
        state.playList = songs.map((item:keysObject) => {
          return {
            ...item,
            authors: item.ar.map((a:keysObject) => a.name).join('/')
          }
        })
      },
      // 歌单详情
      async detail() {
        const { playlist }:keysObject = await api.playlistDetail({ id: route.params.id })// 6928102820
        state.detailInfo = playlist
        state.pageLoaded = true
      },
      handleScroll(e:keysObject) {
        const scrollTop:number = Math.floor(e.target.scrollTop)
        state.isScroll = scrollTop > 70
      },
      back() {
        router.back()
      },
      // 播放
      play({ id }:keysObject) {
        router.push(`/songPlay/${id}`)
      }
    }

    onMounted(() => {
      methods.init()
      nextTick(() => {
        document.addEventListener('scroll', methods.handleScroll, true)
      })
    })

    return {
      ...toRefs(state),
      ...methods
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.song_sheet{
  width: 100%;
  height: 100vh;
  overflow: auto;
  background-color: #fff;
  .sh_header{
    width:100%;
    padding-top: 1rem;
    box-sizing: border-box;
    padding-bottom: 1rem;
    position: relative;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 1;
    overflow: hidden;
    color: #fff;
    .fixed_line{
      position: fixed;
      width:100%;
      height:1rem;
      top:0;
      left:0;
      display: flex;
      align-items: center;
      padding: 0.16rem 0.2rem;
      box-sizing: border-box;
      overflow: hidden;
      justify-content: space-between;
      transition: all .4s;
      z-index: 5;
      &::after{
        display: block;
        content: "";
        width: 150%;
        height: 150%;
        position: absolute;
        left: 0;
        bottom: 0;
        // transform: translate(-1rem,-1rem);
        background-image: var(--url);
        background-size: 100% 100%;
        filter: blur(10px) brightness(100%);
        z-index: -1;
      }
      .back{
        transform: rotate(180deg);
        margin-right: 0.16rem;

      }
      .center_title{
        display: flex;
        align-items: center;
        font-size: 0.32rem;
        font-weight: 500;
        .like_btn{
          background: red;
          padding: 0.08rem 0.2rem;
          box-sizing: border-box;
          border-radius: 0.3rem;
          color: #fff;
          font-size: 0.2rem;
          display: flex;
          align-items: center;
        }
        .name{
          padding: 0;
          width:auto;
          margin-right: 0.2rem;
          color: #fff;
        }
        .scroll_name{
          width:2.4rem;
        }
      }
      .other{
        display: inline-flex;
        align-items: center;
        font-size: 0.32rem;
        .search{
          margin-right: 0.4rem;
        }
      }
    }
    .info{
      display: flex;
      align-items: center;
      padding: 0.3rem 0.2rem 0;
      box-sizing: border-box;
      .cover{
        width:2rem;
        height:2rem;
        margin-right: 0.3rem;
        img{
          width:inherit;
          height: inherit;
          border-radius: 0.2rem;
        }
      }
      .introduce{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        flex: 1;
        padding-right: 0.3rem;
        box-sizing: border-box;
        .title{
          text-align: left;
          line-height: 0.44rem;
          font-size: 0.32rem;
        }
        .author{
          margin: 0.3rem 0 0.4rem 0;
          display: flex;
          align-items: center;
          img{
            width:0.4rem;
            height:0.4rem;
            border-radius: 50%;
          }
          .name{
            font-size: 0.24rem;
            color: rgba(255,255,255,.6);
            margin: 0 0.1rem;
          }
          .like{
            display: inline-block;
            color: #fff;
            width:0.4rem;
            height: 0.3rem;
            border-radius: 30%;
            background: rgba(255, 255, 255, 0.2);
            text-align: center;
            line-height: .3rem;
            font-size: 0.36rem;
          }
        }
        .desc{
          display: inline-flex;
          align-items: center;
          font-size: 0.24rem;
          color: rgba(255,255,255,.6);
          & span{
            display: -webkit-box;
            word-break: break-all;
            overflow:hidden;
            text-overflow:ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    .official{
      width:100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.24rem;
      padding: 0 0.4rem;
      margin-top: 3rem;
      box-sizing: border-box;
      .title{
        font-size: 0.4rem;
        font-weight: bold;
        color: #fff;
      }
      .update{
        margin: 0.2rem 0;
      }
      .desc{
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        word-break: break-all;
        align-items: flex-end;
        line-height: 0.36rem;
        & span:first-child{
          width: 100%;
          display: -webkit-box;
          word-break: break-all;
          overflow:hidden;
          text-overflow:ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .more{
          color: #fff;
          font-weight: bold;
          white-space:nowrap;
        }
      }
    }
  }
  .person::after{
    display: block;
    content: "";
    width: 150%;
    height: 150%;
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(-1rem,-1rem);
    background-image: inherit;
    background-size: 100% 100%;
    filter: blur(20px) brightness(80%);
    z-index: -2;
  }
  .play_list{
    position: relative;
    width: 100%;
    height: auto;
    .operate{
      position: absolute;
      top:0;
      left:50%;
      transform: translate(-50%,-50%);
      background: #fff;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      z-index: 2;
      padding: 0.2rem 0.2rem;
      box-sizing: border-box;
      box-shadow: 0 0.04rem 0.24rem 0 rgba(0, 0, 0, 0.1);
      transition: all .3s;
      .item{
        display: inline-flex;
        align-items: center;
        padding: 0 0.4rem;
        font-size: 0.28rem;
        white-space: nowrap;
        .icon{
          margin-right: 0.1rem;
          font-size: 0.24rem;
        }
      }
      .border{
        border-left:1px solid rgba(0,0,0,.2) ;
        border-right:1px solid rgba(0,0,0,.2) ;
      }
    }
    .list{
      width:100%;
      overflow: auto;
      padding-top: 1rem;
      box-sizing: border-box;
      .list_item{
        display: flex;
        align-items: center;
        padding: 0.2rem;
        box-sizing: border-box;
        .left{
          font-size: 0.24rem;
          color: rgba(0,0,0,.3);
          margin-right: 0.3rem;
          .num{
            font-size: 0.28rem;
          }
        }
        .right{
          display: inline-flex;
          align-items: center;
          flex: 1;
          justify-content: space-between;
          width:0;
          .info{
            font-size: 0.28rem;
            font-weight: 500;
            margin-right: 0.2rem;
            box-sizing: border-box;
            min-width:0;
              &>span{
                display: block;
                text-align: left;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
              }
            .sub{
              margin-top: 0.16rem;
              color:rgba(0,0,0,.4);
              font-size: 0.24rem;
            }
          }
          .icon{
            display: inline-flex;
            align-items: center;
            color: rgba(0, 0, 0, 0.3);
            font-size: 0.24rem;
            margin-right: 0.3rem;
            .more{
              margin-left: 0.2rem;
            }
          }
        }
      }
    }
  }
  .fixed_list{
    position: fixed;
    left:0;
    top:1rem;
    z-index: 10;
  }
}
.page-load{
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top: 4rem;

}
</style>

