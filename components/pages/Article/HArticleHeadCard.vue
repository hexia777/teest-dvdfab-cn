<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  // 文章分类
  subType: {
    type: String,
    default: '',
  },
  // 文章分类路由
  subUrl: {
    type: String,
    default: '',
  },
  summary: {
    type: String,
    default: '',
  },
  authorInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  breadcrumbData: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
    default: '',
  },
})
const locale = useStore.common().locale

const dateForm = (date = '') => {
  const inputDate = new Date(date)
  if (inputDate.toString() === 'Invalid Date') {
    return ''
  }
  const day = inputDate.getDate() || ''
  const month = inputDate.getMonth() + 1 || ''
  const year = inputDate.getFullYear() || ''
  return `${month < 10 ? '0' + month : month}/${day}/${year}`
}
</script>

<template>
  <div class="article-content-2">
    <BaseBreadcrumb v-bind="breadcrumbData" />
    <h1 class="mt40 mb-28 font-s-24 line-height-32" v-html="title"></h1>
    <div class="author-box flex-between pb-20">
      <div class="left">
        <my-img class="b-radius-lg mr-16" :src="authorInfo.headIcon" width="40" height="40" />
        <a
          :href="'/author/' + authorInfo.name?.toLowerCase() + '.htm'"
          class="mr-16 name"
          v-html="authorInfo.name"
        ></a>
        <span class="mr-16 gray-color">{{ dateForm(authorInfo.date) }}</span>
        <a v-if="subType" :href="subUrl" class="type" v-html="subType"></a>
      </div>
      <div v-if="+authorInfo.views" class="right flex-between gray-color">
        <i class="iconfont-sg icon-eye mr-10"></i>
        <span v-html="authorInfo.views"></span>
      </div>
    </div>
    <p v-if="summary" class="mt-20 mb-20 article-txt" v-html="summary"></p>
  </div>
</template>

<style lang="less" scoped>
.author-box {
  border-bottom: 1px solid #e4eaeb;
  .name {
    color: @base-text-color;
    &:hover {
      color: @primary-color;
    }
  }
  .type {
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #ff9000;
    color: #ff9000;
    &:hover {
      background: rgba(255, 144, 0, 0.1);
    }
  }
  .right {
    i {
      color: #9aa6be;
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
