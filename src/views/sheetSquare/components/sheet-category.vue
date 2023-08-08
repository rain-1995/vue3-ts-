<template>
  <div>
    <Popup
      v-model:show="flag"
      position="top"
      :style="{height: '100%'}"
    >
      <div class="content">
        <!-- 头部 -->
        <div class="header-title">
          <i class="iconfont icon-xitongfanhui" @click="emit('close')" />
          <span class="title">歌单标签</span>
        </div>
        <ul class="cate-list">
          <li v-for="(item, index) in categories" :key="index" class="cate-item">
            <p class="title">
              {{ item.title }}
            </p>
            <div class="sub-cates">
              <li 
                v-for="(sub, index) in item.subList"
                :key="index" 
                class="sub-cate-item" 
                :class="{'selected': isSelected(sub.name)}"
                @click="setTab(sub, isSelected(sub.name))"
              >
                <span class="title">
                  <i v-if="sub.hot" class="iconfont icon-remenhot" />
                  {{ sub.name }}
                </span>
              </li>
            </div>
          </li>
        </ul>
      </div>
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults, defineEmits } from 'vue'
import { Popup } from 'vant'

interface propsType {
  show: boolean,
  categories: anyObject[],
  tabs: string[]
}

const props = withDefaults(defineProps<propsType>(), {
  show: false,
  categories: () => [],
  tabs: () => []
})

const emit = defineEmits(['close', 'update-tab'])

const flag = computed(() => props.show)

function setTab(data: anyObject, selected: boolean) {
  if (!selected) {
    emit('update-tab', data.name)
    emit('close')
  }
}

function isSelected(name: string) {
  return props.tabs.includes(name)
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.header-title{
  display: flex;
  align-items: center;
  width: 100%;
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
.content{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  .cate-list{
    width: 100%;
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 0.3rem;
    box-sizing: border-box;
    font-size: 0.3rem;
    margin-top: 0.4rem;
    .cate-item{
      margin-bottom: 0.6rem;
      text-align: left;
      &>.title{
        margin-bottom: 0.3rem;
      }
      .sub-cates{
        display: flex;
        flex-wrap: wrap;
        .sub-cate-item{
          padding: 0.2rem 0;
          background-color: rgb(246, 248, 249);
          margin-right: 0.2rem;
          margin-bottom: 0.3rem;
          border-radius: 0.4rem;
          font-size: .26rem;
          width: 1.5rem;
          text-align: center;
          i{
            font-size: 0.24rem;
            color: red;
          }
          
        }
        .selected{
          background-color: rgba(246, 248, 249, .8);
          color: rgba(0,0,0,.5);
          pointer-events: none;
          i{
            color: rgba(255,0,0,.3);
          }
        }
      }
    }    

  }
}
 
</style>

