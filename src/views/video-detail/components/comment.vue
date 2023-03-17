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
        <i class="iconfont icon-jiantou" />
        <div class="comment-header">
          <span class="title">评论({{comments.totalCount}})</span>
          <ul class="tabs">
            <li
              v-for="(item, index) in tabs" 
              :key="index"
              class="tab"
              :class="{active: item.key == commentTab}"
              @click="tabChange(item.key)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      <!-- <div class="reply-header">
        <i class="iconfont icon-xitongfanhui"></i>
        <span class="title">回复(123)</span>
      </div> -->
      </div>
      <div class="list">
        <CommentItem
          v-for="(item, index) in comments.comments"
          :key="index"
          :data="item"
        />
      </div>
    </div>
  </Popup>
</template>

<script lang="ts" setup>
import { defineComponent, toRefs, ref, defineEmits, watch, reactive, toRef, computed, onMounted, withDefaults, defineProps } from 'vue'
import { Popup } from 'vant'
import api from '@/api'
import { useRoute } from 'vue-router'
import CommentItem from './comment-item.vue'

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

const commentTab = ref(1)

const comments = ref({})

const commentType = ref('comment')

const tabs = reactive([
  { name: '推荐', key: 1 },
  { name: '最热', key: 2 },
  { name: '最新', key: 3 }
])

const show = computed(() => props.popShow)

watch(() => props.popShow, (val) => {
  val && commentList()
}, { immediate: true })

async function commentList() {
  const params = {
    id: route.params.id,
    type: commentTypeMap[route.query.type as keyof typeof commentTypeMap],
    sortType: sortType.value,
    pageNo: page.value,
    cursor: ''
  }
  const res: response = await api.videoComment({ ...params })
  comments.value = res.data
}

function tabChange(tab: number): void {
  commentTab.value = tab
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
</style>

