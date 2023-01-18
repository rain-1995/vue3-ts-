<template>
  <div class="search-container">
    <div class="header">
      <i class="iconfont icon-xitongfanhui" @click="backPage" />
      <span class="input-warp">
        <i class="iconfont icon-sousuo1" />
        <Field
          v-model="keyWord"
          v-focus
          class="input"
          clearable
          :placeholder="placeholder"
          type="text"
          @update:model-value="getSuggest"
        />
      </span>
      <span class="search" @click="search">搜索</span>
    </div>
    <template v-if="!keyWord">
      <div class="history">
        <p class="main-title">
          <span>搜索历史</span>
          <i class="iconfont icon-lajixiang" @click="setHistory('', 'delete')" />
        </p>
        <ul v-if="historyList.length" class="word-list">
          <li v-for="(item, index) in formatHistory(historyList)" :key="index" class="item">
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
              <ul class="list">
                <li v-for="(i, index) in item.data" :key="index" class="item">
                  <span class="num">{{ i.sort }}</span>
                  <p class="content">
                    <span class="text">{{ i.title }}</span>
                    <span v-if="i.hot == 1" class="hot-icon">热</span>
                  </p>
                </li>
              </ul>
            </div>
          </SwipeItem>
        </Swipe>
      </div>
    </template>
    <template v-else>
      <div class="association-list">
        <p v-for="(item, index) in associationList" :key="index" class="key-item">
          <i class="iconfont icon-sousuo" />
          <span class="text">{{ item.keyword }}</span>
        </p>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Field, Swipe, SwipeItem } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import api from '@/api'
import useState from '@/utils/useState'

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

const historyList = computed(() => {
  return storeState.history.value
})

const placeholder = computed(() => {
  return route.query.keyword as string || ''
})

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
  const res = await api.cloudsearch({keywords: keyWord.value, type: 1014})
  // setHistory(keyWord.value, 'update')
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
  const { hot = [] }: resultType = await api.hotTopic({ limit: 100, offset: 1 })
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

onMounted(() => {
  getHotSearch()
  getHotTopic()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search-container{
  background-color: #f6f8f9;
  position: relative;
  height: auto;
  min-height: 100vh;
}
.header{
  position: sticky;
  top:0;
  left:0;
  z-index: 10;
  background-color: #f6f8f9;
  display: flex;
  align-items: center;
  padding: 0.2rem 0.3rem 0.2rem;
  box-sizing: border-box;
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
  .search{
    color: #000;
    margin-left: 0.2rem;
    font-size: 0.3rem;
  }

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
      border-bottom: 1px solid rgba(0,0,0,.1);
      text-align: left;

    }

  }
}

</style>

