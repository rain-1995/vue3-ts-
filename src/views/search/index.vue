<template>
  <div class="search-container">
    <div class="header">
      <i class="iconfont icon-xitongfanhui" @click="backPage" />
      <span v-if="isSearchPage" class="input-warp">
        <i class="iconfont icon-sousuo1" />
        <Field
          v-model="keyWord"
          v-focus
          class="input"
          clearable
          :placeholder="placeholder"
          type="text"
          @update:model-value="getSuggest"
          @clear="handleClear"
        />
      </span>
      <span v-else class="input-warp view-input">
        <span class="left">
          <i class="iconfont icon-sousuo1" />
          <span class="content">{{ keyWord }}</span>
        </span>
        <Icon class="clear-icon" name="clear" @click="clearSearch" />
      </span>
      <span class="search" @click="search">搜索</span>
    </div>
    <div class="content-warp">
      <template v-if="!keyWord">
        <div class="history">
          <p class="main-title">
            <span>搜索历史</span>
            <i class="iconfont icon-lajixiang" @click="setHistory('', 'delete')" />
          </p>
          <ul v-if="historyList.length" class="word-list">
            <li v-for="(item, index) in formatHistory(historyList)" :key="index" class="item" @click="viewDetail({keyword: item})">
              {{ item }}
            </li>
            <li v-if="historyList.length > 2" class="item more" :class="{active: moreFlag}" @click="moreFlag = !moreFlag">
              <i class="iconfont icon-xiangxiajiantou" />
            </li>
          </ul>
          <div v-else class="no-data">
            搜索历史是空的~
          </div>
        </div>
        <!-- 榜单推荐 -->
        <div class="rank-warp">
          <Swipe
            ref="swiperRef"
            class="rank-swiper"
            :lazy-render="true"
            :show-indicators="false"
            width="280"
            :loop="false"
          >
            <SwipeItem
              v-for="(item, index) in ranks"
              :key="index"
              class="swiper-item"
            >
              <div class="rank-item">
                <p class="title">
                  {{ item.title }}
                </p>
                <ul v-if="item?.data?.length" class="list">
                  <li v-for="(i, index) in item.data" :key="index" class="item">
                    <span class="num">{{ i.sort }}</span>
                    <p class="content">
                      <span class="text">{{ i.title }}</span>
                      <span v-if="i.hot == 1" class="hot-icon">热</span>
                    </p>
                  </li>
                </ul>
                <div v-else class="no-data">
                  榜单是空的~
                </div>
              </div>
            </SwipeItem>
          </Swipe>
        </div>
      </template>
      <template v-else>
        <!-- 搜索联想 -->
        <div v-if="associationList.length && route.name == 'search'" class="association-list">
          <p v-for="(item, index) in associationList" :key="index" class="key-item" @click="viewDetail(item)">
            <i class="iconfont icon-sousuo" />
            <span class="text" v-html="formatWord(item.keyword)" />
          </p>
        </div>
        <!-- 搜索结果 -->
        <div v-if="route.name == 'searchResult'" class="search-result">
          <div class="tab-warp">
            <Tabs
              v-model:active="curTab"
              background="#f6f8f9"
              
              animated
              offset-top="1.24rem"
              @change="tabChange"
            >
              <Tab
                v-for="(item, index) in tabs"
                :key="index"
                :title="item.title"
                :name="item.key"
              >
                <tab-list 
                  :tab="item.title" 
                  :data="tabRes" 
                  :cur-tab="curTab" 
                  :loading="loading"
                  :more="more"
                  @load-more="loadMore"
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, nextTick, watch } from 'vue'
import { Field, Swipe, SwipeItem } from 'vant'
import { LocationQueryRaw, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Tab, Tabs, Icon } from 'vant'
import api from '@/api'
import useState from '@/utils/useState'
import TabList from './components/tab-detail-list.vue'
import qs from 'qs'

const route = useRoute()
const router = useRouter()
const store = useStore()

const storeState = useState('localData', ['history'])

const vFocus = {
  mounted(e:HTMLInputElement) {
    e && (e.querySelector('input') as HTMLInputElement).focus()
  }
}

interface rankType {
  title?: string,
  sort?: number,
  hot?: number | string,
  id?: number
}

const ranks = ref({
  hotSearch: {
    title: '热搜榜',
    type: 'keyword',
    data: [] as rankType[]
  },
  hotTopic: {
    title: '话题榜',
    type: 'topic',
    data: [] as rankType[]
  }
})

const keyWord = ref('') // 搜索关键字

const moreFlag = ref(false) // 显示更多搜索历史

interface associationType {
  keyword: string
}

