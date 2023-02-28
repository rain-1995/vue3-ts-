<template>
  <div class="header" :style="{'backgroundColor': headerColor}">
    <div class="more" @click="showMenu = true">
      <svg-icon icon-class="cebianlan" />
    </div>
    <div class="content">
      <div class="search" @click="toSearch">
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
    <!-- 左侧菜单弹出组件 -->
    <pop-menu v-model:show="showMenu"/>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, reactive, onMounted, computed, nextTick } from 'vue'
import api from '@/api'
import { Popup } from 'vant'
import useState from '@/utils/useState'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import PopMenu from './pop-menu.vue'
export default defineComponent({
  name: 'HEADER',
  components: { Popup, PopMenu },
  setup() {
    const storeState = useState('audioPlayer', ['songInfo', 'playing'])
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 状态数据
    const state = reactive({
      showKeyword: '',
      showMenu: false,
      clickCount: <number>0
    })

    const colorMap = {
      home: 'rgba(0,0,0,0)',
      my: '#f6f8f9',
      other: '#f5f4f4'
    }

    // 方法
    const methods = {
      toSearch() {
        router.push(`/search?keyword=${state.showKeyword}`)
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

    onMounted(() => {
      methods.searchDefaultWord()
    })

    return {
      ...toRefs(state),
      ...methods,
      headerColor,
      storeState
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
    
  }

</style>

