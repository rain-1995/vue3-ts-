<template>
  <div class="chat-page">

    <div class="header-title">
      <i class="iconfont icon-xitongfanhui" @click="router.back()" />
      <span class="title">消息</span>
    </div>
    <div class="chat-list">
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import api from '@/api'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()

const router = useRouter()

const uid = computed(() => route.params.id)


const query = reactive({
  limit: 100,
  before: 0
})
async function getChatInfo() {
  const {msgs = [], more = true} = await api.privateHistory({...query, uid: uid.value})
  let parseMsg = msgs.map((item: anyObject) => {
    return {
      ...item,
      msg: JSON.parse(item.msg)
    }
  })
  console.log(parseMsg)
}

onMounted(() => {
  getChatInfo()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.chat-page{
  background-color: #fff;
  display: flex;
  flex-direction: column;

}
.header-title{
  display: flex;
  align-items: center;
  padding: 0.3rem;
  box-sizing: border-box;
  i{
    font-size: 0.4rem;

  }
  .title{
    font-size: 0.32rem;
    font-weight: bold;
    margin-left: 0.3rem;
  }
}
</style>

