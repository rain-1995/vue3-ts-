/** 
    用户列表item通用组件
*/
<template>
  <div class="user-item">
    <div class="left-cover">
      <img :src="user.picUrl || user.avatarUrl" alt="">
      <span class="name">{{ user.name || user.nickname }}</span>
    </div>
    <div v-show="!user.followed" class="like" @click="follow(1)">
      + 关注
    </div>
    <div v-show="user.followed" class="like liked" @click="follow(2)">
      <i class="iconfont icon-duihao" />已关注
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from '@/api'
import { computed, withDefaults, defineProps } from 'vue'
import { Toast } from 'vant'

interface propType {
    data: userItemType,
}

type userItemType = { // 用户类型接口定义
  picUrl?: string,
  name?: string,
  followed?: boolean,
  avatarUrl?: string,
  nickname?: string,
  userId?: number,
  id?: number
}
const props = withDefaults(defineProps<propType>(), {
  data: () => ({})
})
const user = computed(() => props.data || {})

// 关注取消关注
async function follow(type = 1) {
  try {
    const result = await api.follow({ id: props.data?.id || props.data?.userId, t: type })
  user.value.followed = type == 1
  Toast({
    message: `已${type == 1 ? '关注' : '取消关注'}`,
    position: 'top'
  })
  } catch (error) {
    
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.user-item{
  width: 100%;
  padding: 0 0.3rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  .left-cover{
    display: inline-flex;
    align-items: center;
    img{
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      margin-right: 0.3rem;
    }
    .name{
      font-size: 0.28rem;
      
    }
  }
  .like{
    font-size: 0.24rem;
    padding: 0.06rem .12rem;
    border: 1px solid red;
    border-radius: 0.28rem;
    color: red;
  }
  .liked{
    display: inline-flex;
    align-items: center;
    color: rgba(0,0,0,.4);
    border: 1px solid rgba(0,0,0,.3);
    i{
      color: rgba(0,0,0,.6);
    }
  }
}
 
</style>
