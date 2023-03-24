<template>
  <Popup
    v-model:show="show"
    position="bottom"
    :style="{height: popHeight}"
    :overlay-style="{'background-color': 'rgba(0,0,0,.2)'}"
    @close="emit('on-close', false)"
    @click-overlay="emit('on-close', false)"
  >
    <div class="container">
      <div class="header">
        <i class="iconfont icon-jiantou" @click="emit('on-close', false)" />
        <div v-if="commentType == 'comment'" class="comment-header">
          <span class="title">评论({{ commentDetail?.totalCount || 0 }})</span>
          <ul class="tabs">
            <li
              v-for="(item, index) in tabs" 
              :key="index"
              class="tab"
              :class="{active: item.key == sortType}"
              @click="tabChange(item.key)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div v-else class="reply-header">
          <i class="iconfont icon-xitongfanhui" />
          <span class="title">回复(123)</span>
        </div>
      </div>
      <div v-if="loading && page == 1" class="loading-status">
        <Loading 
          text="正在加载..."
          text-color="rgba(0,0,0,.7)"
          :line-width="1"
          :base-height="10"
        />
      </div>
      <div v-if="comments.length && commentType == 'comment'" class="list">
        <List
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
        >
          <CommentItem
            v-for="(item, index) in comments"
            :key="index"
            :data="item"
            @view-reply="() => (currentComment = item, commentType = 'reply')"
          />
        </List>
      </div>
      <template v-if="commentType == 'reply'">
        <Reply
          :id="currentComment.commentId"
          :comment="currentComment"
        />
      </template>
    </div>
  </Popup>
</template>

<script lang="ts" setup>
import { ref, defineEmits, watch, reactive, computed, withDefaults, defineProps } from 'vue'
import { Popup, List } from 'vant'
import api from '@/api'
import { useRoute } from 'vue-router'
import CommentItem from './comment-item.vue'
import Loading from '@/components/loading.vue'
import Reply from './reply.vue'

interface propType {
  popShow?: boolean,
  popHeight: string
}

const props = withDefaults(defineProps<propType>(), {
  popShow: true,
  popHeight: '40%'
})

const emit = defineEmits(['on-close'])

const route = useRoute()

const commentTypeMap = {
  video: 5,
  mv: 1
}

const page = ref(1)

const sortType = ref(1)

const commentDetail = ref<any>({})

const comments = ref([])

const currentComment = ref({} as anyObject)

const commentType = ref('comment')

const tabs = reactive([
  { name: '推荐', key: 1 },
  { name: '最热', key: 2 },
  { name: '最新', key: 3 }
])

const loading = ref(true)

const finished = ref(false)

const show = computed(() => props.popShow)

watch(() => props.popShow, (val) => {
  comments.value = []
  page.value = 1
  loading.value = true
  sortType.value = 1
  val && commentList()
}, { immediate: true })

function loadMore() {
  page.value++
  commentList()
}

async function commentList() {
  if (page.value != 1) {
    loading.value = true
  }
  const params = {
    id: route.params.id,
    type: commentTypeMap[route.query.type as keyof typeof commentTypeMap],
    sortType: sortType.value,
    pageNo: page.value,
    cursor: sortType.value == 3 ? commentDetail.value?.cursor : '',
    pageSize: 20
  }
  const res: response = await api.videoComment({ ...params })
  const { comments: list = [] } = res.data
  commentDetail.value = res.data
  comments.value = [...comments.value, ...list]
  finished.value = !res.data.hasMore
  loading.value = false
}

function tabChange(tab: number): void {
  loading.value = true
  sortType.value = tab
  comments.value = []
  page.value = 1
  commentList()
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.header{
  position: relative;
  padding: 0.6rem 0.4rem;
  font-size: 0.28rem;
  .icon-jiantou{
    font-size: 0.4rem;
    font-weight: bold;
    position: absolute;
    left:50%;
    top: 0;
    transform: translate(-50%,0) rotate(90deg);
    color: rgba(0,0,0,.3);

  }
  .comment-header,.reply-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .reply-header{
    justify-content: flex-start;
    font-size: .32rem;
    i{
      font-size: 0.32rem;
      margin-right: .3rem;
    }
  }
  .tabs{
    display: inline-flex;
    align-items: center;
    .tab{
      margin-left: 0.3rem;
      color: rgba(0,0,0,.6);
      font-size: 0.24rem;
    }
    .active{
      color: #000;
      font-weight: bold;
    }
  }
}
.container{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.list{
  flex: 1;
  overflow: auto;
}
.loading-status{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.4rem;

}
</style>

