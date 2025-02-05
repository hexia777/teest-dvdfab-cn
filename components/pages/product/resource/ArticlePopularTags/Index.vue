<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
    required: true,
  },
  items: {
    type: Array<any>,
    default: () => [],
    required: true,
  },
})
</script>

<template>
  <div class="popular-tags">
    <PagesProductResourceArticleWithBgTitle :title="title" />
    <div class="key-word-box p20 my-a">
      <template v-for="(item, index) in items" :key="index">
        <a v-if="item.title" :href="item.href" v-html="item.title"></a>
      </template>
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
.popular-tags {
  background-color: #fff;
  :deep(.with-bg-title .title) {
    &:before {
      background: @secondary-color;
      box-shadow: -3px 0px 5px 0px rgba(255, 144, 0, 0.3);
    }
  }
}

.key-word-box {
  display: flex;
  flex-flow: row wrap;
  gap: 12px 6px;
  a {
    @apply inline-block pl12 pr12 pt4 pb4 font-size-14 text-center min-w-96;
    line-height: @base-line-height;
    border: 1px dashed #c4e1eb;
    color: #888;
    border-radius: @b-radius-md;
  }
  a:hover {
    border-color: @primary-color;
    color: @primary-color;
  }
}
</style>
