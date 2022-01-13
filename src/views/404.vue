<template>
  <div class="layout">
    <div class="icon">
      <img src="@/assets/icon/logo.png" alt="">
    </div>
    <span class="text">因为热爱</span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
export default defineComponent({
  name: '',
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
    background-color: #DB2C1F;
    .icon{
      width:1.5rem;
      height:1.5rem;
      border-radius: 50%;
      background-color: #ff1605;
      position: relative;
      margin: 60% auto 0;
      img{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        width:70%;
        height:70%;
      }
    }
    .text{
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
      color:#fff;
      font-weight: bold;
      font-size: 0.4rem;
    }
  }

</style>
