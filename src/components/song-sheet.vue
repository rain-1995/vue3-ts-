<template>
  <div>
    <span class="pic">
      <img :src="item.uiElement.image.imageUrl" alt="">
      <span class="count">
        <svg-icon icon-class="bofang" class="bofang" />
        {{ formatCount(item.resourceExtInfo.playCount) }}
      </span>
    </span>
    <div class="name">
      {{ item.uiElement.mainTitle.title }}
    </div>
  </div>
</template>

<script setup>
import { defineComponent, toRefs, ref, reactive, toRef, computed, onMounted } from 'vue'
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
