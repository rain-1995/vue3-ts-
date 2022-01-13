import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.scss'
import '@/utils/media_750'
import '@/components/svg'
import SvgIcon from '@/components/svg/svgIcon.vue'// svg组件
import { PullRefresh } from 'vant'
import scroll from '@/components/scroll.vue'

router.beforeEach((to, from, next) => {
  document.title = <string>to?.meta?.title || 'vue版网易云音乐'
  next()
})
const app = createApp(App)
app.component('SvgIcon', SvgIcon)
app.component('scroll', scroll)
  .use(store)
  .use(router)
  .use(PullRefresh)
  .mount('#app')
