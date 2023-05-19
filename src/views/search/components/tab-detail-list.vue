<template>
  <List
    :loading="loadStatus"
    :more="more"
    :list-style="{
      height: 'calc(100vh - 97px)',
    }"
    @load-more="onLoad"
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
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, defineEmits, computed } from 'vue'
import SongItem from '@/components/common-song-item.vue'
import PlaySheetItem from '@/components/common-playlist-item.vue'
import VideoItem from '@/components/common-video-item.vue'
import UserItem from '@/components/common-user-item.vue'
// import { List } from 'vant'
import List from '@/components/common-loadmore-list.vue'

interface propType {
    tab: string,
    data: anyObject[],
    curTab: number | string,
    loading: boolean,
    more: boolean
}
const props = withDefaults(defineProps<propType>(), {
  tab: '',
  data: () => ([]),
  curTab: 1,
  loading: false,
  more: true
})

const emit = defineEmits(['load-more'])

const loadStatus = computed(() => props.loading)

function onLoad() {
  emit('load-more')
}
const componentsMap: any = {
  '1': SongItem, // 歌
  '1000': PlaySheetItem, // 歌单
  '1014': VideoItem, // 视频
  '1004': VideoItem, // mv
  '100': UserItem, // 歌手
  '1002': UserItem // 用户
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
<style lang="scss">
</style>

