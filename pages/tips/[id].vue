<script setup lang="ts">
definePageMeta({
  middleware: ['get-resource-drm-topic-detail'],
})
const { resource, relatedTips, relatedResource, categoryArticle, productInfo } = useArticlePage()
const $t = useI18n().value

// useStore.common().setPageType('tips')
useArticlePageHead(resource)
const breadcrumbData = {
  hasBg: true,
  list: [
    {
      label: $t.article.home,
      link: '/',
      active: true,
    },
    {
      label: $t.article.tips,
      link: `/tips.htm`,
    },
    {
      label: resource.title,
    },
    {
      label: '',
    },
  ],
}
</script>

<template>
  <div>
    <PagesArticleTipsArticle
      v-if="resource && resource.content"
      :breadcrumb-data="breadcrumbData"
      :resource="resource"
      :category-article="categoryArticle"
      :product-info="productInfo"
      :related-tips="relatedTips"
      :related-resource="relatedResource"
      type="tips"
    />
  </div>
</template>

<style scoped></style>
