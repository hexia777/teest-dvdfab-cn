<script setup lang="ts">
// todo 这里的中间件应该可以删除，在page:extend时候已经注入，这里的不会生效
definePageMeta({
  middleware: ['get-resource-drm-topic-detail'],
})

const { resource, recommendProducts, categoryArticle, productInfo, recommendArticleList } = useArticlePage()

const os = useOs().value
const topBannerPid = computed(() => {
  return resource[`${os === 'mac' ? 'mac_' : ''}product_top_banner`] || resource.product_base_banner
})
useStore.common().setPageType('product_article')
useArticlePageHead(resource)
const breadcrumbData = {
  hasBg: true,
  list: [
    {
      label: useI18n().value.article.home,
      link: '/',
      active: true,
    },
    {
      label: productInfo[topBannerPid.value]?.product_name_new,
      link: productInfo[topBannerPid.value]?.route_new,
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
    <PagesArticle
      v-if="resource && resource.content"
      :breadcrumb-data="breadcrumbData"
      :resource="resource"
      :recommend-products="recommendProducts"
      :category-article="categoryArticle"
      :product-info="productInfo"
      :recommend-article-list="recommendArticleList"
      type="drmdownloader"
    />
  </div>
</template>

<style scoped></style>
