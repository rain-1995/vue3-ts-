<template>
  <div class="reply-warp">
    <CommentItem class="comment" :data="comment" :show-reply="false" />
    <div class="all-list">
      <div class="title">
        全部回复
      </div>
      <List
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="loadMore"
      >
        <CommentItem
          v-for="(item, index) in reply"
          :key="index"
          :data="item"
          :be-reply-id="comment?.commentId"
          :show-be-reply="true"
        />
      </List>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, withDefaults, defineProps } from 'vue'
import CommentItem from './comment-item.vue'
import { List } from 'vant'
import api from '@/api'
import { useRoute } from 'vue-router'

interface propType {
  id: number,
  comment: anyObject
}

const props = withDefaults(defineProps<propType>(), {
  id: 0,
  comment: () => ({})
})

const route = useRoute()

const loading = ref(true)

const finished = ref(false)

const reply = ref([] as anyObject[])
const replyDetail = ref({} as anyObject)

const commentTypeMap = {
  video: 5,
  mv: 1
}

function loadMore() {
  replyList()
}

async function replyList() {
  const params = {
    id: route.params.id,
    parentCommentId: props.id,
    type: commentTypeMap[route.query.type as keyof typeof commentTypeMap],
    time: replyDetail.value?.time ? replyDetail.value?.time : '',
    limit: 30
  }
  const res: response = await api.reply({ ...params })
  const { comments: list = [] } = res.data
  reply.value = [...reply.value, ...list]
  await nextTick()
  replyDetail.value = res.data
  finished.value = !res.data.hasMore
  loading.value = false
}

onMounted(() => {
  reply.value = []
  replyDetail.value = {}
  replyList()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
:deep(.comment){
  border-bottom: 10px solid #f6f8f9;
  .flex-right{
    border: none;
  }
}
.all-list{
  width: 100%;
  .title{
    display: flex;
    align-items: center;
    padding: 0.3rem .4rem;
    padding-top: 0;
    font-size: 0.28rem;
    justify-content: space-between;
    box-sizing: border-box;
    font-weight: bold;
  }
}
.reply-warp{
  flex: 1;
  overflow: auto;
}
 
</style>