const associationList = ref([] as associationType[]) // 搜索关键字联想结果

const curTab = ref<number | string>(1) // 选中的tab

const loading = ref(false)

const more = ref(true)

const tabRes = ref([] as any[]) // 搜索结果

const page = ref(1)

const limit = ref(30)

const tabs = reactive([
  { title: '单曲', key: 1 },
  { title: '歌单', key: 1000 },
  { title: '歌手', key: 100 },
  { title: '视频', key: 1014 },
  { title: 'MV', key: 1004 },
  { title: '用户', key: 1002 }
])

const historyList = computed(() => {
  return storeState.history.value
})

const placeholder = computed(() => {
  return route.query.keyword as string || ''
})

const isSearchPage = computed(() => {
  return route.name == 'search'
})

watch(() => route, async(val) => {
  const { name } = val
  keyWord.value = name == 'search' ? '' : route.query.keyword as string
  if (name == 'searchResult') {
    page.value = 1
    tabRes.value = []
    await nextTick()
    curTab.value = Number(route.query.tab) || curTab.value
    getTabsRes(curTab.value)
  }
  if (name == 'search') {
    getHotSearch()
    getHotTopic()
  }
}, { deep: true, immediate: true })

function clearSearch() {
  keyWord.value = ''
  if (route.name != 'search') {
    router.back()
  }
}

// 处理联想词高亮关键字
function formatWord(str: string) {
  const html = `<span style='color:rgba(0,0,0,.4)'>${keyWord.value}</span>`
  return str.replace(keyWord.value, html)
}

function handleClear() {
  if (route.name == 'searchResult') {
    router.back()
  }
}

// 跳转搜索结果页
function viewDetail({ keyword }:{keyword: string}) {
  setHistory(keyword, 'update')
  router.push(`/searchResult?keyword=${keyword}&type=result`)
}

async function tabChange(name: number | string) {
  tabRes.value = []
  page.value = 1
  let query = qs.parse(qs.stringify(route.query)) as LocationQueryRaw
  query = {
    ...query,
    tab: name as string
  }
  await nextTick()
  router.replace({ path: '/searchResult', query })
  await nextTick()
  getTabsRes(name)
}

// 获取联想词列表
async function getSuggest(val = '') {
  interface resType {
    result?: {
      allMatch?: []
    }
  }
  if (val) {
    const { result = {}}: resType = await api.suggest({ keywords: val, type: 'mobile' })
    associationList.value = result?.allMatch || []
  }
}

function backPage() {
  router.back()
}

function formatHistory(list: [] = []) {
  return moreFlag.value ? list : list.slice(0, 2)
}

async function search() {
  if (!keyWord.value.trim()) return
  router.push(`/searchResult?keyword=${keyWord.value}&type=result`)
  setHistory(keyWord.value, 'update')
}

// 获取tab下的数据
async function getTabsRes(key: number | string) {
  loading.value = true
  const params = {
    keywords: keyWord.value,
    type: key,
    limit: limit.value,
    offset: (page.value - 1) * 30
  }
  const res:any = await api.cloudsearch({ ...params })
  const { playlists = [], videos = [], artists = [], mvs = [], userprofiles = [], songs = [] } = res.result
  const list = [...playlists, ...videos, ...artists, ...mvs, ...userprofiles, ...songs]
  tabRes.value = tabRes.value.concat(list)
  await nextTick()
  loading.value = false
  more.value = list.length >= limit.value
}

// 加载下一页
function loadMore() {
  page.value++
  getTabsRes(curTab.value)
}

function setHistory(data: string, type = 'update') {
  store.commit('localData/UPDATE_HISTORY', { data: [data], type })
}

// 热搜榜
async function getHotSearch() {
  interface itemType {
    searchWord?: string,
    score?: number,
    iconType?: number
  }
  interface resultType {
    data?: itemType[]
  }
  const { data = [] }: resultType = await api.hotSearchListDetail()
  ranks.value['hotSearch'].data = data && data.map((item, index) => {
    return {
      title: item.searchWord,
      hot: item.iconType,
      sort: index + 1
    }
  })
}

