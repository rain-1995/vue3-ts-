<template>
  <div v-if="pageLoaded" class="square">
    <!-- 头部 -->
    <div class="header-title">
      <i class="iconfont icon-xitongfanhui" @click="router.back()" />
      <span class="title">歌单广场</span>
    </div>
    <div class="sheet-tab-warp">
      <Tabs
        ref="tabRef"
        v-model:active="currentTab"
        swipeable
        duration="0.1"
        :before-change="beforeChange"
        @change="tabChange"
      >
        <Tab
          v-for="(item, index) in hotTabList"
          :key="index"
          :title="item"
          :name="item"
        >
          <List
            :more="hasMore"
            :loading="loading"
            :list-style="{
              height: 'calc(100vh - 94px)',
              'padding-top': '20px',
            }"
            @load-more="loadMore"
          >
            <SheetItem 
              v-for="(sheet, i) in sheets" 
              :key="i" 
              :sheet="sheet" 
              @on-click="toSheetDetail"
            />
          </List>
        </Tab>
      </Tabs>
      <!-- 查看所有歌单分类 -->
      <div class="more-icon">
        <i class="iconfont icon-gengduo1" @click="handleMore" />
      </div>
    </div>
    <!-- 歌单分类弹窗 -->
    <SheetCategory
      v-model:show="showMoreCategory" 
      :categories="allSheetCategoryList" 
      :tabs="hotTabList"
      @close="closeCatePage"
      @update-tab="setTabData"
    />
  </div>
  <div v-else class="page-load">
    <Loading :base-height="8" text="加载中..." />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Tab, Tabs } from 'vant'
import apt from '@/api'
import SheetCategory from './components/sheet-category.vue'
import api from '@/api'
import List from '@/components/common-loadmore-list.vue'
import SheetItem from '@/components/song-sheet-block.vue'
import Loading from '@/components/loading.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentTab = ref()

const hotTabList = ref([] as string[])

const showMoreCategory = ref(false) // 显示更多歌单分类

const allSheetCategoryList = ref<anyObject[]>([])

const sheets = ref<anyObject[]>([])

const hasMore = ref(true)

const loading = ref(false)

const pageLoaded = ref(false)

const tabRef = ref()

const sheetParams = reactive({
  limit: 20,
  offset: 0,
  cat: ''
})

const page = ref(1)

async function setTabData(name: string) {
  if (!hotTabList.value.includes(name)) {
    hotTabList.value = [name, ...hotTabList.value]
    await nextTick()
    setTimeout(() => {
      currentTab.value = name
      sheetParams.cat = name
      sheetParams.offset = 0
      sheets.value = []
      getCateSheets()
    }, 100)
  }
}

function toSheetDetail(id: number) {
  router.push(`/songSheet/${id}`)
}

// 获取歌单tab分类
async function getHotTabList() {
  const result:response = await apt.hotSheetCateList()
  const { tags = [] } = result
  hotTabList.value = tags.map((item: anyObject) => {
    return item.name
  })
  sheetParams.cat = tags?.[0]?.name
  getCateSheets()
}

function handleMore() {
  showMoreCategory.value = true
}

async function getAllSheetCategory() {
  const result:response = await apt.sheetCateList()
  const { categories = {}, sub = [] } = result
  const formatArr = []
  for (const key in categories) {
    const value = categories[key]
    const subList = sub.filter((i:any) => i.category == key)
    formatArr.push({
      title: value,
      subList
    })
  }
  allSheetCategoryList.value = formatArr
}

function closeCatePage() {
  showMoreCategory.value = false
}

// 获取分类下的歌单
async function getCateSheets() {
  loading.value = true
  const result:response = await api.categorySheetDetail({ ...sheetParams })
  const { more = false, playlists = [] } = result
  sheets.value = [...sheets.value, ...playlists]
  hasMore.value = more
  loading.value = false
}

function tabChange(name: string) {
  sheetParams.cat = name
  sheetParams.offset = 0
  sheets.value = []
  getCateSheets()
}

function beforeChange(name: string) {
  return name != currentTab.value
}

function loadMore() {
  page.value++
  sheetParams.offset = page.value * sheetParams.limit
  getCateSheets()
}

onMounted(async() => {
  getHotTabList()
  getAllSheetCategory()
  await nextTick()
  setTimeout(() => {
    pageLoaded.value = true
  }, 500)
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.square{
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
.sheet-tab-warp{
  position: relative;
  // display: flex;
  // align-items: flex-start;
  flex: 1;
  overflow: auto;
  .more-icon{
    position: absolute;
    width: 1rem;
    height: 0.88rem;
    right: 0;
    top: 0;
    z-index: 100;
    background-color: #fff;
    flex: 1;
    
    &::before{
      content: '';
      width: 1rem;
      height: 100%;
      background: linear-gradient(to left, #fff,rgba(255,255,255,0), );
      display: inline-block;
      position: absolute;
      left: -0.96rem;
      top: 0;
    }
    i{
      position: absolute;
      top: 50%;
      right: 0.4rem;
      transform: translate(0,-50%);
      font-size: 0.36rem;
    }
  }
}
.page-load{
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top: 4rem;

}
</style>
<style lang="scss">
.sheet-tab-warp{
  .van-tab--active{
    font-weight: bold;
  }
  .van-tab--grow{
    padding: 0 0.36rem;
  }
  .van-tabs__nav{
    padding-right: 1.2rem;
  }
  .van-tabs__line{
    bottom: 0.44rem;
    width: 0.4rem;
  }
}
</style>
