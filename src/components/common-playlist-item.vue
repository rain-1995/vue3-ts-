<template>
  <li class="song-item" @click="playListDetail(item)">
      <img :src="item?.coverImgUrl" alt="" class="cover">
      <div class="song-info">
        <span class="song-title">{{ item?.name }}</span>
        <p class="sub-info">
          <span>{{ item?.trackCount }}首</span>
          <span v-if="showAuthor" class="author">，by{{ item?.creator?.nickname }}</span>
        </p>
      </div>
    </li>
</template>

<script setup>
import { defineComponent, toRefs,ref, reactive, toRef, computed, onMounted } from "vue"
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

 
</style>

