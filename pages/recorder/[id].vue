<script setup lang="ts">
const $t = useI18n().value
definePageMeta({
  middleware: ['get-resource-drm-topic-detail'],
})
const { resource, recommendProducts, categoryArticle, productInfo, recommendArticleList } = useArticlePage()
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
      label: $t.resource.recorder,
      link: `/recorder.htm`,
    },
    {
      label: resource.title,
    },
  ],
  bgClass: 'bg-playerfab',
}
// 文章头部卡片
const summaryDiffData = {
  summary: resource.summary ? $t.article.summary + resource.summary : '',
  subType: $t.resource.recorder,
  subUrl: '/recorder.htm',
}
</script>

<template>
  <div>
    <PagesArticle
      v-if="resource && resource.content"
      :breadcrumb-data="breadcrumbData"
      :summary-diff-data="summaryDiffData"
      :resource="resource"
      :recommend-products="recommendProducts"
      :category-article="categoryArticle"
      :product-info="productInfo"
      :recommend-article-list="recommendArticleList"
      type="recorder"
    />
  </div>
</template>

<style scoped></style>
