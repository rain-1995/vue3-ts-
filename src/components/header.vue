<template>
  <div class="header" :style="{'backgroundColor': headerColor}">
    <div class="more" @click="showMenu = true">
      <svg-icon icon-class="cebianlan" />
    </div>
    <div class="content">
      <div class="search">
        <svg-icon icon-class="search" class="icon" />
        <span class="text">{{ showKeyword }}</span>
      </div>
      <div class="right_btn">
        <!-- <svg-icon icon-class="yinfu" class="yinfu" /> -->
        <div v-if="storeState.songInfo.value?.id" class="song_play">
          <div
            class="img"
            :class="[storeState.playing.value ? '' : 'stop']"
            @click="playState"
          >
            <img :src="storeState.songInfo.value.al.picUrl" alt="">
          </div>
        </div>
        <svg-icon v-else icon-class="huatong" />
      </div>
    </div>
    <Popup
      v-model:show="showMenu"
      position="left"
      teleport=""
      style="width:80%;height:100%"
    >
      <div class="menu">
        <div class="user" @click="userCenter">
          <svg-icon v-if="!userInfo?.avatarUrl" icon-class="touxiang" class="avatar_icon" />
          <img v-else :src="userInfo?.avatarUrl" alt="" class="avatar">
          <span class="username">
            {{Object.keys(userInfo).length && userInfo.nickname ? userInfo.nickname : '立即登录'}}
            <svg-icon icon-class="rightjiantou" class="icon" />
          </span>
        </div>
        <div class="vip">
          <div class="top">
            <p>
              <span class="main">开通黑胶VIP</span>
              <span class="sub">立享超21项专属特权 ></span>
            </p>
            <span class="btn">会员中心</span>
          </div>
          <div class="bottom">
            <span>受邀专享，黑胶VIP首月仅1元</span>
          </div>
        </div>
        <div class="set">
          <div v-for="(item, index) in sets" :key="index" class="set_item">
            <p>
              <svg-icon :icon-class="item.icon" class="icon" />
              <span>{{ item.title }}</span>
            </p>
            <p>
              <svg-icon icon-class="rightjiantou" class="icon" />
            </p>
          </div>
        </div>
        <div class="logout set">
          退出登录
        </div>
      </div>
    </Popup>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, reactive, onMounted, computed, nextTick } from 'vue'
import api from '@/api'
import { Popup } from 'vant'
import useState from '@/utils/useState'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'HEADER',
  components: { Popup },
  setup() {
    const storeState = useState('audioPlayer', ['songInfo', 'playing'])
    const user = useState('user', ['userInfo'])
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const sets = reactive([
      { title: '消息中心', icon: 'duanxin' },
      { title: '云贝中心', icon: 'yunbei' }
    ])
    // 状态数据
    const state = reactive({
      showKeyword: '',
      showMenu: false,
      clickCount: <number>0
    })

    const colorMap = {
      my: '#f6f8f9',
      other: '#f5f4f4'
    }

    // 方法
    const methods = {
      // 跳转个人主页
      async userCenter() {
        if (user.userInfo.value && Object.keys(user.userInfo.value).length) {
          router.push('/my')
        } else {
          router.push('/login')
        }
        await nextTick()
        state.showMenu = false
      },
      playState() {
        state.clickCount++
        if (state.clickCount === 2) {
          state.clickCount = 0
          router.push(`/songPlay/${storeState.songInfo.value.id}`)
        }
        setTimeout(() => {
          if (state.clickCount === 1) {
            state.clickCount = 0
            store.commit('audioPlayer/PLAYING', !storeState.playing.value)
          }
        }, 300)
      },
      // 获取默认搜索词
      async searchDefaultWord() {
        const { data }:any = await api.searchDefault()
        state.showKeyword = data.showKeyword
      }
    }

    const headerColor = computed(() => {
      return colorMap?.[<keyof typeof colorMap>route.name] || colorMap['other']
    })

    const userInfo = computed(() => user.userInfo.value)

    onMounted(() => {
      methods.searchDefaultWord()
    })

    return {
      ...toRefs(state),
      ...methods,
      headerColor,
      storeState,
      sets,
      userInfo
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .header{
    width:100%;
    height: 1.2rem;
    display: flex;
    align-items: center;
    padding: 0.3rem 0.2rem;
    box-sizing: border-box;
    position: relative;
    z-index: 999;
    // background: v-bind('color');
    .more{
      margin-right: 0.4rem;
    }
    .content{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      .right_btn{
        float:right;
        overflow: hidden;
        .song_play{
          .img{
            width:0.8rem;
            height:0.8rem;
            position: relative;
            background-color: #fff;
            border-radius: 50%;
            animation: song 3s linear infinite;
            animation-fill-mode:forwards;
            img{
              position: absolute;
              left:50%;
              top:50%;
              transform: translate(-50%,-50%);
              width: 80%;
              height:80%;
              border-radius: 50%;
            }
          }
          .stop{
            animation-play-state:paused;
          }
          @keyframes song {
            from{
              transform: rotate(0deg);
            }
            to{
              transform: rotate(360deg);
            }
          }
        }
      }
      .search{
        width:5rem;
        border-radius: 0.3rem;
        padding: 0.12rem;
        text-align: left;
        background-color: #fff;
        display: flex;
        align-items: center;
        .icon{
          font-size: 0.28rem;
        }
        .text{
          margin-left: 0.2rem;
          font-size: 0.28rem;
          color: rgba(0,0,0,.3);
        }
      }
    }
    .menu{
      width:100%;
      padding:0.4rem 0.36rem 0;
      box-sizing: border-box;
      .user{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .avatar{
          width:0.6rem;
          height: .6rem;
          border-radius: 50%;
          margin-right: 0.1rem;
        }
        .avatar_icon{
          font-size: 0.4rem;
          margin-right: 0.1rem;
        }
        .username{
          display: flex;
          align-items: center;
          font-size: 0.28rem;
          font-weight: bold;
          .icon{
            font-size: 0.2rem;
          }
        }
      }
      .vip{
        width:100%;
        border-radius: 0.2rem;
        background: #161619 linear-gradient(180deg, #462D29 0%, #1E1A1B 100%);
        color:rgba(245, 240, 216, 0.698);
        padding:0.3rem 0.3rem;
        box-sizing: border-box;
        font-size: 0.28rem;
        margin: 0.4rem 0;
        .top{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          & p:first-child{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .sub{
              font-size: 0.24rem;
              margin-top: 0.16rem;
              opacity: .5;
            }
          }
          .btn{
            border: 1px solid rgba(180, 175, 146, 0.698);
            border-radius: 0.6rem;
            padding: 0.08rem 0.12rem;
            box-sizing: border-box;
            font-size: 0.2rem;
          }
        }
        .bottom{
          margin-top: 0.6rem;
          font-size: 0.24rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          opacity: .5;
        }
      }
      .set{
        width: 100%;
        box-shadow: 0 0.04rem 0.24rem 0 rgba(0, 0, 0, 0.1);
        border-radius: 0.2rem;
        font-size: 0.28rem;
        margin-bottom: 1rem;
        .set_item{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.2rem .3rem;
          border-bottom: 1px solid rgba(0,0,0,.1);
          &:last-child{
            border: none;
          }
          & p:first-child{
            display: inline-flex;
            align-items: center;
            .icon{
              margin-right: 0.12rem;
            }
          }
        }
      }
      .logout{
        padding: 0.4rem;
        box-sizing: border-box;
        text-align: center;
        font-weight: bold;
      }
    }
  }

</style>

