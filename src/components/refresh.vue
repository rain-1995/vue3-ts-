<template>
  <div v-if="load" ref="load" class="refresh" :class="[loading?'active':'in_active']">
    <svg-icon icon-class="shuaxin" class="icon" />
  </div>
</template>

<script lang='ts'>
import { Loading } from 'vant'
import { defineComponent, toRefs, ref, reactive, computed, onMounted, watch } from 'vue'

export default defineComponent({
  name: 'REFRESH',
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    // 状态数据
    const state = reactive({})

    const load = ref<boolean>(false)

    watch(() => Loading.value, () => {
      load.value = true
      setTimeout(() => {
        load.value = false
      }, 2000)
    }, { immediate: true })

    // 计算属性
    const computes = {
      loading: computed(() => props.loading)
    }

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...computes,
      load
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .refresh{
    position: fixed;
    left: 50%;
    top: 1.2rem;
    transform: translate(-50%,0);
    border-radius: 50%;
    background-color: rgba(255,255,255,1);
    box-shadow: 0 0 0.16rem rgba(0,0,0,.2);
    z-index: 100;
    padding: 0.2rem;
    transition: all .5s;
    .icon{
      color: red;
      font-weight: bold;
      animation:icon .7s linear infinite;
    }
    @keyframes icon{
      from{
        -webkit-transform:rotate(0deg);
      }
      to{
        -webkit-transform:rotate(360deg);
      }
    }
  }
  .active{
    animation:load .4s linear 1;
    animation-fill-mode:forwards;
  }
  .in_active{
    display: none;
    // animation:loaded .4s linear 1;
    // animation-fill-mode:forwards;

  }
  @keyframes load{
      from{
        -webkit-transform:translate(-50%,0);
      }
      to{
        -webkit-transform:translate(-50%,0.4rem);
      }
    }
  @keyframes loaded{
      from{
        -webkit-transform:translate(-50%,1.6rem);
      }
      to{
        -webkit-transform:translate(-50%,0);
      }
    }

</style>

