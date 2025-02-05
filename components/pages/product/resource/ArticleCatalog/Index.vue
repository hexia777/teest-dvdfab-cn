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
  isFixed: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    ref="catalogRef"
    class="catalog-wrap sticky sticky-box sidebar-directorys"
    :class="{ 'sticky-box': isFixed }"
  >
    <PagesProductResourceArticleWithBgTitle :title="title" />
    <PagesProductResourceArticleCatalogBase :catalog="items" />
  </div>
</template>

<style scoped lang="less">
.my-a {
  color: @base-text-color;
  &:hover {
    color: @primary-color;
  }
}
.catalog-wrap {
  background: #fff;
  .more-txt {
    color: @primary-text-color;
  }
}
</style>
