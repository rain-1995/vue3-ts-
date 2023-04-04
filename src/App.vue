<template>
  <div class="layout">
    <template v-if="!route.meta?.fullScreen||false">
      <Header />
      <router-view id="view" class="view" />
      <TabBar />
    </template>
    <template v-else>
      <router-view id="view" v-slot="{Component}" class="view" style="height:100%;padding-bottom:0;">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
    <AudioPlayer style="display:none;" />
  </div>
</template>

<script lang='ts'>
import { useRoute } from 'vue-router'
import { defineComponent, toRefs, reactive, watch, computed, ref } from 'vue'
import Header from '@/components/header.vue'
import TabBar from '@/components/tabBar.vue'
import { useStore } from 'vuex'
import useState from '@/utils/useState'
export default defineComponent({
  name: 'LAYOUT',
  components: { Header, TabBar },
  setup() {
    const store = useStore()

    // 状态数据
    const state = reactive({
      route: useRoute()
    })

    const storeState = useState('base', ['useGradualColor'])

    const colorCollect = ['#7B6AE0', '#FFBB89', '#8DA2EE', '#FFADF7', '#B1FF96']

    const randomColor = computed(() => {
      return colorCollect[Math.floor(Math.random() * 5)]
    })

    // 渐变背景色
    const gradualColor = ref(`linear-gradient(to bottom, ${randomColor.value} 0, #fff 30% )`)

    // 普通背景色
    const normalColor = ref('rgba(245, 244, 244,.7)')

    // 登录后获取用户信息
    watch(() => store.state.user.userInfo, (val = {}) => {
      store.dispatch('user/loginStatus').then(res => {
        if (res?.data?.account) {
          if (!val || !Object.keys(val).length) {
            store.dispatch('user/getUserInfo').then(res => {
              const { profile = {}} = res
              store.dispatch('user/userInfo', profile)
            })
          }
        }
      })
    }, { immediate: true, deep: true })

    // 是否使用渐变背景
    const useGradualColor = computed(() => {
      return state.route.name == 'home' && storeState.useGradualColor.value
    })

    return {
      ...toRefs(state),
      useGradualColor,
      gradualColor,
      normalColor
    }
  }
})
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 0.32rem;
  .layout{
    width:100%;
    height: 100vh;
    min-height: 100vh;
    background: v-bind('useGradualColor ? gradualColor : normalColor');
    box-sizing: border-box;
    transition: all .3s;
    overflow: auto;
    .view{
      height: calc(100% - 1.2rem);
      overflow: auto;
      padding-bottom: 1.2rem;
      box-sizing: border-box;
    }
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
