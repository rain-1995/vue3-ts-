<template>
  <div class="layout">
    <template v-if="!route.meta?.fullScreen||false">
      <Header />
      <router-view class="view" />
      <TabBar />
    </template>
    <template v-else>
      <router-view class="view" style="height:100%;padding-bottom:0;" />
    </template>
    <AudioPlayer style="display:none;" />
  </div>
</template>

<script lang='ts'>
import { useRoute } from 'vue-router'
import { defineComponent, toRefs, reactive, watch } from 'vue'
import Header from '@/components/header.vue'
import TabBar from '@/components/tabBar.vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'LAYOUT',
  components: { Header, TabBar },
  setup() {
    const store = useStore()

    // 状态数据
    const state = reactive({
      route: useRoute()
    })

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

    // 方法
    const methods = {}

    // 计算属性
    const computes = {}

    return {
      ...toRefs(state),
      ...methods,
      ...computes
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
    // background-color: rgb(245, 244, 244);
    // background:linear-gradient(to bottom,rgb(245, 244, 244) 0.7rem,#fff 100%);
    // background-image: linear-gradient(to bottom, rgba(195,176,214,.8) 10%,#fff 30%);
    background-image: linear-gradient(to bottom, rgba(188,194,215,.8) 10%,#fff 30%);
    box-sizing: border-box;
    overflow: hidden;
    transition: all .3s;
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
