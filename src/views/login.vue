/* eslint-disable vue/no-v-model-argument */
<template>
  <div class="login">
    <div class="icon">
      <img src="@/assets/icon/logo.png" alt="">
    </div>
    <div class="button" @click="login = true">
      手机号登录
    </div>
    <Popup
      v-model:show="login"
      position="bottom"
      style="width:101%;height:100%"
      :overlay="false"
      :closeable="true"
      close-icon-position="top-left"
      @close="reset"
    >
      <div class="login_box">
        <div class="tip">
          <p v-show="!next" class="txt">
            <span class="main">登录体验更多精彩</span>
            <span class="sub">未注册手机号登录后将自动创建账号</span>
          </p>
          <p v-show="next" class="txt">
            <span class="main">请输入验证码</span>
            <span class="sub">已发送至 +86 {{ form.phone }}<svg-icon icon-class="edit" class="edit" @click="next=false" /></span>
          </p>
          <p v-show="next" class="right">
            <span v-show="timeCount!=0">{{ timeCount }}s</span>
            <span v-show="timeCount == 0" @click="sendCode">重新发送</span>
          </p>
        </div>
        <div class="form">
          <span v-show="!next" class="phone">
            <Field
              v-model="form.phone"
              type="tel"
              placeholder="请输入手机号"
              clearable
              maxlength="11"
              style="padding:0;"
            />
          </span>
          <span v-show="next" class="code">
            <PasswordInput
              :value="form.captcha"
              :focused="showKeyboard"
              :gutter="10"
              :length="4"
              @focus="showKeyboard = true"
            />
            <NumberKeyboard
              v-model="form.captcha"
              :show="showKeyboard"
              @blur="showKeyboard = false"
            />
          </span>
        </div>
        <div v-show="!next" class="submit">
          <span class="btn next" :style="{opacity:regPhone?1:.4}" @click="sendCode">下一步</span>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, ref, reactive, onMounted, watch, nextTick } from 'vue'
import { Popup, Field, PasswordInput, NumberKeyboard, Toast } from 'vant'
import api from '@/api'
import { keysObject } from '@/utils/types'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
export default defineComponent({
  name: 'LOGIN',
  components: {
    Popup,
    Field,
    PasswordInput,
    NumberKeyboard
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const showKeyboard = ref(false)
    const login = ref(false)
    const next = ref(false)
    let timer = <any>''
    // 状态数据
    const state = reactive({
      // login: true,
      timeCount: 60,
      // next: false,
      regPhone: false,
      form: {
        phone: '',
        captcha: ''
      }
    })
    watch(() => state.form.phone, (n) => {
      const rule = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      state.regPhone = rule.test(n)
    })
    watch(() => state.form.captcha, (n) => {
      if (n.length == 4) {
        methods.userLogin()
      }
    })
    // 方法
    const methods = {
      reset() {
        next.value = false
        for (const key in state.form) {
          state.form[key as keyof typeof state.form] = ''
        }
      },
      timeDown() {
        clearInterval(timer)
        state.timeCount = 60
        timer = setInterval(() => {
          if (state.timeCount > 0) {
            state.timeCount--
          } else {
            state.timeCount = 0
            clearInterval(timer)
          }
        }, 1000)
      },
      // 发送验证码
      async sendCode() {
        if (!state.regPhone) {
          return Toast('请输入正确的手机号')
        }
        const res:keysObject = await api.sendCode({ phone: state.form.phone })
        if (res.code === 200) {
          next.value = true
          await nextTick()
          showKeyboard.value = true
          this.timeDown()
        }
      },
      async userLogin() {
        const passed = async() => {
          const res:keysObject = await api.login({ ...state.form })
          if (res.code == 200) {
            store.dispatch('user/userInfo',res)
            router.back()
          }
        }
        const { code }:keysObject = await api.verify({ ...state.form })
        if (code === 200) {
          passed()
        }
      }
    }

    onMounted(() => {})

    return {
      ...toRefs(state),
      ...methods,
      showKeyboard,
      login,
      next
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .login{
    width:100%;
    height:100vh;
    position: relative;
    background-color: #ec3124;
    .icon{
      width:1.5rem;
      height:1.5rem;
      border-radius: 50%;
      background-color: #ff2a1a;
      position: relative;
      margin: 40% auto 0;
      img{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        width:70%;
        height:70%;
      }
    }
    .button{
      width:4.8rem;
      padding: 0.3rem;
      border-radius: 0.8rem;
      background: #fff;
      color:red;
      text-align: center;
      margin: 1rem auto 0;
      font-weight: bold;
      font-size: 0.32rem;
    }
    .login_box{
      width:100%;
      margin-top: 1.4rem;
      padding: 0 0.4rem;
      box-sizing: border-box;
      // background: #f2f3f5;
      .tip{
        display: flex;
        // flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
        font-size: 0.36rem;
        font-weight: bold;
        .txt{
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .sub{
            font-size: 0.28rem;
            font-weight: normal;
            color:rgba(0,0,0,.4);
            margin-top: 0.2rem;
            display: flex;
            align-items: center;
            .edit{
              font-size: 0.2rem;
              margin-left: 0.16rem;
            }
          }
        }
        .right{
          font-size: 0.24rem;
          color:rgba(0,0,0,.4);
          & span:last-child{
            display: inline-block;
            color:rgba(10, 10, 168, 0.808);
            word-spacing: 1rem;
          }
        }
      }
      ::v-deep .form{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 0.6rem;
        .phone,.code{
          display: inline-block;
          width:100%;
          border-bottom: 1px solid rgba(0,0,0,.1);
          padding: 0.12rem 0;
          box-sizing: border-box;
          .van-field__control{
            font-size: 0.32rem;
          }
        }
      }
      .submit{
        margin-top: 1rem;
        .btn{
          display: inline-block;
          width:100%;
          padding: 0.28rem 0;
          background: #ec3124;
          color: #fff;
          text-align: center;
          border-radius: 0.8rem;
        }
        .next{
          opacity: .4;
        }
      }
    }
  }

</style>
