<template>
  <div>
    我的
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs,ref, reactive, toRef, computed, onMounted } from "vue"
export default defineComponent({
  name:'',
  setup(props, context){
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
      ...computes,
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

 
</style>
