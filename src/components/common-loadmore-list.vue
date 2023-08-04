<template>
  <div ref="listRef" class="list-container" :style="listStyle">
    <div class="list">
      <slot />
    </div>
    <div class="load-more">
      <LoadingAnimate v-show="loading" :base-height="8" text="加载中..." />
      <span v-show="!loading && !more" class="no-more">{{ finishedText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, ref, onMounted, defineEmits, onBeforeUnmount } from 'vue'
import LoadingAnimate from './loading.vue'

interface propType {
  more: boolean,
  listStyle: object,
  loading: boolean,
  offset: number,
  finishedText: string
}

const props = withDefaults(defineProps<propType>(), {
  more: true,
  listStyle: () => ({}),
  loading: false,
  offset: 5,
  finishedText: '没有了，别划了~'
})

const emit = defineEmits(['load-more'])

const listRef = ref()

function handleScroll(e: any) {
  const { scrollHeight, scrollTop, clientHeight } = e.target
  const { more, loading, offset } = props
  if (scrollTop + clientHeight + offset >= scrollHeight) {
    if (more && !loading) {
      emit('load-more')
    }
  }
}

onMounted(() => {
  listRef.value.addEventListener('scroll', handleScroll, true)
})

onBeforeUnmount(() => {
  listRef.value.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list-container{
  box-sizing: border-box;
  overflow: auto;
}
.list{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 0.3rem;
  box-sizing: border-box;
  // &::after{
  //   content: '';
  //   flex: auto;
  //   max-width: 30%;
  // }

}
.load-more{
  text-align: center;
  display: inline-flex;
  justify-content: space-between;
  margin: 0.4rem 0;
  .no-more{
    font-size: 0.24rem;
    color: rgba(0,0,0,.5);
  }
}
 
</style>

