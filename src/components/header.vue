<template>
  <div class="header">
    <div class="more" @click="showMenu = true">
      <svg-icon icon-class="cebianlan" />
    </div>
    <div class="content">
      <div class="search">
        <svg-icon icon-class="search" class="icon" />
        <span class="text">{{ showKeyword }}</span>
      </div>
      <div class="right_btn">
        <svg-icon icon-class="huatong" />
      </div>
    </div>
    <Popup
      v-model:show="showMenu"
      position="left"
      teleport="#app"
      style="width:50%;height:100%"
    >
      <div class="menu" />
    </Popup>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import api from '@/api'
import { Popup } from 'vant'
export default defineComponent({
  name: 'HEADER',
  components: { Popup },
  setup(props, context) {
    // 状态数据
    const state = reactive({
      showKeyword: '',
      showMenu: false
    })

    // 方法
    const methods = {
      // 获取默认搜索词
      async searchDefaultWord() {
        const { data }:any = await api.searchDefault()
        state.showKeyword = data.showKeyword
      }
    }

    // 计算属性
    const computes = {}

    onMounted(() => {
      methods.searchDefaultWord()
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
  .header{
    width:100%;
    height: 1.2rem;
    display: flex;
    align-items: center;
    padding: 0.3rem 0.2rem;
    box-sizing: border-box;
    position: relative;
    z-index: 999;
    background: #f5f4f4;
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
      }
      .search{
        width:5.2rem;
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

