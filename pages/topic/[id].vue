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
      label: $t.resource.topics,
      link: `/${resource?.product_url}.htm`,
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
  subType: $t.topic.streamimg_topics,
  subUrl: '/' + resource.product_url + '.htm',
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
      type="topic"
    />
  </div>
</template>

<style scoped></style>
