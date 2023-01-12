<template>
  <!-- <div class="tabBar"> -->
  <Tabbar
    v-model="active"
    class="tabbar"
    active-color="#ee0a24"
    inactive-color="#000"
    route
    :placeholder="false"
    :before-change="change"
  >
    <TabbarItem v-for="(item, index) in tabBar" :key="index" replace :to="item.route" :name="item.name">
      {{ item.name }}
      <template #icon="props">
        <div :class="[props.active?'tab_active':'tab_inactive']">
          <SvgIcon :icon-class="item.icon" />
        </div>
      </template>
    </TabbarItem>
  </Tabbar>
  <!-- </div> -->
</template>

<script lang='ts'>
import { defineComponent, toRefs, reactive } from 'vue'
import { Tabbar, TabbarItem } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'TabBar',
  components: { Tabbar, TabbarItem },
  setup() {
    const store = useStore()

    const router = useRouter()

    // 状态数据
    const state = reactive({
      // 当前选中
      active: '发现',
      // 标签数据
      tabBar: [
        {
          name: '发现',
          icon: 'find',
          route: '/home'
        },
        {
          name: '播客',
          icon: 'xinhao',
          route: '/podcast'
        },
        {
          name: '我的',
          icon: 'my',
          route: '/my'
        },
        {
          name: '关注',
          icon: 'lianxiren',
          route: '/follow'
        },
        {
          name: '云村',
          icon: 'yun',
          route: '/cloud'
        }
      ]
    })

    function change(val: number | string) {
      if (val == '我的') {
        const isLogin = store.state.user?.userInfo && Object.keys(store.state?.user?.userInfo).length || false
        if (isLogin) {
          return true
        }
        router.push('/login')
        return false
      }
      return true
    }

    return {
      ...toRefs(state),
      change
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tabbar{
  height: 1.2rem;
  // border-top: .5px solid rgba(0,0,0,.1);
}
  .tab_active{
    font-size: 0.3rem;
    color: #fff;
    background-color: red;
    background: radial-gradient(circle,rgb(243, 234, 234) 0%, rgb(250, 73, 73) 40%, red 100%);
    border-radius: 50%;
    padding: 0.1rem;
  }
  .tab_inactive{
    font-size: 0.36rem;
    color: rgba(0,0,0,.5);
  }
</style>
