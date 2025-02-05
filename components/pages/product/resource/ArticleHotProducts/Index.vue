<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array<any>,
    default: () => [],
  },
  more: {
    type: String,
    default: '',
  },
  moreUrl: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="hot-products">
    <PagesProductResourceArticleWithBgTitle v-if="title" :title="title" />
    <ul v-if="items?.length" class="hot-box pt0 pb16 pl20 pr20">
      <li v-for="(item, index) in items" :key="index" class="hot-li pt16">
        <a class="name my-a" :href="item?.url ? item?.url + '.htm' : ''" v-html="item?.title"></a>
        <!-- <p class="desc" v-html="item?.summary"></p> -->
      </li>
    </ul>
    <div v-if="more" class="pl20 pr20 pb16 text-right">
      <a class="more-txt" :href="moreUrl + '.htm'" v-html="more"> </a>
    </div>
  </div>
</template>

<style scoped lang="less">
.my-a {
  color: @base-text-color;
  &:hover {
    color: @primary-color;
  }
}
.hot-products {
  background-color: #fff;
  .hot-box {
  }
  .hot-li {
    @apply relative pl16;
    white-space: break-spaces;
    line-height: @base-line-height;
    &::before {
      @apply absolute top-24 left-0 w-6 h-6 b-rd-50\%;
      content: '';
      background: @base-text-color;
    }
    .name {
      @apply inline-block w-full;
      // @apply inline-block text-ellipsis whitespace-nowrap font-700 pb4 w-full overflow-hidden;
      list-style-position: inside;
      width: 100%;
    }
    .desc {
      color: @text-gray-color;
    }
  }
  .more-txt {
    color: @primary-text-color;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
