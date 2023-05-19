<template>
  <div class="my-message">
    <div class="header-title">
      <i class="iconfont icon-xitongfanhui" @click="router.back()" />
      <span class="title">消息</span>
    </div>

    <div class="container-area">
      <div class="quick-area">
        <li v-for="(item, index) in quickIcons" :key="index" class="icon-item">
          <span class="icon-warp" :style="{'backgroundColor': item.bgColor}">
            <i class="iconfont" :class="[item.icon]" />
          </span>
          <span class="title">{{ item.title }}</span>
        </li>
      </div>

      <div class="message-list">
        <li v-for="(item, index) in messageList" :key="index" class="message-item">
          <span class="cover-warp">
            <img :src="item.avatarUrl" alt="">
          </span>
          <div class="right-info">
            <p class="main-line">
              <span class="author">{{ item.nickname }}</span>
              <span class="time">{{ dayjs(item.time).format('YYYY年MM月DD日') }}</span>
            </p>
            <p class="sub-line">
              <span class="desc">{{ item.lastMsg }}</span>
              <span v-if="item.newMessageCount > 0" class="un-read-num">{{ item.newMessageCount }}</span>
            </p>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import dayjs from 'dayjs'

const router = useRouter()

const quickIcons = reactive([
  {
    icon: 'icon-pinglun2',
    bgColor: '#62ade3',
    title: '评论'
  },
  {
    icon: 'icon-aite1',
    bgColor: '#d47046',
    title: '@我'
  },
  {
    icon: 'icon-icon_notice',
    bgColor: '#e3c152',
    title: '通知'
  }
])

const messageList = ref<anyObject[]>([])

const query = reactive({
  limit: 1000,
  offset: 0
})

async function getMessages() {
  await api.privateHistory({uid: '1351734819'})
  const result: response = await api.privateMessage({ ...query })
  messageList.value = result?.msgs.map((item: anyObject) => {
    const desc = JSON.parse(item.lastMsg)?.msg || ''
    return {
      avatarUrl: item.fromUser.avatarUrl,
      lastMsg: desc,
      msgId: item.lastMsgId,
      nickname: item.fromUser.nickname,
      newMessageCount: item.newMsgCount,
      time: item.lastMsgTime
    }
  })
}

onMounted(() => {
  getMessages()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.my-message{
  background-color: #fff;
  display: flex;
  flex-direction: column;

}
.container-area{
  flex: 1;
  overflow: auto;
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

.quick-area{
  width: 100%;
  padding: 0 0.4rem;
  box-sizing: border-box;
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .icon-item{
    display: inline-flex;
    flex-direction: column;
    .icon-warp{
      
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      position: relative;
      i{
        font-size: 0.5rem;
        color: #fff;
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
      }
    }
    .title{
      font-size: 12px;
      color: rgba(0,0,0,.8);
      margin-top: 0.2rem;
    }
  }
}
.message-list{
  padding: 0 0.3rem;
  box-sizing: border-box;
  margin-top: 0.5rem;
  .message-item{
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 0.5rem;
    .cover-warp{
      img{
        width: .9rem;
        height: .9rem;
        border-radius: 50%;

      }
    }
    .right-info{
      flex: 1;
      min-width: 0;
      margin-left: 8px;
      font-size: 14px;
      .main-line,.sub-line{
        display: flex;
        align-items: center;
        min-width: 0;
        // width: 100%;

      }
      .main-line{
        justify-content: space-between;
      }
      .sub-line{
        margin-top: 4px;
      }
      .desc{
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        font-size: 12px;
        color: rgba(0,0,0,.7);
        text-align: left;
        
      }
      .un-read-num{
        // flex: 1;
        min-width: 0.36rem;
        min-height: 0.36rem;
        // padding: 0.06rem;
        border-radius: 50%;
        font-size: 0.2rem;
        color: #fff;
        background-color: red;
        line-height: .36rem;
      }
      .time{
        font-size: 12px;
        color: rgba(0,0,0,.5);
      }
    }
  }
}
</style>
