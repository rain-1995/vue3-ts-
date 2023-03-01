<template>
  <div class="common-list">
    <component :is="componentsMap[curTab]">

    </component>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, computed } from 'vue'
import SongItem from '@/components/common-song-item.vue'
import PlaySheetItem from '@/components/common-playlist-item.vue'

interface propType {
    tab: string,
    data: object,
    curTab: string
}

const props = withDefaults(defineProps<propType>(), {
  tab: '',
  data: () => ({}),
  curTab: ''
})

const list = computed(() => {
  let field = ['songs']
})

const componentsMap = {
  1: SongItem,
  1000: PlaySheetItem
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
 
</style>

