<template>
  <div>
    <Popup
      v-model:show="showFlag"
      position="left"
      teleport=""
      style="width:80%;height:100%"
      @close="emit('update:show', false)"
    >
      <div class="menu">
        <div class="user" @click="userCenter">
          <svg-icon v-if="!userInfo?.avatarUrl" icon-class="touxiang" class="avatar_icon" />
          <img v-else :src="userInfo?.avatarUrl" alt="" class="avatar">
          <span class="username">
            {{ Object.keys(userInfo).length && userInfo.nickname ? userInfo.nickname : '立即登录' }}
            <svg-icon icon-class="rightjiantou" class="icon" />
          </span>
        </div>
        <div class="vip">
          <div class="top">
            <p>
              <span class="main">开通黑胶VIP</span>
              <span class="sub">立享超21项专属特权 ></span>
            </p>
            <span class="btn">会员中心</span>
          </div>
          <div class="bottom">
            <span>受邀专享，黑胶VIP首月仅1元</span>
          </div>
        </div>
        <div class="set">
          <div v-for="(item, index) in sets" :key="index" class="set_item" @click="pageJump(item)">
            <p>
              <svg-icon :icon-class="item.icon" class="icon" />
              <span>{{ item.title }}</span>
            </p>
            <p class="right">
              <span v-cloak v-if="item.key == 'message' && newMessageCount > 0" class="count">{{ newMessageCount > 99 ? '99+' : newMessageCount }}</span>
              <svg-icon icon-class="rightjiantou" class="icon" />
            </p>
          </div>
        </div>
        <div class="set logout" @click="logout">
          退出登录
        </div>
      </div>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, withDefaults, defineProps, defineEmits, nextTick, watch, ref } from 'vue'
import { Popup } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useState from '@/utils/useState'
import api from '@/api'

interface propType {
    show: boolean
}

const props = withDefaults(defineProps<propType>(), {
  show: false
})

const emit = defineEmits(['update:show'])

const store = useStore()
const router = useRouter()

const user = useState('user', ['userInfo'])

const sets = reactive([
  { 
    title: '消息中心',
    key: 'message',
    icon: 'duanxin',
    path: '/messageIndex'
  }
  // { 
  //   title: '云贝中心',
  //   icon: 'yunbei' 
  // }
])

const newMessageCount = ref(0) // 新消息数

const userInfo = computed(() => user.userInfo.value)

const showFlag = computed(() => props.show)

const isLogin = computed(() => {
  return user.userInfo.value && Object.keys(user.userInfo.value).length
})

watch(() => props.show, (val) => {
  if (val && isLogin.value) {
    getMessages()
  }
})

function pageJump(data: anyObject) {
  if (isLogin.value) {
    data.path && router.push(data.path)
  } else {
    router.push('/login')
  }
}

// 退出登录
function logout() {
  store.dispatch('user/logout').then(res => {
    router.replace('/login')
  })
}

// 跳转个人主页
async function userCenter() {
  if (user.userInfo.value && Object.keys(user.userInfo.value).length) {
    router.push('/my')
  } else {
    router.push('/login')
  }
  await nextTick()
  emit('update:show', false)
}

async function getMessages() {
  const result: response = await api.privateMessage()
  newMessageCount.value = result?.newMsgCount || 0
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.menu{
  width:100%;
  padding:0.4rem 0.36rem 0;
  box-sizing: border-box;
  position: relative;
  height: 100%;
  .user{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .avatar{
      width:0.6rem;
      height: .6rem;
      border-radius: 50%;
      margin-right: 0.1rem;
    }
    .avatar_icon{
      font-size: 0.4rem;
      margin-right: 0.1rem;
    }
    .username{
      display: flex;
      align-items: center;
      font-size: 0.28rem;
      font-weight: bold;
      .icon{
        font-size: 0.2rem;
      }
    }
  }
  .vip{
    width:100%;
    border-radius: 0.2rem;
    background: #161619 linear-gradient(180deg, #462D29 0%, #1E1A1B 100%);
    color:rgba(245, 240, 216, 0.698);
    padding:0.3rem 0.3rem;
    box-sizing: border-box;
    font-size: 0.28rem;
    margin: 0.4rem 0;
    .top{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      & p:first-child{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .sub{
          font-size: 0.24rem;
          margin-top: 0.16rem;
          opacity: .5;
        }
      }
      .btn{
        border: 1px solid rgba(180, 175, 146, 0.698);
        border-radius: 0.6rem;
        padding: 0.08rem 0.12rem;
        box-sizing: border-box;
        font-size: 0.2rem;
      }
    }
    .bottom{
      margin-top: 0.6rem;
      font-size: 0.24rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      opacity: .5;
    }
  }
  .set{
    width: 100%;
    box-shadow: 0 0.04rem 0.24rem 0 rgba(0, 0, 0, 0.1);
    border-radius: 0.2rem;
    font-size: 0.28rem;
    margin-bottom: 1rem;
    .set_item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.2rem .3rem;
      border-bottom: 1px solid rgba(0,0,0,.1);
      &:last-child{
        border: none;
      }
      & p:first-child{
        display: inline-flex;
        align-items: center;
        .icon{
          margin-right: 0.12rem;
        }
      }
      .right{
        display: inline-flex;
        align-items: center;
        .count{
          font-size: 12px;
          padding: 4px;
          border-radius: 50%;
          background-color: red;
          color: #fff;
          margin-right: 4px;
        }
      }
    }
  }
  .logout{
    padding: 0.4rem;
    box-sizing: border-box;
    text-align: center;
    font-weight: bold;
    position: absolute;
    bottom: 0.4rem;
    margin: 0;
    left: 0.36rem;
    width: calc(100% - 36px);

  }
}
</style>
