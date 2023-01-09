<template>
  <div @click="login" class="home-page">
    <!-- 头像用户信息 -->
    <div class="user-card">
      <img class="avatar" src="http://p1.music.126.net/AGYPBWsU88s_f6j7E18MWw==/109951167975276751.jpg" alt="">
      <div class="info">
        <span class="name">渣男</span>
        <p class="count">
          <span>0 关注</span>
          <span class="add-line">0 粉丝</span>
          <span>Lv.6</span>
        </p>
      </div>
    </div>

    <!-- 功能模块 -->
    <div class="modules">
      <li v-for="(item, index) in moduleList" :key="index" class="m-item">
        <i class="iconfont" :class="[item.icon]"></i>
        <span class="title">{{item.title}}</span>
      </li>
    </div>

    <div class="my-like">
      <div class="left">
        <img src="" alt="">
        <p class="content">
          <span>我喜欢的音乐</span>
          <span class="count">100首</span>
        </p>
      </div>
      <div class="right">
        <i class="iconfont"></i>
        <span>心动模式</span>
      </div>
    </div>

    <div class="tab-list">
      <Tabs v-model:active="curTab" scrollspy sticky>
        <Tab title="创建歌单">
          内容
        </Tab>
        <Tab title="收藏歌单">
          内容
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Tab, Tabs } from 'vant'

const moduleList = reactive([
  { icon: 'icon-24gf-playCircle', title: '最近播放' },
  { icon: 'icon-gongwenbao', title: '已购' },
  { icon: 'icon-haoyoutuijie', title: '我的好友' },
  { icon: 'icon-shoucang', title: '收藏和赞' }
])

const curTab = ref(0)


</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.home-page{
  background-color: rgb(245, 245, 245);
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

.my-like{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 0.6rem 0.4rem;
  box-sizing: border-box;
  margin: 0.4rem 0 0.6rem 0;
  border-radius: 0.16rem;
}
</style>
