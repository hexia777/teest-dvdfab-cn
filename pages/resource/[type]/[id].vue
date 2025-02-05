<script setup lang="ts">
definePageMeta({
  middleware: ['get-resource-drm-topic-detail'],
})
const { resource, recommendProducts, categoryArticle, productInfo, recommendArticleList } = useArticlePage()
// await getArticlePageData('resource', 'resource')
const locale = useStore.common().locale
const $t = useI18n().value
const initUrl = (url: string) => {
  return locale === 'en' && url === 'drm' ? '/downloader.htm' : '/resource/' + url.replace(/_/g, '-')
}
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
      label: $t.common.resources,
      link: '/resource',
    },
    {
      label: $t.resource[`res_title_${resource?.type}`],
      link: initUrl(`${resource?.type}`),
    },
    {
      label: resource.title,
    },
  ],
  bgClass: 'bg-playerfab',
}
// 文章头部卡片
const summaryDiffData = {
  subType: $t.resource[`res_title_${resource?.type}`],
  subUrl: initUrl(`${resource?.type}`),
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
      type="resource"
    />
  </div>
</template>

<style scoped></style>
