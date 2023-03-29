<template>
  <div class="comment-item">
    <img :src="data?.user?.avatarUrl" alt="" class="avatar">
    <div class="flex-right">
      <div class="header-name">
        <p class="name-time">
          <span class="name">{{ data?.user?.nickname }}</span>
          <span class="time">{{ data?.timeStr }}</span>
        </p>
        <p class="star">
          {{ data?.likedCount }}<i class="iconfont icon-zan1" />
        </p>
      </div>
      <div class="content">
        {{ data?.content }}
      </div>
      <div v-if="reply?.showReplyCount && showReply" class="reply-view">
        <span v-if="replyComment?.user?.nickname" class="name">{{ replyComment?.user?.nickname }}：</span>
        <span v-if="replyComment?.content" class="reply-content">{{ replyComment?.content }}</span>
        <p class="reply-count" @click="emit('view-reply')">
          {{ reply?.replyCount }}条回复<span class="arrow"><i class="iconfont icon-xiangxiajiantou" /></span>
        </p>
      </div>
      <!-- 回复评论的被回复人 -->
      <div v-if="showBeReply" class="be-reply">
        <template v-for="(item, index) in beBeReplyUser" :key="index">
          <div v-if="item.beRepliedCommentId != beReplyId" class="reply-view be-reply-user-item">
            <p>
              <span class="name">{{ item?.user?.nickname }}：</span>
              <span class="reply-content">{{ item?.content }}</span>
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, withDefaults, defineProps, defineEmits } from 'vue'

interface propType {
  data: anyObject,
  showReply: boolean,
  beReplyId: number,
  showBeReply: boolean
}

const props = withDefaults(defineProps<propType>(), {
  data: () => ({}),
  showReply: true,
  beReplyId: 0,
  showBeReply: false
})

const emit = defineEmits(['view-reply'])

const reply = computed(() => {
  const { showFloorComment = {}} = props.data
  return showFloorComment
})

const beBeReplyUser = computed(() => {
  const { beReplied = [] } = props.data
  return beReplied
})

const replyComment = computed(() => {
  const { comments = [] } = reply.value
  return comments?.length && comments[0] || {}
})

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.comment-item{
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 0 0.4rem;
  box-sizing: border-box;
  margin-bottom: 0.3rem;
  .avatar{
    width: .7rem;
    height: .7rem;
    border-radius: 50%;
    margin-right: 0.2rem;
  }
  .flex-right{
    flex: 1;
    text-align: left;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid rgba(0,0,0,.1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .header-name{
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.28rem;
      margin-top: 0.12rem;
      .name-time{
        display: inline-flex;
        flex-direction: column;

      }
      .time{
        font-size: 0.24rem;
        color: rgba(0,0,0,.5);
        margin-top: 0.08rem;
      }
      .star{
        font-size: 0.24rem;
        color: rgba(0,0,0,.7);
        display: inline-flex;
        align-items: center;
        i{
          margin-left: 0.08rem;
        }
      }
      .icon-zan1{
      }
    }
    .content{
      margin-top: 0.4rem;
      font-size: 0.26rem;
      line-height: 0.5rem;
    }
  }
}
.comment-item:last-child{
  .flex-right{
    border: none;
  }
}
.reply-view{
  width: 5.2rem;
  padding: 0.3rem 0.4rem .3rem 0.2rem;
  background-color: #f6f8f9;
  border-radius: 0.08rem;
  box-sizing: border-box;
  font-size: 0.26rem;
  line-height: 0.4rem;
  .name{
    color: rgb(55, 67, 235);
  }
  .reply-count{
    font-size: 0.24rem;
    color: rgb(55, 67, 235);
    .arrow{
      display: inline-block;
      transform: rotate(-90deg);
    }
    i{
      font-size: .24rem;
    }
  }
}
.be-reply{
  margin-top: 0.08rem;
}
.be-reply-user-item{
  background-color: #fff;
  padding: 0;
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 0;
  position: relative;
  padding-left: 0.2rem;
  box-sizing: border-box;
  &::before{
    position: absolute;
    left: 0;
    top: 0;
    content: '';
    display: block;
    width: 2px;
    height: 100%;
    background-color: rgba(0,0,0,.1);
    margin-right: 0.16rem;
  }
}
 
</style>
