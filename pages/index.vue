<script setup lang="ts">
// const Banner = resolveComponent('BlocksHomeBanner')

const { apiHome } = useApi()

const blockData = ref<any[]>([])
const { data: homeRes, error } = await apiHome.index({
  'populate[seo][populate]': '*',
  'populate[blocks][populate]': `items,media,blockClass,items.media,bottomLink,
  items.banner,items.descSub,lineList,items.home_product_card,items.home_product_card.items,
  items.home_product_card.items.media,more,items.home_product_card.items.items,
  items.home_product_card.items.iconLink`,
  locale: useStore.common().locale,
})
if (error.value) {
  throw createError({ statusCode: 500, statusMessage: 'Server Error' })
}

if (homeRes.value && homeRes.value.data) {
  blockData.value = formatBlocksData(getStrapiData(homeRes.value)?.blocks)
  // console.log('index=========================index', blockData.value)
  if (!useStore.common().mobile) {
    usePageOtherHead({
      script: [
        {
          src: 'https://c.dvdfab.cn/wow/wow.js',
          async: true,
        },
      ],
    })
  }
  const data = getStrapiData(homeRes.value)
  usePageSeo({ title: data?.title, ...(data?.seo || {}) })
  data.urlType && useStore.common().setPageType(data.urlType)
}

// 动画js
const wowJs = () => {
  if (useStore.common().mobile) {
    return
  }
  if (window.WOW) {
    const wow = new window.WOW({
      boxClass: 'wow', // animated element css class (default is wow)
      animateClass: 'animated', // animation css class (default is animated)
      offset: 50, // distance to the element when triggering the animation (default is 0)
      mobile: false, // trigger animations on mobile devices (default is true)
      live: true, // act on asynchronously loaded content (default is true)
      scrollContainer: null, // optional scroll container selector, otherwise use window
    })
    wow.init()
  }
}

onMounted(() => {
  wowJs()
})
</script>

<template>
  <div class="page-index">
    <!-- 暂时没有合适的文案作为H1标题 -->
    <h1 style="display: none">DVDFab</h1>
    <template v-for="(item, index) in blockData" :key="index">
      <component
        :is="dynamicComponent(item.component_dir, item.component_file_name)"
        :data-component-id="item.component_file_name"
        v-bind="{
          ...removeBlocksDataNullKey(item),
        }"
      />
    </template>
  </div>
</template>

<style lang="less" src="@/assets/style/animation.less"></style>
<style scoped lang="less">
// .page-index {
//   // 导航栏高度
//   @apply pt82;

//   @media (max-width: 768px) {
//     // 导航栏高度
//     @apply pt52;
//   }
// }
</style>
