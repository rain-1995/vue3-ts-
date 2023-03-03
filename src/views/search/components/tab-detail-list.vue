<template>
  <div class="common-list">
    <List
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      loading-text="正在加载"
      error-text="网络跑丢了，请重试~"
      @load="onLoad"
    >
      <component 
        :is="componentsMap[curTab]" 
        v-for="(item, index) in data"
        :key="index"
        :data="item"
        :show-author="true" 
        :show-play-count="true"
      />
    </List>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, defineEmits, computed } from 'vue'
import SongItem from '@/components/common-song-item.vue'
import PlaySheetItem from '@/components/common-playlist-item.vue'
import VideoItem from '@/components/common-video-item.vue'
import { List } from 'vant'

interface propType {
    tab: string,
    data: [],
    curTab: number | string,
    loading: boolean,
    finished: boolean
}
const props = withDefaults(defineProps<propType>(), {
  tab: '',
  data: () => ([]),
  curTab: 1,
  loading: false,
  finished: false
})

const emit = defineEmits(['load-more'])

const loading = computed(() => props.loading)

function onLoad() {
  emit('load-more')
}
const componentsMap: any = {
  '1': SongItem, // 歌
  '1000': PlaySheetItem, // 歌单
  '1014': VideoItem, // 视频
  '1004': VideoItem // mv
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
<style lang="scss">
.common-list{
  .van-loading{
    color: red !important;
  }
}
</style>

