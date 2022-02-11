<template>
  <div class="song_sheet">
    <div class="sh_header">
      <div class="fixed_line">
        <div class="center_title">
          <svg-icon icon-class="rightjiantou" class="back" />
          <!-- <NoticeBar class="name" color="#1989fa" background="rgba(0,0,0,0)" text="歌单" /> -->
          <span class="name">歌单</span>
          <span class="like_btn">+ 收藏</span>
        </div>
        <div class="other">
          <svg-icon icon-class="search" class="search" />
          <svg-icon icon-class="gengduo" class="more" />
        </div>
      </div>
      <div class="info">
        <div class="cover">
          <img src="http://p1.music.126.net/mmIej50zZqPhp99q8Z5vhQ==/109951166466175512.jpg" alt="">
        </div>
        <div class="introduce">
          <p class="title">春风十里不如你</p>
          <p class="author">
            <img src="" alt="">
            <span>hhh</span>
            <span>+</span>
          </p>
          <p class="desc">
            adsfffffffffff
            <svg-icon icon-class="rightjiantou" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import api from '@/api'
import { NoticeBar } from 'vant'
export default defineComponent({
  name: 'SONGSHEET',
  components:{
    NoticeBar
  },
  setup(props, context) {
    // 状态数据
    const state = reactive({})

    // 方法
    const methods = {
      init() {
        this.detail()
      },
      async detail() {
        const res = await api.playlistDetail({ id: 3136952023 })
        const ress = await api.playlistSongs({ id: 3136952023 })
        // const resss = await api.hotTopic()
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
.song_sheet{
  width: 100%;
  .sh_header{
    width:100%;
    // height: 6rem;
    padding-top: 1rem;
    box-sizing: border-box;
    padding-bottom: 1rem;
    position: relative;
    // background: url('http://p1.music.126.net/mmIej50zZqPhp99q8Z5vhQ==/109951166466175512.jpg') 0 0 no-repeat;
    // background-size: 100% 100%;
    z-index: 1;
    overflow: hidden;
    color: #fff;
    &::after{
      display: block;
      content: "";
      width: 150%;
      height: 150%;
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-1rem,-1rem);
      background: url('http://p1.music.126.net/mmIej50zZqPhp99q8Z5vhQ==/109951166466175512.jpg') 0 0 no-repeat;
      background-size: 100% 100%;
      filter: blur(20px) brightness(80%);
      z-index: -1;
    }
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
      .back{
        transform: rotate(180deg);
        margin-right: 0.16rem;

      }
      .center_title{
        display: flex;
        align-items: center;
        font-size: 0.36rem;
        font-weight: 500;
        .like_btn{
          background: red;
          padding: 0.12rem 0.16rem;
          box-sizing: border-box;
          border-radius: 0.3rem;
          color: #fff;
          font-size: 0.24rem;
        }
        .name{
          max-width:3rem;
          padding: 0;
          width:auto;
          margin-right: 0.2rem;
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
      // justify-content: space-between;
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
        .author{
          margin: 0.3rem 0;
        }
        .desc{
          display: inline-flex;
          align-items: center;
        }
      }
    }
  }
}
</style>

