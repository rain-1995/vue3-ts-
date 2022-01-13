<template>
  <div class="layout">
    
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import Header from '@/components/header.vue'
import TabBar from '@/components/tabBar.vue'
export default defineComponent({
  name: 'Layout',
  components: { Header,TabBar },
  setup(props, context) {
    // 状态数据
    const state = reactive({})

    // 方法
    const methods = {}

    // 计算属性
    const computes = {}

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...methods,
      ...computes
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .layout{
    width:100%;
    height:100vh;
    position: relative;
  }

</style>