// 话题榜
async function getHotTopic() {
  interface resultType {
    hot?: itemType[]
  }
  interface itemType {
    alg: string,
    actId: number,
    title: string,
    participateCount: number
  }
  const { hot = [] }: resultType = await api.hotTopic({ limit: 100, offset: 0 })
  let format = hot && hot.filter(item => item.alg == 'TopicQualityScore')
    .map((item, index) => {
      return {
        title: item.title,
        hot: item.participateCount > 2 * 10000 ? 1 : 0,
        id: item.actId,
        sort: index + 1
      }
    })
  format = format.length > 20 ? format.slice(0, 20) : format
  ranks.value['hotTopic'].data = format
}

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search-container{
  background-color: #f6f8f9;
  position: relative;
  height: auto;
  min-height: 100vh;
}
.header{
  position: fixed;
  top:0;
  left:0;
  z-index: 10;
  background-color: #f6f8f9;
  display: flex;
  align-items: center;
  padding: 0.2rem 0.3rem 0.2rem;
  box-sizing: border-box;
  width: 100%;
  i{
    font-size: 0.4rem;
    margin-right: 0.2rem;
    color: #000;
  }
  :deep(.input-warp){
    flex: 1;
    height: 0.6rem;
    background-color: #f0f2f3;
    display: flex;
    align-items: center;
    padding: 0.12rem 0.2rem;
    border-radius: 0.6rem;
    .input{
      width:100%;
      height: 100%;
      background-color: #f0f2f3;
      padding: 0;
      .van-field__body{
        height: 100%;
      }
    }
  }
  .view-input{
    overflow: hidden;
    justify-content: space-between;
    .left{
      display: inline-flex;
      align-items: center;
      overflow: hidden;
    }
    .content{
      text-align: left;
      min-width: 0;
      overflow: hidden;
      margin-right: 0.2rem;
      box-sizing: border-box;
      font-size: 0.28rem;
    }
    .clear-icon{
      color: rgba(0,0,0,.3);
      font-size: 0.28rem;
    }
  }
  .search{
    color: #000;
    margin-left: 0.2rem;
    font-size: 0.3rem;
  }

}
.content-warp{
  margin-top: 1.24rem;
}
.rank-warp{
  margin-bottom: .3rem;
}
.swiper-item{
  width: 3rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  .rank-item{
    background-color: #fff;
    padding: 0.3rem;
    box-sizing: border-box;
    border-radius: 0.16rem;
    text-align: left;
    .title{
      font-size: 0.32rem;
      font-weight: bold;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid rgba(0,0,0,.1);
    }
    .list{
      margin-top: 0.4rem;
      .item{
        display: flex;
        align-items: center;
        margin-bottom: 0.3rem;
        .num{
          margin-right: 0.2rem;
          font-size: 0.32rem;
          width: 0.36rem;
          text-align: left;
        }
        .text{
          font-size: 0.26rem;
        }
        .hot-icon{
          font-size: 0.24rem;
          padding: 0.04rem;
          background-color: red;
          color:#fff;
          margin-left: 0.08rem;
          border-radius: 0.08rem;
        }
        &:nth-child(1),&:nth-child(2),&:nth-child(3){
          .num{
            color: red;
            font-weight: bold;
          }
          .text{
              font-weight: bold;
            }
        }
      }
    }
  }

}
.history{
  padding: 0.4rem 0.3rem 0.5rem;
  .main-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.28rem;
    font-weight: bold;
    i{
      font-weight: normal;
    }
  }
  .word-list{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 0.3rem;
    .item{
      padding: 0.16rem 0.28rem;
      background-color: #fff;
      border-radius: 0.28rem;
      font-size: 0.28rem;
      margin: 0 0.2rem 0.3rem 0;
      color:#17293a;
    }
    .more{
      border-radius: 50%;
      padding: 0.16rem;
      i{
        font-size: 0.24rem;
      }
    }
    .active{
      transform: rotate(180deg);
    }
  }
  .no-data{
    font-size: 0.28rem;
    color: rgba(0,0,0,.3);
    margin-top: .3rem;
  }
}
.association-list{
  width: 100%;
  padding-left: 0.3rem;
  box-sizing: border-box;
  .key-item{
    display: flex;
    align-items: center;
    font-size: 0.28rem;
    i{
      font-size: 0.28rem;
      color: rgba(0,0,0,.7);
      margin-right: 0.2rem;
    }
    .text{
      flex: 1;
      padding: 0.3rem 0;
      border-bottom: .5px solid rgba(0,0,0,.1);
      text-align: left;
      color: #000;
    }

  }
}
:deep(.tab-warp){
  margin-top: 0.2rem;
  .van-tabs__wrap{
    height: auto;
  }
  .van-tabs__line{
    width: 0.7rem;
    height: 0.12rem;
    border-radius: 0.4rem;
    z-index: 0;
  }
  .van-tab{
    z-index: 10;
  }
  .van-tab--active{
    font-weight: bold;
  }
}
.no-data{
  font-size: 0.24rem;
  color: rgba(0,0,0,.5);
  text-align: center;
  margin-top: 0.4rem;
}

</style>

