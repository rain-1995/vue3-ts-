<template>
  <div class="home-page">
    <!-- 头像用户信息 -->
    <div class="user-card">
      <img class="avatar" :src="userInfo.avatarUrl" alt="">
      <div class="info">
        <span class="name">{{ userInfo.nickname }}</span>
        <p class="count">
          <span>{{ userDetailInfo?.profile?.follows || 0 }} 关注</span>
          <span class="add-line">{{ userDetailInfo?.profile?.followeds || 0 }} 粉丝</span>
          <span>Lv.{{ userDetailInfo?.level }}</span>
        </p>
      </div>
    </div>

    <!-- 功能模块 -->
    <div class="modules">
      <li v-for="(item, index) in moduleList" :key="index" class="m-item">
        <i class="iconfont" :class="[item.icon]" />
        <span class="title">{{ item.title }}</span>
      </li>
    </div>

    <div class="play-item my-like" @click="playListDetail(playListObj?.liked)">
      <div class="left">
        <img class="cover" :src="playListObj?.liked?.coverImgUrl" alt="">
        <p class="content">
          <span>我喜欢的音乐</span>
          <span class="count">{{ playListObj?.liked?.trackCount }}首</span>
        </p>
      </div>
      <div class="right" @click="heartModel()">
        <i class="iconfont icon-xindong" />
        <span>心动模式</span>
      </div>
    </div>

    <div class="tab-list">
      <Tabs
        ref="tabRef"
        v-model:active="curTab"
        scrollspy
        sticky
        background="rgba(0,0,0,0)"
        offset-top="1.2rem"
        @scroll="handleScroll"
      >
        <Tab title="创建歌单">
          <song-list title="创建歌单" :list="playListObj.created" :show-author="false" />
        </Tab>
        <Tab title="收藏歌单">
          <song-list title="收藏歌单" :list="playListObj.collected" :show-author="true" />
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Tab, Tabs } from 'vant'
import { useStore } from 'vuex'
import api from '@/api'
import { keysObject, userDetailType } from '@/utils/types'
import SongList from './components/song-list.vue'
import router from '@/router'

interface playListType {
  liked: keysObject,
  created: playListItemType[],
  collected: playListItemType[]
}
interface playListItemType { // 歌曲类型接口定义
  name: string,
  coverImgUrl: string,
  trackCount: number | string,
  creator: {nickname:string},
  id: number
}

interface profile extends userDetailType {
  profile: {
    follows: number,
    followeds: number
  }
}

const store = useStore()

const curTab = ref(0)

const playListObj = ref({} as playListType) // 用户歌单

const tabFixed = ref(false)

const tabRef = ref()

const userDetailInfo = ref({} as profile)

const moduleList = reactive([
  { icon: 'icon-24gf-playCircle', title: '最近播放' },
  { icon: 'icon-gongwenbao', title: '已购' },
  { icon: 'icon-haoyoutuijie', title: '我的好友' },
  { icon: 'icon-shoucang', title: '收藏和赞' }
])

const userInfo = computed(() => store?.state?.user?.userInfo || {})

function playListDetail(data: {id:number}) {
  router.push(`/songSheet/${data.id}`)
}

function getUserDetail() {
  if (userInfo.value.userId) {
    store.dispatch('user/userDetail', userInfo.value).then(res => {
      userDetailInfo.value = res || {}
    })
  }
}

// 获取我的所有歌单
async function getMyPlayList() {
  api.userDetail({ uid: userInfo.value.userId })
  const result:keysObject = await api.userPlayList({ uid: userInfo.value.userId })
  result.playlist && result.playlist.forEach((item:keysObject) => {
    switch (item.specialType) {
      case 5: // 我喜欢的
        playListObj.value.liked = item
        break
      case 0: // 我创建和收藏的
      case 20: // 我的年度歌单
        if (item.userId == userInfo.value.userId) {
          playListObj.value.created = [...(playListObj.value?.created || []), item]
        } else {
          playListObj.value.collected = [...(playListObj.value?.collected || []), item]
        }
        break
    }
  })
}

function handleScroll({ isFixed }: {isFixed: boolean}) {
  if (isFixed != tabFixed.value) {
    tabRef.value.resize()
  }
  tabFixed.value = isFixed
}

function init() {
  getMyPlayList()
  getUserDetail()
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.home-page{
  background-color: #f6f8f9;
  padding: 0 0.4rem;
  box-sizing: border-box;
}
.user-card{
  display: flex;
  flex-direction: column;
  align-items: center;
  widtH:100%;
  height:2.4rem;
  background-color: #fff;
  padding: 0.2rem;
  box-sizing: border-box;
  border-radius: 0.16rem;
  position: relative;
  margin-top: 0.8rem;
  margin-bottom: 0.4rem;
  .avatar{
    position: absolute;
    left:50%;
    top: 0;
    transform: translate(-50%,-50%);
    widtH:1.4rem;
    height:1.4rem;
    border-radius: 50%;
  }
  .info{
    margin-top: .7rem;
    .name{
      display: inline-block;
      font-size: 0.4rem;
      font-weight: bold;
      margin-bottom: 0.2rem;
    }
    .count{
      font-size: 0.3rem;
      color:#555555;
    }
    .add-line{
      display: inline-flex;
      align-items: center;
      margin: 0 0.2rem 0 0.2rem;
      &::before,&::after{
        content: '';
        width:1px;
        height:0.2rem;
        background-color: rgba(0,0,0,.3);

      }
      &::before{
        margin-right: 0.2rem;
      }
      &::after{
        margin-left: .2rem;
      }
    }
  }

}

.modules{
  background-color: #fff;
  padding: 0.36rem 0.4rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
  border-radius: 0.16rem;
  .m-item{
    width:25%;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.26rem;
    color: rgba(0,0,0,.7);
    i{
      font-size: 0.6rem;
      color: red;
      margin-bottom: 0.16rem;
    }
  }
}

.play-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left{
    display: inline-flex;
    align-items: center;
    .cover{
      width:1rem;
      height: 1rem;
      border-radius: 0.16rem;
      margin-right: 0.2rem;
    }
    .content{
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      font-size: 0.28rem;
      .count{
        color: rgba(0,0,0,.3);
        margin-top: 0.12rem;
        font-size: 0.24rem;
      }
    }
  }
  .right{
    display: flex;
    align-items: center;
  }
}

.my-like{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 0.2rem 0.3rem;
  box-sizing: border-box;
  margin: 0.4rem 0 0.6rem 0;
  border-radius: 0.16rem;
  .right{
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 0.6rem;
    padding: 0.12rem 0.1rem;
    font-size: 0.24rem;
  }
}
:deep(.tab-list){
  .van-tabs__wrap{
    height: auto;
  }
  .van-sticky--fixed{
    background-color: #f6f8f9;
    width: 100% !important;
    left: 0;

  }
  .van-tab{
    margin-bottom: .1rem;
    font-weight: bold;
    .van-tab__text{
      color: #1d1c1c;
      opacity: .6;
    }
  }
  .van-tab--active{
    .van-tab__text{
      opacity: 1;
    }
  }
  .van-tabs__line{
    width:0.4rem;
  }
}
</style>
