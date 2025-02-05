<script setup lang="ts">
const props = defineProps({
  commentList: { type: Array, default: () => [] },
})
const hashUrlToNum = (urlcode: string) => {
  // 定义url hash 到数据
  let hash = 0
  for (let i = 0; i < urlcode.length; i++) {
    const char = urlcode.charCodeAt(i)
    hash += char
  }
  return (hash % 6) + 1 // 如果为6返回0到5的数字
}
// 格式化评论数据
const newCommentList = props.commentList.map((item) => {
  return getStrapiData(item)
})
</script>

<template>
  <div class="comment-list">
    <div
      v-for="(item, i) in newCommentList"
      :key="i"
      class="comment-item"
      :class="{ 'has-child': item.reply && item.reply.length }"
    >
      <header>
        <b
          class="avatar"
          :class="'avatar-bg-' + hashUrlToNum(item.name  || '')"
          v-html="(item.name  || '').slice(0, 1)"
        ></b>
        <b class="name" v-html="item.name "></b>
      </header>
      <div class="comment-info" v-html="item.content "></div>
      <!-- 暂时不上线 -->
      <!-- <div class="reply"><span>Reply</span></div> -->
      <PagesArticleCommentList v-if="item.reply && item.reply.length" :comment-list="item.reply" />
    </div>
  </div>
</template>
<style lang="less">
.comment-list {
  padding: 0 20px;
  background: #fff;
}
.comment-item {
  padding-top: 20px;
  padding-bottom: 20px;
  & .comment-list {
    margin-top: 8px;
    padding-bottom: 0;
    padding-left: 20px;
    border-left: 1px solid #e4eaeb;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #e4eaeb;
  }
  header {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }
  &.has-child {
    .comment-item {
      border-bottom: none;
    }
    .comment-item + .comment-item:not(.has-child) {
      padding-top: 0;
    }
    > .comment-list > .comment-item.has-child {
      padding-bottom: 0;
      border-bottom: none;
    }
    > .comment-list > .comment-item:first-child {
      padding-top: 12px;
    }
  }
  .reply {
    margin-top: 20px;
    color: @text-gray-color;
    cursor: pointer;
  }

  .avatar {
    margin-right: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    font-size: @font-size-lg;
    color: #fff;
    border-radius: 50%;
  }
}
.avatar-bg-1 {
  background: #a7d54e;
}
.avatar-bg-2 {
  background: #edb891;
}
.avatar-bg-3 {
  background: #5cb3d0;
}
.avatar-bg-4 {
  background: #d691ed;
}
.avatar-bg-5 {
  background: #faa9ae;
}
.avatar-bg-6 {
  background: #f6cb6f;
}
</style>
