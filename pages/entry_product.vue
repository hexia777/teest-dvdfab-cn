<script setup lang="ts">
const { blockData, boxImage, seoData, product, articleInfoLevel, getBlockMacData, getStreamFabUserType } =
  useProductPage()
usePageSeo(useBlocksDataByOs(seoData.value))
useShowOsSwitch().value = blockData.value.win && blockData.value.mac && useRoute().query.isOsShow
useHasMacPro().value = getStrapiData((product as any).related_products?.data[0])

useProInfo().value = product.value.find(
  (item) => item.system === 'win' || item.system === 'both' || item.system === 'android',
)
useMacProInfo().value = product.value.find((item) => item.system === 'mac' || item.system === 'ios') || {}
useProLine().value = useProInfo().value?.productLine
useStore.product().setCurrentPid(useProInfo().value?.pid)
useStore.common().setPageType('product')
const isMobobile = useStore.common().mobile

const themeMap: any = {
  streamfab_for_android: 'streamfab',
  dvdfab_365: 'streamfab',
}
let productLine = useProInfo().value
  ? useProInfo().value?.productLine || useMacProInfo().value?.productLine
  : 'dvdfab12'
productLine = themeMap[productLine] || productLine
const themeClass = 'theme-' + productLine
// 获取 StreamFab 用户类型 & 流量类型
const getUserTypeAndNetLevel = computed(() => {
  const route = useRoute()
  const productLine = useStore.promotion().productLine
  const userTags: any = useStore.common()?.userTagsRes
  const params: any = productLine === 'streamfab' ? getStreamFabUserType(userTags, route) : {}
  // 对接 strapi 的 article_info
  if (articleInfoLevel.value) {
    params.article_info = {
      level: articleInfoLevel.value,
    }
  }
  return params
})
</script>

<template>
  <div v-if="Object.keys(blockData).length" :class="[themeClass, { 'is-mobile': isMobobile }]">
    <client-only>
      <!-- elk上报公共参数 -->
      <div
        :data-warden-g-parm="
          base64Encode({
            ...getUserTypeAndNetLevel,
          })
        "
      ></div>
    </client-only>
    <template v-for="item in blockData.win" :key="item.id">
      <component
        :is="dynamicComponent(item.component_dir, item.component_file_name)"
        :data-component-id="item.component_file_name"
        v-bind="{
          ...removeBlocksDataNullKey(item),
          product: product,
          boxImage,
          macData: getBlockMacData(item.__component),
        }"
      />
    </template>
  </div>
</template>
